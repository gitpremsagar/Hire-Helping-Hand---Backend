import "dotenv/config";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { AppError, ErrorTypes, handleError, sendSuccess } from "../../utils/controllerErrorHandler.js";

const prisma = new PrismaClient();


// Helper function to generate access token
const generateAccessToken = (userId: string): string => {
  try {
    if (!process.env.JWT_SECRET) {
      throw ErrorTypes.JWT_SECRET_MISSING();
    }
    return jwt.sign({ userId, type: "access" }, process.env.JWT_SECRET, {
      expiresIn: "15m", // Short-lived access token
    });
  } catch (error) {
    throw new AppError("Failed to generate access token", 500);
  }
};

// Helper function to generate refresh token
const generateRefreshToken = (userId: string): string => {
  try {
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new AppError("JWT refresh secret is not configured", 500);
    }
    return jwt.sign({ userId, type: "refresh" }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d", // Long-lived refresh token
    });
  } catch (error) {
    throw new AppError("Failed to generate refresh token", 500);
  }
};

// Helper function to save refresh token to database
const saveRefreshToken = async (userId: string, token: string): Promise<void> => {
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  } catch (error) {
    throw new AppError("Failed to save refresh token", 500);
  }
};

// Helper function to revoke refresh token
const revokeRefreshToken = async (token: string): Promise<void> => {
  try {
    await prisma.refreshToken.updateMany({
      where: { token },
      data: { isRevoked: true },
    });
  } catch (error) {
    throw new AppError("Failed to revoke refresh token", 500);
  }
};

// Helper function to revoke all user refresh tokens
const revokeAllUserRefreshTokens = async (userId: string): Promise<void> => {
  try {
    await prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  } catch (error) {
    throw new AppError("Failed to revoke user refresh tokens", 500);
  }
};

// Helper function to hash password
const hashPassword = async (password: string): Promise<string> => {
  try {
    const saltRounds = process.env.BCRYPT_SALT_ROUNDS;
    if (!saltRounds) {
      throw ErrorTypes.BCRYPT_CONFIG_MISSING();
    }
    return await bcrypt.hash(password, +saltRounds);
  } catch (error) {
    throw new AppError("Failed to hash password", 500);
  }
};

// Helper function to compare password
const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new AppError("Failed to compare password", 500);
  }
};

// Register controller
export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, isFreelancer, isClient } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw ErrorTypes.ALREADY_EXISTS("User with this email");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isFreelancer,
        isClient,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isFreelancer: true,
        isClient: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        createdAt: true,
      },
    });

    // Generate access and refresh tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    
    // Save refresh token to database
    await saveRefreshToken(user.id, refreshToken);

    sendSuccess(res, "User registered successfully", {
      user,
      accessToken,
      refreshToken,
    }, 201);
  } catch (error) {
    handleError(error, res, "Failed to register user");
  }
};

// Login controller
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw ErrorTypes.INVALID_CREDENTIALS();
    }

    // Check if user is active
    if (user.isDeleted || user.isSuspended || user.isBlocked) {
      throw ErrorTypes.ACCOUNT_INACTIVE();
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw ErrorTypes.INVALID_CREDENTIALS();
    }

    // Generate access and refresh tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    
    // Save refresh token to database
    await saveRefreshToken(user.id, refreshToken);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    sendSuccess(res, "Login successful", {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    handleError(error, res, "Failed to login");
  }
};

// Logout controller
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      // Revoke the specific refresh token
      await revokeRefreshToken(refreshToken);
    }
    
    sendSuccess(res, "Logout successful");
  } catch (error) {
    handleError(error, res, "Failed to logout");
  }
};

// Refresh token controller
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw ErrorTypes.VALIDATION_ERROR("Refresh token is required");
    }

    // Verify refresh token
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new AppError("JWT refresh secret is not configured", 500);
    }

    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw ErrorTypes.VALIDATION_ERROR("Invalid or expired refresh token");
    }

    if (decoded.type !== "refresh") {
      throw ErrorTypes.VALIDATION_ERROR("Invalid token type");
    }

    // Check if refresh token exists in database and is not revoked
    const tokenRecord = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        userId: decoded.userId,
        isRevoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!tokenRecord) {
      throw ErrorTypes.VALIDATION_ERROR("Invalid or expired refresh token");
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        isFreelancer: true,
        isClient: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        isDeleted: true,
        isSuspended: true,
        isBlocked: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw ErrorTypes.NOT_FOUND("User");
    }

    // Check if user is active
    if (user.isDeleted || user.isSuspended || user.isBlocked) {
      throw ErrorTypes.ACCOUNT_INACTIVE();
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user.id);

    // Optionally generate new refresh token (refresh token rotation)
    const newRefreshToken = generateRefreshToken(user.id);

    // Revoke old refresh token and save new one
    await revokeRefreshToken(refreshToken);
    await saveRefreshToken(user.id, newRefreshToken);

    sendSuccess(res, "Token refreshed successfully", {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    handleError(error, res, "Failed to refresh token");
  }
};

// Forgot password controller
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists or not for security
      sendSuccess(res, "If the email exists, a password reset link has been sent");
      return;
    }

    // Generate reset token (in a real app, you'd send this via email)
    if (!process.env.JWT_SECRET) {
      throw ErrorTypes.JWT_SECRET_MISSING();
    }
    const resetToken = jwt.sign(
      { userId: user.id, type: "password_reset" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // TODO: Send email with reset token
    // For now, we'll just return success
    console.log(`Password reset token for ${email}: ${resetToken}`);

    sendSuccess(res, "If the email exists, a password reset link has been sent");
  } catch (error) {
    handleError(error, res, "Failed to process password reset request");
  }
};

// Reset password controller
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    // Verify reset token
    if (!process.env.JWT_SECRET) {
      throw ErrorTypes.JWT_SECRET_MISSING();
    }
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw ErrorTypes.VALIDATION_ERROR("Invalid or expired reset token");
    }

    if (decoded.type !== "password_reset") {
      throw ErrorTypes.VALIDATION_ERROR("Invalid reset token");
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw ErrorTypes.NOT_FOUND("User");
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    sendSuccess(res, "Password reset successfully");
  } catch (error) {
    handleError(error, res, "Failed to reset password");
  }
};

// Verify email controller
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    // Verify email token
    if (!process.env.JWT_SECRET) {
      throw ErrorTypes.JWT_SECRET_MISSING();
    }
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw ErrorTypes.VALIDATION_ERROR("Invalid or expired verification token");
    }

    if (decoded.type !== "email_verification") {
      throw ErrorTypes.VALIDATION_ERROR("Invalid verification token");
    }

    // Find user and update email verification status
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw ErrorTypes.NOT_FOUND("User");
    }

    if (user.isEmailVerified) {
      throw ErrorTypes.ALREADY_EXISTS("Email verification");
    }

    // Update email verification status
    await prisma.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true },
    });

    sendSuccess(res, "Email verified successfully");
  } catch (error) {
    handleError(error, res, "Failed to verify email");
  }
};

// Verify phone controller
export const verifyPhone = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, code } = req.body;

    // In a real application, you would:
    // 1. Verify the code against what was sent via SMS
    // 2. Check if the code is still valid (not expired)
    // 3. Update the user's phone verification status

    // For now, we'll simulate phone verification
    // TODO: Implement actual SMS verification logic

    // Find user by phone number
    const user = await prisma.user.findFirst({
      where: { phone },
    });

    if (!user) {
      throw ErrorTypes.NOT_FOUND("User with this phone number");
    }

    if (user.isPhoneVerified) {
      throw ErrorTypes.ALREADY_EXISTS("Phone verification");
    }

    // Simulate code verification (replace with actual SMS verification)
    if (code !== "1234") {
      throw ErrorTypes.VALIDATION_ERROR("Invalid verification code");
    }

    // Update phone verification status
    await prisma.user.update({
      where: { id: user.id },
      data: { isPhoneVerified: true },
    });

    sendSuccess(res, "Phone number verified successfully");
  } catch (error) {
    handleError(error, res, "Failed to verify phone number");
  }
};

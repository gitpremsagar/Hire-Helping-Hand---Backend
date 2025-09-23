import "dotenv/config";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma, withTransaction } from "../../lib/prisma.js";
import { AppError, ErrorTypes, handleError, sendSuccess } from "../../utils/controllerErrorHandler.js";
import { appConfig, getRefreshTokenExpirationDate } from "../../config/app.config.js";


// Helper function to generate access token
const generateAccessToken = (userId: string): string => {
  try {
    if (!appConfig.jwt.accessToken.secret) {
      throw ErrorTypes.JWT_SECRET_MISSING();
    }
    return jwt.sign(
      { userId, type: "access" }, 
      appConfig.jwt.accessToken.secret as string, 
      { expiresIn: appConfig.jwt.accessToken.expiresIn } as jwt.SignOptions
    );
  } catch (error) {
    throw new AppError("Failed to generate access token", 500);
  }
};

// Helper function to generate refresh token
const generateRefreshToken = (userId: string): string => {
  try {
    if (!appConfig.jwt.refreshToken.secret) {
      throw new AppError("JWT refresh secret is not configured", 500);
    }
    return jwt.sign(
      { userId, type: "refresh" }, 
      appConfig.jwt.refreshToken.secret as string, 
      { expiresIn: appConfig.jwt.refreshToken.expiresIn } as jwt.SignOptions
    );
  } catch (error) {
    throw new AppError("Failed to generate refresh token", 500);
  }
};

// Helper function to delete all user refresh tokens
const deleteAllUserRefreshTokens = async (userId: string): Promise<void> => {
  try {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  } catch (error) {
    throw new AppError("Failed to delete user refresh tokens", 500);
  }
};

// Helper function to hash password
const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, appConfig.password.saltRounds);
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

// Sign Up controller
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

    // Use transaction to ensure data consistency
    const result = await withTransaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
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

      // Generate tokens with actual user ID
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      // Save refresh token to database
      const expiresAt = getRefreshTokenExpirationDate();
      await tx.refreshToken.create({
        data: {
          userId: user.id,
          refreshToken,
          expiresAt,
        },
      });

      return {
        user,
        accessToken,
        refreshToken,
      };
    });

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: appConfig.cookies.secure,
      sameSite: appConfig.cookies.sameSite,
      maxAge: appConfig.cookies.maxAge,
    });

    sendSuccess(res, "User signed up successfully", {
      user: result.user,
      accessToken: result.accessToken,
    }, 201);
  } catch (error) {
    handleError(error, res, "Failed to sign up user");
  }
};

// Login controller with email and password
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

    // Use transaction to ensure token creation is atomic
    const result = await withTransaction(async (tx) => {
      // Generate access and refresh tokens
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      
      // Save refresh token to database
      const expiresAt = getRefreshTokenExpirationDate();
      await tx.refreshToken.create({
        data: {
          userId: user.id,
          refreshToken,
          expiresAt,
        },
      });

      return {
        accessToken,
        refreshToken,
      };
    });

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: appConfig.cookies.secure,
      sameSite: appConfig.cookies.sameSite,
      maxAge: appConfig.cookies.maxAge,
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    sendSuccess(res, "Login successful", {
      user: userWithoutPassword,
      accessToken: result.accessToken,
    });
  } catch (error) {
    handleError(error, res, "Failed to login");
  }
};

// Logout controller
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get refresh token from HTTP-only cookie
    const refreshToken = req.cookies?.refreshToken;
    
    if (refreshToken) {
      // Delete the specific refresh token from database
      await prisma.refreshToken.deleteMany({
        where: { refreshToken: refreshToken },
      });
    }
    
    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: appConfig.cookies.secure,
      sameSite: appConfig.cookies.sameSite,
    });
    
    sendSuccess(res, "Logout successful");
  } catch (error) {
    handleError(error, res, "Failed to logout");
  }
};

// Refresh token controller
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get refresh token from HTTP-only cookie
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw ErrorTypes.VALIDATION_ERROR("Refresh token is required");
    }

    // Verify refresh token
    if (!appConfig.jwt.refreshToken.secret) {
      throw new AppError("JWT refresh secret is not configured", 500);
    }

    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, appConfig.jwt.refreshToken.secret as string);
    } catch (error) {
      throw ErrorTypes.VALIDATION_ERROR("Invalid or expired refresh token");
    }

    if (decoded.type !== "refresh") {
      throw ErrorTypes.VALIDATION_ERROR("Invalid token type");
    }

    // Check if refresh token exists in database and is not revoked
    const tokenRecord = await prisma.refreshToken.findFirst({
      where: {
        refreshToken: refreshToken,
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

    // Use transaction to ensure token rotation is atomic
    const result = await withTransaction(async (tx) => {
      // Generate new access token
      const newAccessToken = generateAccessToken(user.id);

      // Generate new refresh token (refresh token rotation)
      const newRefreshToken = generateRefreshToken(user.id);

      // Delete old refresh token
      await tx.refreshToken.deleteMany({
        where: { refreshToken: refreshToken },
      });

      // Save new refresh token
      const expiresAt = getRefreshTokenExpirationDate();
      await tx.refreshToken.create({
        data: {
          userId: user.id,
          refreshToken: newRefreshToken,
          expiresAt,
        },
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    });

    // Set new refresh token as HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: appConfig.cookies.secure,
      sameSite: appConfig.cookies.sameSite,
      maxAge: appConfig.cookies.maxAge,
    });

    sendSuccess(res, "Token refreshed successfully", {
      accessToken: result.accessToken,
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
    if (!appConfig.jwt.passwordResetToken.secret) {
      throw ErrorTypes.JWT_SECRET_MISSING();
    }
    const resetToken = jwt.sign(
      { userId: user.id, type: "password_reset" },
      appConfig.jwt.passwordResetToken.secret as string,
      { expiresIn: appConfig.jwt.passwordResetToken.expiresIn } as jwt.SignOptions
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
    if (!appConfig.jwt.passwordResetToken.secret) {
      throw ErrorTypes.JWT_SECRET_MISSING();
    }
    let decoded: any;
    try {
      decoded = jwt.verify(token, appConfig.jwt.passwordResetToken.secret as string);
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
    if (!appConfig.jwt.emailVerificationToken.secret) {
      throw ErrorTypes.JWT_SECRET_MISSING();
    }
    let decoded: any;
    try {
      decoded = jwt.verify(token, appConfig.jwt.emailVerificationToken.secret as string);
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

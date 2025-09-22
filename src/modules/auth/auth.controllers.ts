import "dotenv/config";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient, Prisma } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Custom error types
class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handling utility
const handleError = (error: unknown, res: Response, defaultMessage: string = "Internal server error"): void => {
  console.error("Error:", error);
  
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }
  
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        res.status(409).json({
          success: false,
          message: "A record with this information already exists",
        });
        return;
      case 'P2025':
        res.status(404).json({
          success: false,
          message: "Record not found",
        });
        return;
      default:
        res.status(500).json({
          success: false,
          message: "Database operation failed",
        });
        return;
    }
  }
  
  if (error instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      message: "Invalid data provided",
    });
    return;
  }
  
  res.status(500).json({
    success: false,
    message: defaultMessage,
  });
};

// Helper function to generate JWT token
const generateToken = (userId: string): string => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new AppError("JWT secret not configured", 500);
    }
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  } catch (error) {
    throw new AppError("Failed to generate authentication token", 500);
  }
};

// Helper function to hash password
const hashPassword = async (password: string): Promise<string> => {
  try {
    const saltRounds = process.env.BCRYPT_SALT_ROUNDS;
    if (!saltRounds) {
      throw new AppError("BCrypt salt rounds not configured", 500);
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
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, isFreelancer, isClient } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("User with this email already exists", 409);
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

    // Generate JWT token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
        token,
      },
    });
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
      throw new AppError("Invalid email or password", 401);
    }

    // Check if user is active
    if (!user.isActive || user.isDeleted || user.isSuspended || user.isBlocked) {
      throw new AppError("Account is inactive or suspended", 401);
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    handleError(error, res, "Failed to login");
  }
};

// Logout controller
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // In a stateless JWT implementation, logout is handled on the client side
    // by removing the token. However, you could implement token blacklisting here
    // if needed for enhanced security.
    
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    handleError(error, res, "Failed to logout");
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
      res.status(200).json({
        success: true,
        message: "If the email exists, a password reset link has been sent",
      });
      return;
    }

    // Generate reset token (in a real app, you'd send this via email)
    if (!process.env.JWT_SECRET) {
      throw new AppError("JWT secret not configured", 500);
    }
    const resetToken = jwt.sign(
      { userId: user.id, type: "password_reset" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // TODO: Send email with reset token
    // For now, we'll just return success
    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.status(200).json({
      success: true,
      message: "If the email exists, a password reset link has been sent",
    });
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
      throw new AppError("JWT secret not configured", 500);
    }
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    if (decoded.type !== "password_reset") {
      throw new AppError("Invalid reset token", 400);
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
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
      throw new AppError("JWT secret not configured", 500);
    }
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new AppError("Invalid or expired verification token", 400);
    }

    if (decoded.type !== "email_verification") {
      throw new AppError("Invalid verification token", 400);
    }

    // Find user and update email verification status
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.isEmailVerified) {
      throw new AppError("Email already verified", 400);
    }

    // Update email verification status
    await prisma.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true },
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
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
      throw new AppError("User with this phone number not found", 404);
    }

    if (user.isPhoneVerified) {
      throw new AppError("Phone number already verified", 400);
    }

    // Simulate code verification (replace with actual SMS verification)
    if (code !== "1234") {
      throw new AppError("Invalid verification code", 400);
    }

    // Update phone verification status
    await prisma.user.update({
      where: { id: user.id },
      data: { isPhoneVerified: true },
    });

    res.status(200).json({
      success: true,
      message: "Phone number verified successfully",
    });
  } catch (error) {
    handleError(error, res, "Failed to verify phone number");
  }
};

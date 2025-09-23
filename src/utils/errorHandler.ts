import type { Response } from "express";
import { Prisma } from "@prisma/client";

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Common error types with predefined status codes
 */
export const ErrorTypes = {
  // Authentication & Authorization
  UNAUTHORIZED: (message: string = "Unauthorized access") => new AppError(message, 401),
  FORBIDDEN: (message: string = "Access forbidden") => new AppError(message, 403),
  INVALID_CREDENTIALS: () => new AppError("Invalid email or password", 401),
  ACCOUNT_INACTIVE: () => new AppError("Account is inactive or suspended", 401),
  
  // Validation
  VALIDATION_ERROR: (message: string = "Validation failed") => new AppError(message, 400),
  INVALID_DATA: (message: string = "Invalid data provided") => new AppError(message, 400),
  MISSING_REQUIRED_FIELD: (field: string) => new AppError(`Missing required field: ${field}`, 400),
  
  // Resource Management
  NOT_FOUND: (resource: string = "Resource") => new AppError(`${resource} not found`, 404),
  ALREADY_EXISTS: (resource: string = "Resource") => new AppError(`${resource} already exists`, 409),
  CONFLICT: (message: string = "Resource conflict") => new AppError(message, 409),
  
  // Server Errors
  INTERNAL_ERROR: (message: string = "Internal server error") => new AppError(message, 500),
  SERVICE_UNAVAILABLE: (message: string = "Service temporarily unavailable") => new AppError(message, 503),
  
  // Configuration
  CONFIG_ERROR: (message: string = "Configuration error") => new AppError(message, 500),
  JWT_SECRET_MISSING: () => new AppError("JWT secret not configured", 500),
  BCRYPT_CONFIG_MISSING: () => new AppError("BCrypt salt rounds not configured", 500),
} as const;

/**
 * Prisma error code mappings
 */
const PRISMA_ERROR_MESSAGES: Record<string, { statusCode: number; message: string }> = {
  P2002: { statusCode: 409, message: "A record with this information already exists" },
  P2025: { statusCode: 404, message: "Record not found" },
  P2003: { statusCode: 400, message: "Foreign key constraint failed" },
  P2014: { statusCode: 400, message: "Invalid ID provided" },
  P2016: { statusCode: 400, message: "Query interpretation error" },
  P2021: { statusCode: 404, message: "Table does not exist" },
  P2022: { statusCode: 404, message: "Column does not exist" },
};

/**
 * Centralized error handling function
 * @param error - The error to handle
 * @param res - Express response object
 * @param defaultMessage - Default message if error type is unknown
 */
export const handleError = (
  error: unknown, 
  res: Response, 
  defaultMessage: string = "Internal server error"
): void => {
  console.error("Error:", error);
  
  // Handle custom AppError instances
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
    return;
  }
  
  // Handle Prisma known request errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const errorInfo = PRISMA_ERROR_MESSAGES[error.code];
    if (errorInfo) {
      res.status(errorInfo.statusCode).json({
        success: false,
        message: errorInfo.message,
        ...(process.env.NODE_ENV === 'development' && { 
          code: error.code,
          meta: error.meta 
        }),
      });
      return;
    }
    
    // Fallback for unknown Prisma error codes
    res.status(500).json({
      success: false,
      message: "Database operation failed",
      ...(process.env.NODE_ENV === 'development' && { 
        code: error.code,
        meta: error.meta 
      }),
    });
    return;
  }
  
  // Handle Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      message: "Invalid data provided",
      ...(process.env.NODE_ENV === 'development' && { 
        details: error.message 
      }),
    });
    return;
  }
  
  // Handle Prisma client initialization errors
  if (error instanceof Prisma.PrismaClientInitializationError) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      ...(process.env.NODE_ENV === 'development' && { 
        details: error.message 
      }),
    });
    return;
  }
  
  // Handle Prisma client unknown errors
  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    res.status(500).json({
      success: false,
      message: "Unknown database error",
      ...(process.env.NODE_ENV === 'development' && { 
        details: error.message 
      }),
    });
    return;
  }
  
  // Handle Zod validation errors
  if (error && typeof error === 'object' && 'issues' in error) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      ...(process.env.NODE_ENV === 'development' && { 
        details: error 
      }),
    });
    return;
  }
  
  // Handle generic errors
  if (error instanceof Error) {
    res.status(500).json({
      success: false,
      message: defaultMessage,
      ...(process.env.NODE_ENV === 'development' && { 
        details: error.message,
        stack: error.stack 
      }),
    });
    return;
  }
  
  // Handle unknown error types
  res.status(500).json({
    success: false,
    message: defaultMessage,
    ...(process.env.NODE_ENV === 'development' && { 
      details: String(error) 
    }),
  });
};

/**
 * Async error wrapper for controller functions
 * Catches async errors and passes them to the error handler
 */
export const asyncHandler = (fn: Function) => {
  return (req: any, res: Response, next: any) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      handleError(error, res);
    });
  };
};

/**
 * Success response helper
 */
export const sendSuccess = (
  res: Response, 
  message: string, 
  data?: any, 
  statusCode: number = 200
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data }),
  });
};

/**
 * Error response helper
 */
export const sendError = (
  res: Response, 
  message: string, 
  statusCode: number = 500
): void => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};

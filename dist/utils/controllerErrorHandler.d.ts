import type { Response } from "express";
/**
 * Custom error class for application-specific errors
 */
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number, isOperational?: boolean);
}
/**
 * Common error types with predefined status codes
 */
export declare const ErrorTypes: {
    readonly UNAUTHORIZED: (message?: string) => AppError;
    readonly FORBIDDEN: (message?: string) => AppError;
    readonly INVALID_CREDENTIALS: () => AppError;
    readonly ACCOUNT_INACTIVE: () => AppError;
    readonly VALIDATION_ERROR: (message?: string) => AppError;
    readonly INVALID_DATA: (message?: string) => AppError;
    readonly MISSING_REQUIRED_FIELD: (field: string) => AppError;
    readonly NOT_FOUND: (resource?: string) => AppError;
    readonly ALREADY_EXISTS: (resource?: string) => AppError;
    readonly CONFLICT: (message?: string) => AppError;
    readonly INTERNAL_ERROR: (message?: string) => AppError;
    readonly SERVICE_UNAVAILABLE: (message?: string) => AppError;
    readonly CONFIG_ERROR: (message?: string) => AppError;
    readonly JWT_SECRET_MISSING: () => AppError;
    readonly BCRYPT_CONFIG_MISSING: () => AppError;
};
/**
 * Centralized error handling function
 * @param error - The error to handle
 * @param res - Express response object
 * @param defaultMessage - Default message if error type is unknown
 */
export declare const handleError: (error: unknown, res: Response, defaultMessage?: string) => void;
/**
 * Async error wrapper for controller functions
 * Catches async errors and passes them to the error handler
 */
export declare const asyncHandler: (fn: Function) => (req: any, res: Response, next: any) => void;
/**
 * Success response helper
 */
export declare const sendSuccess: (res: Response, message: string, data?: any, statusCode?: number) => void;
/**
 * Error response helper
 */
export declare const sendError: (res: Response, message: string, statusCode?: number) => void;
//# sourceMappingURL=controllerErrorHandler.d.ts.map
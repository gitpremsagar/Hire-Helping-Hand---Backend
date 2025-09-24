import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { signUpSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema, verifyPhoneSchema, setUserRoleSchema, updateUserRoleSchema, deleteUserRoleSchema } from "./auth.schemas.js";

const validateSignUpJson = (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = signUpSchema.parse(req.body);
        req.body = validatedData;
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error instanceof z.ZodError ? error.issues : error,
        });
    }
};

const validateLoginJson = (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        req.body = validatedData;
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error instanceof z.ZodError ? error.issues : error,
        });
    }
};

const validateForgotPasswordJson = (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = forgotPasswordSchema.parse(req.body);
        req.body = validatedData;
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error instanceof z.ZodError ? error.issues : error,
        });
    }
};

const validateResetPasswordJson = (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = resetPasswordSchema.parse(req.body);
        req.body = validatedData;
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error instanceof z.ZodError ? error.issues : error,
        });
    }
};

const validateVerifyEmailJson = (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = verifyEmailSchema.parse(req.body);
        req.body = validatedData;
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error instanceof z.ZodError ? error.issues : error,
        });
    }
};

const validateVerifyPhoneJson = (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = verifyPhoneSchema.parse(req.body);
        req.body = validatedData;
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error instanceof z.ZodError ? error.issues : error,
        });
    }
};

const validateAddRoleToUserJson = (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = setUserRoleSchema.parse(req.body);
        req.body = validatedData;
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error instanceof z.ZodError ? error.issues : error,
        });
    }
};


const validateRemoveRoleFromUserJson = (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = deleteUserRoleSchema.parse(req.body);
        req.body = validatedData;
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error instanceof z.ZodError ? error.issues : error,
        });
    }
};

// Note: validateRefreshTokenJson removed since refresh token is now handled via HTTP-only cookies
// No request body validation needed for refresh token endpoint

export { validateSignUpJson, validateLoginJson, validateForgotPasswordJson, validateResetPasswordJson, validateVerifyEmailJson, validateVerifyPhoneJson, validateAddRoleToUserJson, validateRemoveRoleFromUserJson };
import { z } from "zod";
import { signUpSchema, loginSchema, refreshTokenSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema, verifyPhoneSchema } from "./auth.schemas.js";
const validateSignUpJson = (req, res, next) => {
    try {
        const validatedData = signUpSchema.parse(req.body);
        req.body = validatedData;
        next();
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error instanceof z.ZodError ? error.issues : error,
        });
    }
};
const validateLoginJson = (req, res, next) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        req.body = validatedData;
        next();
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error instanceof z.ZodError ? error.issues : error,
        });
    }
};
const validateForgotPasswordJson = (req, res, next) => {
    try {
        const validatedData = forgotPasswordSchema.parse(req.body);
        req.body = validatedData;
        next();
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error instanceof z.ZodError ? error.issues : error,
        });
    }
};
const validateResetPasswordJson = (req, res, next) => {
    try {
        const validatedData = resetPasswordSchema.parse(req.body);
        req.body = validatedData;
        next();
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error instanceof z.ZodError ? error.issues : error,
        });
    }
};
const validateVerifyEmailJson = (req, res, next) => {
    try {
        const validatedData = verifyEmailSchema.parse(req.body);
        req.body = validatedData;
        next();
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error instanceof z.ZodError ? error.issues : error,
        });
    }
};
const validateVerifyPhoneJson = (req, res, next) => {
    try {
        const validatedData = verifyPhoneSchema.parse(req.body);
        req.body = validatedData;
        next();
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error instanceof z.ZodError ? error.issues : error,
        });
    }
};
const validateRefreshTokenJson = (req, res, next) => {
    try {
        const validatedData = refreshTokenSchema.parse(req.body);
        req.body = validatedData;
        next();
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error instanceof z.ZodError ? error.issues : error,
        });
    }
};
export { validateSignUpJson, validateLoginJson, validateRefreshTokenJson, validateForgotPasswordJson, validateResetPasswordJson, validateVerifyEmailJson, validateVerifyPhoneJson };
//# sourceMappingURL=auth.validation.middlewares.js.map
import { z } from "zod";
import { 
// Parameter validation schemas
freelancerIdParamSchema, portfolioItemParamsSchema, employmentParamsSchema, educationParamsSchema, certificationParamsSchema, 
// Freelancer profile schemas
freelancerProfileSchema, portfolioItemSchema, updatePortfolioItemSchema, employmentSchema, updateEmploymentSchema, educationSchema, updateEducationSchema, certificationSchema, updateCertificationSchema } from "./freelancer.schemas.js";
// Parameter validation middleware
const validateFreelancerIdParams = (req, res, next) => {
    try {
        const validatedParams = freelancerIdParamSchema.parse(req.params);
        req.params = validatedParams;
        next();
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Parameter validation error",
            errors: error instanceof z.ZodError ? error.issues : error,
        });
    }
};
const validatePortfolioItemParams = (req, res, next) => {
    try {
        const validatedParams = portfolioItemParamsSchema.parse(req.params);
        req.params = validatedParams;
        next();
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Parameter validation error",
            errors: error instanceof z.ZodError ? error.issues : error,
        });
    }
};
const validateEmploymentParams = (req, res, next) => {
    try {
        const validatedParams = employmentParamsSchema.parse(req.params);
        req.params = validatedParams;
        next();
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Parameter validation error",
            errors: error instanceof z.ZodError ? error.issues : error,
        });
    }
};
const validateEducationParams = (req, res, next) => {
    try {
        const validatedParams = educationParamsSchema.parse(req.params);
        req.params = validatedParams;
        next();
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Parameter validation error",
            errors: error instanceof z.ZodError ? error.issues : error,
        });
    }
};
const validateCertificationParams = (req, res, next) => {
    try {
        const validatedParams = certificationParamsSchema.parse(req.params);
        req.params = validatedParams;
        next();
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Parameter validation error",
            errors: error instanceof z.ZodError ? error.issues : error,
        });
    }
};
// Freelancer profile validation
const validateFreelancerProfileJson = (req, res, next) => {
    try {
        const validatedData = freelancerProfileSchema.parse(req.body);
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
// Portfolio item validation
const validatePortfolioItemJson = (req, res, next) => {
    try {
        const validatedData = portfolioItemSchema.parse(req.body);
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
const validateUpdatePortfolioItemJson = (req, res, next) => {
    try {
        const validatedData = updatePortfolioItemSchema.parse(req.body);
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
// Employment validation
const validateEmploymentJson = (req, res, next) => {
    try {
        const validatedData = employmentSchema.parse(req.body);
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
const validateUpdateEmploymentJson = (req, res, next) => {
    try {
        const validatedData = updateEmploymentSchema.parse(req.body);
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
// Education validation
const validateEducationJson = (req, res, next) => {
    try {
        const validatedData = educationSchema.parse(req.body);
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
const validateUpdateEducationJson = (req, res, next) => {
    try {
        const validatedData = updateEducationSchema.parse(req.body);
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
// Certification validation
const validateCertificationJson = (req, res, next) => {
    try {
        const validatedData = certificationSchema.parse(req.body);
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
const validateUpdateCertificationJson = (req, res, next) => {
    try {
        const validatedData = updateCertificationSchema.parse(req.body);
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
export { validateFreelancerIdParams, validatePortfolioItemParams, validateEmploymentParams, validateEducationParams, validateCertificationParams, validateFreelancerProfileJson, validatePortfolioItemJson, validateUpdatePortfolioItemJson, validateEmploymentJson, validateUpdateEmploymentJson, validateEducationJson, validateUpdateEducationJson, validateCertificationJson, validateUpdateCertificationJson, };
//# sourceMappingURL=freelancer.validation.middlewares.js.map
import { z } from "zod";
import { createUserLanguageSchema, updateUserLanguageSchema, userLanguageIdSchema, getUserLanguagesQuerySchema } from "./userLanguage.schemas.js";
const validateCreateUserLanguageJson = (req, res, next) => {
    try {
        const validatedData = createUserLanguageSchema.parse(req.body);
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
const validateUpdateUserLanguageJson = (req, res, next) => {
    try {
        const validatedData = updateUserLanguageSchema.parse(req.body);
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
const validateUserLanguageId = (req, res, next) => {
    try {
        const validatedData = userLanguageIdSchema.parse(req.params);
        // Store validated data in a custom property to avoid type conflicts
        req.validatedParams = validatedData;
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
const validateGetUserLanguagesQuery = (req, res, next) => {
    try {
        const validatedData = getUserLanguagesQuerySchema.parse(req.query);
        // Store validated data in a custom property to avoid type conflicts
        req.validatedQuery = validatedData;
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
export { validateCreateUserLanguageJson, validateUpdateUserLanguageJson, validateUserLanguageId, validateGetUserLanguagesQuery };
//# sourceMappingURL=userLanguage.validation.middlewares.js.map
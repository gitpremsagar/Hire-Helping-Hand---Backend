import { z } from "zod";
import { createUserRoleSchema, updateUserRoleSchema, userRoleIdSchema, getUserRolesQuerySchema } from "./userRole.schemas.js";
const validateCreateUserRoleJson = (req, res, next) => {
    try {
        const validatedData = createUserRoleSchema.parse(req.body);
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
const validateUpdateUserRoleJson = (req, res, next) => {
    try {
        const validatedData = updateUserRoleSchema.parse(req.body);
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
const validateUserRoleId = (req, res, next) => {
    try {
        const validatedData = userRoleIdSchema.parse(req.params);
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
const validateGetUserRolesQuery = (req, res, next) => {
    try {
        const validatedData = getUserRolesQuerySchema.parse(req.query);
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
export { validateCreateUserRoleJson, validateUpdateUserRoleJson, validateUserRoleId, validateGetUserRolesQuery };
//# sourceMappingURL=userRole.validation.middlewares.js.map
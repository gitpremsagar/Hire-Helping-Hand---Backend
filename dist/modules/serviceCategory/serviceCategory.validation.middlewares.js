import { z } from "zod";
import { createServiceCategorySchema, updateServiceCategorySchema, serviceCategoryIdSchema, getServiceCategoriesQuerySchema } from "./serviceCategory.schemas.js";
const validateCreateServiceCategoryJson = (req, res, next) => {
    try {
        const validatedData = createServiceCategorySchema.parse(req.body);
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
const validateUpdateServiceCategoryJson = (req, res, next) => {
    try {
        const validatedData = updateServiceCategorySchema.parse(req.body);
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
const validateServiceCategoryId = (req, res, next) => {
    try {
        const validatedData = serviceCategoryIdSchema.parse(req.params);
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
const validateGetServiceCategoriesQuery = (req, res, next) => {
    try {
        const validatedData = getServiceCategoriesQuerySchema.parse(req.query);
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
export { validateCreateServiceCategoryJson, validateUpdateServiceCategoryJson, validateServiceCategoryId, validateGetServiceCategoriesQuery };
//# sourceMappingURL=serviceCategory.validation.middlewares.js.map
import { z } from "zod";
import { createServiceCategorySchema, updateServiceCategorySchema, serviceCategoryIdSchema, serviceCategorySlugSchema, getServiceCategoriesQuerySchema, reorderServiceCategoriesSchema } from "./serviceCategory.schemas.js";
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
const validateServiceCategorySlug = (req, res, next) => {
    try {
        const validatedData = serviceCategorySlugSchema.parse(req.params);
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
const validateReorderServiceCategoriesJson = (req, res, next) => {
    try {
        const validatedData = reorderServiceCategoriesSchema.parse(req.body);
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
export { validateCreateServiceCategoryJson, validateUpdateServiceCategoryJson, validateServiceCategoryId, validateServiceCategorySlug, validateGetServiceCategoriesQuery, validateReorderServiceCategoriesJson };
//# sourceMappingURL=serviceCategory.validation.middlewares.js.map
import { z } from "zod";
import { createServiceSubCategorySchema, updateServiceSubCategorySchema, serviceSubCategoryIdSchema, serviceSubCategorySlugSchema, getServiceSubCategoriesQuerySchema, reorderServiceSubCategoriesSchema } from "./serviceSubCategory.schemas.js";
const validateCreateServiceSubCategoryJson = (req, res, next) => {
    try {
        const validatedData = createServiceSubCategorySchema.parse(req.body);
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
const validateUpdateServiceSubCategoryJson = (req, res, next) => {
    try {
        const validatedData = updateServiceSubCategorySchema.parse(req.body);
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
const validateServiceSubCategoryId = (req, res, next) => {
    try {
        const validatedData = serviceSubCategoryIdSchema.parse(req.params);
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
const validateServiceSubCategorySlug = (req, res, next) => {
    try {
        const validatedData = serviceSubCategorySlugSchema.parse(req.params);
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
const validateGetServiceSubCategoriesQuery = (req, res, next) => {
    try {
        const validatedData = getServiceSubCategoriesQuerySchema.parse(req.query);
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
const validateReorderServiceSubCategoriesJson = (req, res, next) => {
    try {
        const validatedData = reorderServiceSubCategoriesSchema.parse(req.body);
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
export { validateCreateServiceSubCategoryJson, validateUpdateServiceSubCategoryJson, validateServiceSubCategoryId, validateServiceSubCategorySlug, validateGetServiceSubCategoriesQuery, validateReorderServiceSubCategoriesJson };
//# sourceMappingURL=serviceSubCategory.validation.middlewares.js.map
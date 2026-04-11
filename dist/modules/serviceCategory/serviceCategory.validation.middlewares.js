import { z } from "zod";
import { serviceCategoryIdSchema, serviceCategorySlugSchema, getServiceCategoriesQuerySchema, } from "./serviceCategory.schemas.js";
const validateServiceCategoryId = (req, res, next) => {
    try {
        const validatedData = serviceCategoryIdSchema.parse(req.params);
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
export { validateServiceCategoryId, validateServiceCategorySlug, validateGetServiceCategoriesQuery, };
//# sourceMappingURL=serviceCategory.validation.middlewares.js.map
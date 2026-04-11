import { z } from "zod";
import { serviceSubCategoryIdSchema, serviceSubCategorySlugSchema, getServiceSubCategoriesQuerySchema, } from "./serviceSubCategory.schemas.js";
const validateServiceSubCategoryId = (req, res, next) => {
    try {
        const validatedData = serviceSubCategoryIdSchema.parse(req.params);
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
export { validateServiceSubCategoryId, validateServiceSubCategorySlug, validateGetServiceSubCategoriesQuery, };
//# sourceMappingURL=serviceSubCategory.validation.middlewares.js.map
import { z } from "zod";
import { createSkillSchema, updateSkillSchema, skillIdSchema, getSkillsQuerySchema } from "./skill.schemas.js";
const validateCreateSkillJson = (req, res, next) => {
    try {
        const validatedData = createSkillSchema.parse(req.body);
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
const validateUpdateSkillJson = (req, res, next) => {
    try {
        const validatedData = updateSkillSchema.parse(req.body);
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
const validateSkillId = (req, res, next) => {
    try {
        const validatedData = skillIdSchema.parse(req.params);
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
const validateGetSkillsQuery = (req, res, next) => {
    try {
        const validatedData = getSkillsQuerySchema.parse(req.query);
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
export { validateCreateSkillJson, validateUpdateSkillJson, validateSkillId, validateGetSkillsQuery };
//# sourceMappingURL=skill.validation.middlewares.js.map
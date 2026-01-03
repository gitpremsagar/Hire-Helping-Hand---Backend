import { z } from "zod";
import { createFreelancingServiceSchema, updateFreelancingServiceSchema, freelancingServiceIdSchema, freelancerIdSchema, getFreelancingServicesQuerySchema, getFreelancingServicesByFreelancerQuerySchema } from "./freelancingService.schemas.js";
const validateCreateFreelancingServiceJson = (req, res, next) => {
    try {
        const validatedData = createFreelancingServiceSchema.parse(req.body);
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
const validateUpdateFreelancingServiceJson = (req, res, next) => {
    try {
        const validatedData = updateFreelancingServiceSchema.parse(req.body);
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
const validateFreelancingServiceId = (req, res, next) => {
    try {
        const validatedData = freelancingServiceIdSchema.parse(req.params);
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
const validateFreelancerId = (req, res, next) => {
    try {
        const validatedData = freelancerIdSchema.parse(req.params);
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
const validateGetFreelancingServicesQuery = (req, res, next) => {
    try {
        const validatedData = getFreelancingServicesQuerySchema.parse(req.query);
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
const validateGetFreelancingServicesByFreelancerQuery = (req, res, next) => {
    try {
        const validatedData = getFreelancingServicesByFreelancerQuerySchema.parse(req.query);
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
export { validateCreateFreelancingServiceJson, validateUpdateFreelancingServiceJson, validateFreelancingServiceId, validateFreelancerId, validateGetFreelancingServicesQuery, validateGetFreelancingServicesByFreelancerQuery };
//# sourceMappingURL=freelancingService.validation.middlewares.js.map
import { z } from "zod";
const rejectFreelancingServiceBodySchema = z.object({
    rejectionReason: z.string().max(2000).optional(),
});
export const validateRejectFreelancingServiceJson = (req, res, next) => {
    try {
        const validated = rejectFreelancingServiceBodySchema.parse(req.body ?? {});
        req.validatedBody = validated;
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
//# sourceMappingURL=admin.validation.middlewares.js.map
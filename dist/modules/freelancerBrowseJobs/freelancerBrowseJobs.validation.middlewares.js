import { z } from "zod";
import { browseFreelancerJobsQuerySchema } from "./freelancerBrowseJobs.schemas.js";
export const validateBrowseFreelancerJobsQuery = (req, res, next) => {
    try {
        const parsed = browseFreelancerJobsQuerySchema.parse(req.query);
        const page = Number.isFinite(parsed.page) && parsed.page > 0 ? parsed.page : 1;
        const limitRaw = Number.isFinite(parsed.limit) && parsed.limit > 0 ? parsed.limit : 20;
        const limit = Math.min(limitRaw, 50);
        req.validatedQuery = {
            categorySlug: parsed.categorySlug,
            subCategorySlug: parsed.subCategorySlug,
            page,
            limit,
        };
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
//# sourceMappingURL=freelancerBrowseJobs.validation.middlewares.js.map
import { z } from "zod";
export const browseFreelancerJobsQuerySchema = z.object({
    categorySlug: z.string().min(1, "categorySlug is required"),
    subCategorySlug: z.string().min(1, "subCategorySlug is required"),
    page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 20)),
});
//# sourceMappingURL=freelancerBrowseJobs.schemas.js.map
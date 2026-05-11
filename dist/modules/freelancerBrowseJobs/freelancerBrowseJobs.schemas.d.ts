import { z } from "zod";
export declare const browseFreelancerJobsQuerySchema: z.ZodObject<{
    categorySlug: z.ZodString;
    subCategorySlug: z.ZodString;
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
}, z.core.$strip>;
export type BrowseFreelancerJobsQuery = z.infer<typeof browseFreelancerJobsQuerySchema>;
//# sourceMappingURL=freelancerBrowseJobs.schemas.d.ts.map
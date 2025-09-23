import { z } from "zod";
declare const createServiceCategorySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
}, z.core.$strip>;
declare const updateServiceCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const serviceCategoryIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
declare const getServiceCategoriesQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export { createServiceCategorySchema, updateServiceCategorySchema, serviceCategoryIdSchema, getServiceCategoriesQuerySchema, };
//# sourceMappingURL=serviceCategory.schemas.d.ts.map
import { z } from "zod";
declare const createServiceSubCategorySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    isNew: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    serviceCategoryId: z.ZodString;
}, z.core.$strip>;
declare const updateServiceSubCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    isNew: z.ZodOptional<z.ZodBoolean>;
    serviceCategoryId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const serviceSubCategoryIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
declare const getServiceSubCategoriesQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    search: z.ZodOptional<z.ZodString>;
    serviceCategoryId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export { createServiceSubCategorySchema, updateServiceSubCategorySchema, serviceSubCategoryIdSchema, getServiceSubCategoriesQuerySchema, };
//# sourceMappingURL=serviceSubCategory.schemas.d.ts.map
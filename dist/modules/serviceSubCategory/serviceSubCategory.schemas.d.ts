import { z } from "zod";
declare const createServiceSubCategorySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    orderNumber: z.ZodOptional<z.ZodNumber>;
    isNew: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    serviceCategoryId: z.ZodString;
}, z.core.$strip>;
declare const updateServiceSubCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    orderNumber: z.ZodOptional<z.ZodNumber>;
    isNew: z.ZodOptional<z.ZodBoolean>;
    serviceCategoryId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const serviceSubCategoryIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
declare const serviceSubCategorySlugSchema: z.ZodObject<{
    slug: z.ZodString;
}, z.core.$strip>;
declare const getServiceSubCategoriesQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    search: z.ZodOptional<z.ZodString>;
    serviceCategoryId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const reorderServiceSubCategoriesSchema: z.ZodObject<{
    subCategoryOrders: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        orderNumber: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export { createServiceSubCategorySchema, updateServiceSubCategorySchema, serviceSubCategoryIdSchema, serviceSubCategorySlugSchema, getServiceSubCategoriesQuerySchema, reorderServiceSubCategoriesSchema, };
//# sourceMappingURL=serviceSubCategory.schemas.d.ts.map
import { z } from "zod";
declare const createServiceCategorySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    orderNumber: z.ZodOptional<z.ZodNumber>;
    isNew: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
declare const updateServiceCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    orderNumber: z.ZodOptional<z.ZodNumber>;
    isNew: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
declare const serviceCategoryIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
declare const serviceCategorySlugSchema: z.ZodObject<{
    slug: z.ZodString;
}, z.core.$strip>;
declare const getServiceCategoriesQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const reorderServiceCategoriesSchema: z.ZodObject<{
    categoryOrders: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        orderNumber: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export { createServiceCategorySchema, updateServiceCategorySchema, serviceCategoryIdSchema, serviceCategorySlugSchema, getServiceCategoriesQuerySchema, reorderServiceCategoriesSchema, };
//# sourceMappingURL=serviceCategory.schemas.d.ts.map
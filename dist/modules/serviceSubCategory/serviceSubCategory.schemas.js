import { z } from "zod";
import { ServiceCategory, ServiceSubCategory } from "@prisma/client";
const serviceSubCategoryIdSchema = z.object({
    id: z.nativeEnum(ServiceSubCategory),
});
const serviceSubCategorySlugSchema = z.object({
    slug: z.string().min(1, "Service subcategory slug is required"),
});
const getServiceSubCategoriesQuerySchema = z.object({
    page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
    limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 100),
    search: z.string().optional(),
    serviceCategoryId: z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : v), z.nativeEnum(ServiceCategory).optional()),
});
export { serviceSubCategoryIdSchema, serviceSubCategorySlugSchema, getServiceSubCategoriesQuerySchema, };
//# sourceMappingURL=serviceSubCategory.schemas.js.map
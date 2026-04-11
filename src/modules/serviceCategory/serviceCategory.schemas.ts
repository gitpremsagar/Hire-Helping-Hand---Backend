import { z } from "zod";
import { ServiceCategory } from "@prisma/client";

const serviceCategoryIdSchema = z.object({
  id: z.nativeEnum(ServiceCategory),
});

const serviceCategorySlugSchema = z.object({
  slug: z.string().min(1, "Service category slug is required"),
});

const getServiceCategoriesQuerySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 100),
  search: z.string().optional(),
});

export {
  serviceCategoryIdSchema,
  serviceCategorySlugSchema,
  getServiceCategoriesQuerySchema,
};

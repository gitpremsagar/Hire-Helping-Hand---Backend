import { z } from "zod";

// Validation schemas for ServiceSubCategory
const createServiceSubCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  isNew: z.boolean().optional().default(false),
  serviceCategoryId: z.string().min(1, "Service category ID is required"),
});

const updateServiceSubCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters").optional(),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters").optional(),
  isNew: z.boolean().optional(),
  serviceCategoryId: z.string().min(1, "Service category ID is required").optional(),
});

const serviceSubCategoryIdSchema = z.object({
  id: z.string().min(1, "Service subcategory ID is required"),
});

const getServiceSubCategoriesQuerySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 100),
  search: z.string().optional(),
  serviceCategoryId: z.string().optional(),
});

export {
  createServiceSubCategorySchema,
  updateServiceSubCategorySchema,
  serviceSubCategoryIdSchema,
  getServiceSubCategoriesQuerySchema,
};

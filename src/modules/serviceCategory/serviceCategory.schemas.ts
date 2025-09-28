import { z } from "zod";

// Validation schemas for ServiceCategory
const createServiceCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  icon: z.string().optional().describe("Lucide React icon name (e.g., 'Code', 'Palette', 'PenTool')"),
  slug: z.string().min(1, "Slug is required").max(100, "Slug must be less than 100 characters").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens").optional(),
  isNew: z.boolean().optional().default(false),
});

const updateServiceCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters").optional(),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters").optional(),
  icon: z.string().optional().describe("Lucide React icon name (e.g., 'Code', 'Palette', 'PenTool')"),
  slug: z.string().min(1, "Slug is required").max(100, "Slug must be less than 100 characters").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens").optional(),
  isNew: z.boolean().optional(),
});

const serviceCategoryIdSchema = z.object({
  id: z.string().min(1, "Service category ID is required"),
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
  createServiceCategorySchema,
  updateServiceCategorySchema,
  serviceCategoryIdSchema,
  serviceCategorySlugSchema,
  getServiceCategoriesQuerySchema,
};

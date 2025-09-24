import { z } from "zod";
// Validation schemas for Skill
const createSkillSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
    serviceCategoryId: z.string().min(1, "Service category ID is required"),
    serviceSubCategoryId: z.string().min(1, "Service subcategory ID is required"),
});
const updateSkillSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters").optional(),
    description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters").optional(),
    serviceCategoryId: z.string().min(1, "Service category ID is required").optional(),
    serviceSubCategoryId: z.string().min(1, "Service subcategory ID is required").optional(),
});
const skillIdSchema = z.object({
    id: z.string().min(1, "Skill ID is required"),
});
const getSkillsQuerySchema = z.object({
    page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
    limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 100),
    search: z.string().optional(),
    serviceCategoryId: z.string().optional(),
    serviceSubCategoryId: z.string().optional(),
});
export { createSkillSchema, updateSkillSchema, skillIdSchema, getSkillsQuerySchema, };
//# sourceMappingURL=skill.schemas.js.map
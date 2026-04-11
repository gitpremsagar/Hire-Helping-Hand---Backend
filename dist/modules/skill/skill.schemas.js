import { z } from "zod";
import { ServiceCategory, ServiceSubCategory } from "@prisma/client";
import { serviceCategoryIdField, serviceSubCategoryIdField, refineCategoryPair, } from "../../constants/taxonomy-zod.js";
// Validation schemas for Skill
const createSkillSchema = refineCategoryPair(z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
    serviceCategoryId: serviceCategoryIdField,
    serviceSubCategoryId: serviceSubCategoryIdField,
}));
const updateSkillSchema = refineCategoryPair(z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters").optional(),
    description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters").optional(),
    serviceCategoryId: serviceCategoryIdField.optional(),
    serviceSubCategoryId: serviceSubCategoryIdField.optional(),
}));
const skillIdSchema = z.object({
    id: z.string().min(1, "Skill ID is required"),
});
const getSkillsQuerySchema = z.object({
    page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
    limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 100),
    search: z.string().optional(),
    serviceCategoryId: z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : v), z.nativeEnum(ServiceCategory).optional()),
    serviceSubCategoryId: z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : v), z.nativeEnum(ServiceSubCategory).optional()),
});
export { createSkillSchema, updateSkillSchema, skillIdSchema, getSkillsQuerySchema, };
//# sourceMappingURL=skill.schemas.js.map
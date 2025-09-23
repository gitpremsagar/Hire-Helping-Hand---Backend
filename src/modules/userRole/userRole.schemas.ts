import { z } from "zod";

// Validation schemas for UserRole
const createUserRoleSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
});

const updateUserRoleSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters").optional(),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters").optional(),
});

const userRoleIdSchema = z.object({
  id: z.string().min(1, "User role ID is required"),
});

const getUserRolesQuerySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 100),
  search: z.string().optional(),
});

export {
  createUserRoleSchema,
  updateUserRoleSchema,
  userRoleIdSchema,
  getUserRolesQuerySchema,
};

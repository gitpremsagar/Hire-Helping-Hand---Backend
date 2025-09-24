import { z } from "zod";

// Validation schemas for UserLanguage
const createUserLanguageSchema = z.object({
  language: z.string().min(1, "Language is required").max(100, "Language must be less than 100 characters"),
});

const updateUserLanguageSchema = z.object({
  language: z.string().min(1, "Language is required").max(100, "Language must be less than 100 characters").optional(),
});

const userLanguageIdSchema = z.object({
  id: z.string().min(1, "User language ID is required"),
});

const getUserLanguagesQuerySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 100),
  search: z.string().optional(),
});

export {
  createUserLanguageSchema,
  updateUserLanguageSchema,
  userLanguageIdSchema,
  getUserLanguagesQuerySchema,
};

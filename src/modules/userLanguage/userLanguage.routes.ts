import express from "express";
import { 
  createUserLanguage, 
  getUserLanguages, 
  getUserLanguageById, 
  updateUserLanguage, 
  deleteUserLanguage 
} from "./userLanguage.controllers.js";
import { 
  validateCreateUserLanguageJson, 
  validateUpdateUserLanguageJson, 
  validateUserLanguageId,
  validateGetUserLanguagesQuery 
} from "./userLanguage.validation.middlewares.js";
import { authenticate, requireAdmin } from "../../middleware/auth.middlewares.js";

const userLanguageRoutes = express.Router();

// Create a new user language
userLanguageRoutes.post("/", authenticate, requireAdmin, validateCreateUserLanguageJson, createUserLanguage);

// Get all user languages with pagination and search
userLanguageRoutes.get("/", validateGetUserLanguagesQuery, getUserLanguages);

// Get a single user language by ID
userLanguageRoutes.get("/:id", validateUserLanguageId, getUserLanguageById);

// Update a user language
userLanguageRoutes.put("/:id", authenticate, requireAdmin, validateUserLanguageId, validateUpdateUserLanguageJson, updateUserLanguage);

// Delete a user language
userLanguageRoutes.delete("/:id", authenticate, requireAdmin, validateUserLanguageId, deleteUserLanguage);

export default userLanguageRoutes;

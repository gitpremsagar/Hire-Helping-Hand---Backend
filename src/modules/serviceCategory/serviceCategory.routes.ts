import express from "express";
import { 
  createServiceCategory, 
  getServiceCategories, 
  getServiceCategoryById, 
  getServiceCategoryBySlug,
  updateServiceCategory, 
  deleteServiceCategory 
} from "./serviceCategory.controllers.js";
import { 
  validateCreateServiceCategoryJson, 
  validateUpdateServiceCategoryJson, 
  validateServiceCategoryId,
  validateServiceCategorySlug,
  validateGetServiceCategoriesQuery 
} from "./serviceCategory.validation.middlewares.js";
import { authenticate, requireAdmin } from "../../middleware/auth.middlewares.js";

const serviceCategoryRoutes = express.Router();

// Create a new service category
serviceCategoryRoutes.post("/", authenticate, requireAdmin, validateCreateServiceCategoryJson, createServiceCategory);

// Get all service categories with pagination and search
serviceCategoryRoutes.get("/", validateGetServiceCategoriesQuery, getServiceCategories);

// Get a single service category by ID
serviceCategoryRoutes.get("/:id", validateServiceCategoryId, getServiceCategoryById);

// Get a single service category by slug
serviceCategoryRoutes.get("/slug/:slug", validateServiceCategorySlug, getServiceCategoryBySlug);

// Update a service category
serviceCategoryRoutes.put("/:id", authenticate, requireAdmin, validateServiceCategoryId, validateUpdateServiceCategoryJson, updateServiceCategory);

// Delete a service category
serviceCategoryRoutes.delete("/:id", authenticate, requireAdmin, validateServiceCategoryId, deleteServiceCategory);

export default serviceCategoryRoutes;

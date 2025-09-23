import express from "express";
import { 
  createServiceCategory, 
  getServiceCategories, 
  getServiceCategoryById, 
  updateServiceCategory, 
  deleteServiceCategory 
} from "./serviceCategory.controllers.js";
import { 
  validateCreateServiceCategoryJson, 
  validateUpdateServiceCategoryJson, 
  validateServiceCategoryId,
  validateGetServiceCategoriesQuery 
} from "./serviceCategory.validation.middlewares.js";

const serviceCategoryRoutes = express.Router();

// Create a new service category
serviceCategoryRoutes.post("/", validateCreateServiceCategoryJson, createServiceCategory);

// Get all service categories with pagination and search
serviceCategoryRoutes.get("/", validateGetServiceCategoriesQuery, getServiceCategories);

// Get a single service category by ID
serviceCategoryRoutes.get("/:id", validateServiceCategoryId, getServiceCategoryById);

// Update a service category
serviceCategoryRoutes.put("/:id", validateServiceCategoryId, validateUpdateServiceCategoryJson, updateServiceCategory);

// Delete a service category
serviceCategoryRoutes.delete("/:id", validateServiceCategoryId, deleteServiceCategory);

export default serviceCategoryRoutes;

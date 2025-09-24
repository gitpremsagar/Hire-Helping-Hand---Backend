import express from "express";
import { createServiceSubCategory, getServiceSubCategories, getServiceSubCategoryById, updateServiceSubCategory, deleteServiceSubCategory } from "./serviceSubCategory.controllers.js";
import { validateCreateServiceSubCategoryJson, validateUpdateServiceSubCategoryJson, validateServiceSubCategoryId, validateGetServiceSubCategoriesQuery } from "./serviceSubCategory.validation.middlewares.js";
import { authenticate, requireAdmin } from "../../middleware/auth.middlewares.js";
const serviceSubCategoryRoutes = express.Router();
// Create a new service subcategory
serviceSubCategoryRoutes.post("/", authenticate, requireAdmin, validateCreateServiceSubCategoryJson, createServiceSubCategory);
// Get all service subcategories with pagination and search
serviceSubCategoryRoutes.get("/", validateGetServiceSubCategoriesQuery, getServiceSubCategories);
// Get a single service subcategory by ID
serviceSubCategoryRoutes.get("/:id", validateServiceSubCategoryId, getServiceSubCategoryById);
// Update a service subcategory
serviceSubCategoryRoutes.put("/:id", authenticate, requireAdmin, validateServiceSubCategoryId, validateUpdateServiceSubCategoryJson, updateServiceSubCategory);
// Delete a service subcategory
serviceSubCategoryRoutes.delete("/:id", authenticate, requireAdmin, validateServiceSubCategoryId, deleteServiceSubCategory);
export default serviceSubCategoryRoutes;
//# sourceMappingURL=serviceSubCategory.routes.js.map
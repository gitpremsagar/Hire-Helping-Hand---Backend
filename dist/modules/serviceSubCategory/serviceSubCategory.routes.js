import express from "express";
import { createServiceSubCategory, getServiceSubCategories, getServiceSubCategoryById, getServiceSubCategoryBySlug, updateServiceSubCategory, deleteServiceSubCategory, reorderServiceSubCategories, getServiceSubCategoriesOrdered } from "./serviceSubCategory.controllers.js";
import { validateCreateServiceSubCategoryJson, validateUpdateServiceSubCategoryJson, validateServiceSubCategoryId, validateServiceSubCategorySlug, validateGetServiceSubCategoriesQuery, validateReorderServiceSubCategoriesJson } from "./serviceSubCategory.validation.middlewares.js";
import { authenticate, requireAdmin } from "../../middleware/auth.middlewares.js";
const serviceSubCategoryRoutes = express.Router();
// Create a new service subcategory TODO: Uncomment the authenticate and requireAdmin middlewares
serviceSubCategoryRoutes.post("/", authenticate, requireAdmin, validateCreateServiceSubCategoryJson, createServiceSubCategory);
// Get all service subcategories with pagination and search
serviceSubCategoryRoutes.get("/", validateGetServiceSubCategoriesQuery, getServiceSubCategories);
// Get service subcategories ordered by orderNumber (for frontend display)
serviceSubCategoryRoutes.get("/ordered", getServiceSubCategoriesOrdered);
// Get a single service subcategory by ID
serviceSubCategoryRoutes.get("/:id", validateServiceSubCategoryId, getServiceSubCategoryById);
// Get a single service subcategory by slug
serviceSubCategoryRoutes.get("/slug/:slug", validateServiceSubCategorySlug, getServiceSubCategoryBySlug);
// Update a service subcategory TODO: Uncomment the authenticate and requireAdmin middlewares
serviceSubCategoryRoutes.put("/:id", /*authenticate, requireAdmin,*/ validateServiceSubCategoryId, validateUpdateServiceSubCategoryJson, updateServiceSubCategory);
// Delete a service subcategory TODO: Uncomment the authenticate and requireAdmin middlewares
serviceSubCategoryRoutes.delete("/:id", /*authenticate, requireAdmin,*/ validateServiceSubCategoryId, deleteServiceSubCategory);
// Reorder service subcategories
serviceSubCategoryRoutes.patch("/reorder", /*authenticate, requireAdmin,*/ validateReorderServiceSubCategoriesJson, reorderServiceSubCategories);
export default serviceSubCategoryRoutes;
//# sourceMappingURL=serviceSubCategory.routes.js.map
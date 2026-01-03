import express from "express";
import { createServiceCategory, getServiceCategories, getServiceCategoryById, getServiceCategoryBySlug, updateServiceCategory, deleteServiceCategory, reorderServiceCategories, getServiceCategoriesOrdered } from "./serviceCategory.controllers.js";
import { validateCreateServiceCategoryJson, validateUpdateServiceCategoryJson, validateServiceCategoryId, validateServiceCategorySlug, validateGetServiceCategoriesQuery, validateReorderServiceCategoriesJson } from "./serviceCategory.validation.middlewares.js";
import { authenticate, requireAdmin } from "../../middleware/auth.middlewares.js";
const serviceCategoryRoutes = express.Router();
// Create a new service category TODO: Uncomment the authenticate and requireAdmin middlewares
serviceCategoryRoutes.post("/", /*authenticate, requireAdmin,*/ validateCreateServiceCategoryJson, createServiceCategory);
// Get all service categories with pagination and search
serviceCategoryRoutes.get("/", validateGetServiceCategoriesQuery, getServiceCategories);
// Get service categories ordered by orderNumber (for frontend display)
serviceCategoryRoutes.get("/ordered", getServiceCategoriesOrdered);
// Get a single service category by ID
serviceCategoryRoutes.get("/:id", validateServiceCategoryId, getServiceCategoryById);
// Get a single service category by slug
serviceCategoryRoutes.get("/slug/:slug", validateServiceCategorySlug, getServiceCategoryBySlug);
// Update a service category
serviceCategoryRoutes.put("/:id", /*authenticate, requireAdmin,*/ validateServiceCategoryId, validateUpdateServiceCategoryJson, updateServiceCategory);
// Delete a service category
serviceCategoryRoutes.delete("/:id", /*authenticate, requireAdmin,*/ validateServiceCategoryId, deleteServiceCategory);
// Reorder service categories
serviceCategoryRoutes.patch("/reorder", /*authenticate, requireAdmin,*/ validateReorderServiceCategoriesJson, reorderServiceCategories);
export default serviceCategoryRoutes;
//# sourceMappingURL=serviceCategory.routes.js.map
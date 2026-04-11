import express from "express";
import { getServiceCategories, getServiceCategoryById, getServiceCategoryBySlug, getServiceCategoriesOrdered, } from "./serviceCategory.controllers.js";
import { validateServiceCategoryId, validateServiceCategorySlug, validateGetServiceCategoriesQuery, } from "./serviceCategory.validation.middlewares.js";
const serviceCategoryRoutes = express.Router();
serviceCategoryRoutes.get("/", validateGetServiceCategoriesQuery, getServiceCategories);
serviceCategoryRoutes.get("/ordered", getServiceCategoriesOrdered);
serviceCategoryRoutes.get("/slug/:slug", validateServiceCategorySlug, getServiceCategoryBySlug);
serviceCategoryRoutes.get("/:id", validateServiceCategoryId, getServiceCategoryById);
export default serviceCategoryRoutes;
//# sourceMappingURL=serviceCategory.routes.js.map
import express from "express";
import { getServiceSubCategories, getServiceSubCategoryById, getServiceSubCategoryBySlug, getServiceSubCategoriesOrdered, } from "./serviceSubCategory.controllers.js";
import { validateServiceSubCategoryId, validateServiceSubCategorySlug, validateGetServiceSubCategoriesQuery, } from "./serviceSubCategory.validation.middlewares.js";
const serviceSubCategoryRoutes = express.Router();
serviceSubCategoryRoutes.get("/", validateGetServiceSubCategoriesQuery, getServiceSubCategories);
serviceSubCategoryRoutes.get("/ordered", getServiceSubCategoriesOrdered);
serviceSubCategoryRoutes.get("/slug/:slug", validateServiceSubCategorySlug, getServiceSubCategoryBySlug);
serviceSubCategoryRoutes.get("/:id", validateServiceSubCategoryId, getServiceSubCategoryById);
export default serviceSubCategoryRoutes;
//# sourceMappingURL=serviceSubCategory.routes.js.map
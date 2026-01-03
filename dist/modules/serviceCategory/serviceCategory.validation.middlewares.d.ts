import type { Request, Response, NextFunction } from "express";
declare const validateCreateServiceCategoryJson: (req: Request, res: Response, next: NextFunction) => void;
declare const validateUpdateServiceCategoryJson: (req: Request, res: Response, next: NextFunction) => void;
declare const validateServiceCategoryId: (req: Request, res: Response, next: NextFunction) => void;
declare const validateServiceCategorySlug: (req: Request, res: Response, next: NextFunction) => void;
declare const validateGetServiceCategoriesQuery: (req: Request, res: Response, next: NextFunction) => void;
declare const validateReorderServiceCategoriesJson: (req: Request, res: Response, next: NextFunction) => void;
export { validateCreateServiceCategoryJson, validateUpdateServiceCategoryJson, validateServiceCategoryId, validateServiceCategorySlug, validateGetServiceCategoriesQuery, validateReorderServiceCategoriesJson };
//# sourceMappingURL=serviceCategory.validation.middlewares.d.ts.map
import type { Request, Response } from "express";
/** GET / — paginated list with optional search (name/description/slug) */
export declare const getServiceCategories: (req: Request, res: Response) => Promise<void>;
/** GET /:id — id is enum value e.g. PROGRAMMING_AND_TECH */
export declare const getServiceCategoryById: (req: Request, res: Response) => Promise<void>;
/** GET /slug/:slug */
export declare const getServiceCategoryBySlug: (req: Request, res: Response) => Promise<void>;
/** GET /ordered — all categories with nested subcategories (for dropdowns) */
export declare const getServiceCategoriesOrdered: (_req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=serviceCategory.controllers.d.ts.map
import type { Request, Response } from "express";
/** GET / */
export declare const getServiceSubCategories: (req: Request, res: Response) => Promise<void>;
/** GET /ordered */
export declare const getServiceSubCategoriesOrdered: (req: Request, res: Response) => Promise<void>;
/** GET /:id */
export declare const getServiceSubCategoryById: (req: Request, res: Response) => Promise<void>;
/** GET /slug/:slug */
export declare const getServiceSubCategoryBySlug: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=serviceSubCategory.controllers.d.ts.map
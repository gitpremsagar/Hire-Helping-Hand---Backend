import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  serviceSubCategoryIdSchema,
  serviceSubCategorySlugSchema,
  getServiceSubCategoriesQuerySchema,
} from "./serviceSubCategory.schemas.js";

const validateServiceSubCategoryId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = serviceSubCategoryIdSchema.parse(req.params);
    (req as any).validatedParams = validatedData;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error instanceof z.ZodError ? error.issues : error,
    });
  }
};

const validateServiceSubCategorySlug = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = serviceSubCategorySlugSchema.parse(req.params);
    (req as any).validatedParams = validatedData;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error instanceof z.ZodError ? error.issues : error,
    });
  }
};

const validateGetServiceSubCategoriesQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = getServiceSubCategoriesQuerySchema.parse(req.query);
    (req as any).validatedQuery = validatedData;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error instanceof z.ZodError ? error.issues : error,
    });
  }
};

export {
  validateServiceSubCategoryId,
  validateServiceSubCategorySlug,
  validateGetServiceSubCategoriesQuery,
};

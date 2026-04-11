import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  serviceCategoryIdSchema,
  serviceCategorySlugSchema,
  getServiceCategoriesQuerySchema,
} from "./serviceCategory.schemas.js";

const validateServiceCategoryId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = serviceCategoryIdSchema.parse(req.params);
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

const validateServiceCategorySlug = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = serviceCategorySlugSchema.parse(req.params);
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

const validateGetServiceCategoriesQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = getServiceCategoriesQuerySchema.parse(req.query);
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
  validateServiceCategoryId,
  validateServiceCategorySlug,
  validateGetServiceCategoriesQuery,
};

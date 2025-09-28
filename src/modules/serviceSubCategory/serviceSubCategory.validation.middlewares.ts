import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { 
  createServiceSubCategorySchema, 
  updateServiceSubCategorySchema, 
  serviceSubCategoryIdSchema,
  serviceSubCategorySlugSchema,
  getServiceSubCategoriesQuerySchema 
} from "./serviceSubCategory.schemas.js";

const validateCreateServiceSubCategoryJson = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createServiceSubCategorySchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error instanceof z.ZodError ? error.issues : error,
    });
  }
};

const validateUpdateServiceSubCategoryJson = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateServiceSubCategorySchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error instanceof z.ZodError ? error.issues : error,
    });
  }
};

const validateServiceSubCategoryId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = serviceSubCategoryIdSchema.parse(req.params);
    // Store validated data in a custom property to avoid type conflicts
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
    // Store validated data in a custom property to avoid type conflicts
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
    // Store validated data in a custom property to avoid type conflicts
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
  validateCreateServiceSubCategoryJson, 
  validateUpdateServiceSubCategoryJson, 
  validateServiceSubCategoryId,
  validateServiceSubCategorySlug,
  validateGetServiceSubCategoriesQuery 
};

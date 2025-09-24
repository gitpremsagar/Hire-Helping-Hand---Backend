import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { 
  createUserLanguageSchema, 
  updateUserLanguageSchema, 
  userLanguageIdSchema,
  getUserLanguagesQuerySchema 
} from "./userLanguage.schemas.js";

const validateCreateUserLanguageJson = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createUserLanguageSchema.parse(req.body);
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

const validateUpdateUserLanguageJson = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateUserLanguageSchema.parse(req.body);
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

const validateUserLanguageId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = userLanguageIdSchema.parse(req.params);
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

const validateGetUserLanguagesQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = getUserLanguagesQuerySchema.parse(req.query);
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
  validateCreateUserLanguageJson, 
  validateUpdateUserLanguageJson, 
  validateUserLanguageId,
  validateGetUserLanguagesQuery 
};

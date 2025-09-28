import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { 
  updateClientProfileSchema, 
  getClientsQuerySchema, 
  getClientContractsQuerySchema, 
  clientIdParamSchema 
} from "./client.schemas.js";

// Validate update client profile request
const validateUpdateClientProfile = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validatedData = updateClientProfileSchema.parse(req.body);
    req.body = validatedData;
    
    // Validate client ID parameter
    const validatedParams = clientIdParamSchema.parse(req.params);
    req.params = validatedParams;
    
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error instanceof z.ZodError ? error.issues : error,
    });
  }
};

// Validate get clients query parameters
const validateGetClientsQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = getClientsQuerySchema.parse(req.query);
    req.query = validatedData;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error instanceof z.ZodError ? error.issues : error,
    });
  }
};

// Validate get client contracts query parameters
const validateGetClientContractsQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate query parameters
    const validatedQuery = getClientContractsQuerySchema.parse(req.query);
    req.query = validatedQuery;
    
    // Validate client ID parameter
    const validatedParams = clientIdParamSchema.parse(req.params);
    req.params = validatedParams;
    
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error instanceof z.ZodError ? error.issues : error,
    });
  }
};

// Validate client ID parameter
const validateClientIdParam = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = clientIdParamSchema.parse(req.params);
    req.params = validatedParams;
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
  validateUpdateClientProfile,
  validateGetClientsQuery,
  validateGetClientContractsQuery,
  validateClientIdParam,
};


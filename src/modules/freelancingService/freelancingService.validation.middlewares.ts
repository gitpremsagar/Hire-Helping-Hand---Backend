import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { 
  createFreelancingServiceSchema, 
  updateFreelancingServiceSchema, 
  freelancingServiceIdSchema,
  freelancerIdSchema,
  getFreelancingServicesQuerySchema,
  getFreelancingServicesByFreelancerQuerySchema
} from "./freelancingService.schemas.js";

const validateCreateFreelancingServiceJson = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createFreelancingServiceSchema.parse(req.body);
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

const validateUpdateFreelancingServiceJson = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateFreelancingServiceSchema.parse(req.body);
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

const validateFreelancingServiceId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = freelancingServiceIdSchema.parse(req.params);
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

const validateFreelancerId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = freelancerIdSchema.parse(req.params);
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

const validateGetFreelancingServicesQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = getFreelancingServicesQuerySchema.parse(req.query);
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

const validateGetFreelancingServicesByFreelancerQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = getFreelancingServicesByFreelancerQuerySchema.parse(req.query);
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
  validateCreateFreelancingServiceJson, 
  validateUpdateFreelancingServiceJson, 
  validateFreelancingServiceId,
  validateFreelancerId,
  validateGetFreelancingServicesQuery,
  validateGetFreelancingServicesByFreelancerQuery
};

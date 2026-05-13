import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

const rejectFreelancingServiceBodySchema = z.object({
  rejectionReason: z.string().max(2000).optional(),
});

export const validateRejectFreelancingServiceJson = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const validated = rejectFreelancingServiceBodySchema.parse(req.body ?? {});
    (req as any).validatedBody = validated;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error instanceof z.ZodError ? error.issues : error,
    });
  }
};

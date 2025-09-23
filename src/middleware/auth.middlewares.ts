import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { AppError, ErrorTypes } from "../utils/controllerErrorHandler.js";
import { appConfig } from "../config/app.config.js";

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        isFreelancer: boolean;
        isClient: boolean;
        isEmailVerified: boolean;
        isPhoneVerified: boolean;
      };
    }
  }
}

// Authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ErrorTypes.UNAUTHORIZED("Access token is required");
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    if (!appConfig.jwt.accessToken.secret) {
      throw new AppError("JWT secret is not configured", 500);
    }

    // Verify access token
    let decoded: any;
    try {
      decoded = jwt.verify(token, appConfig.jwt.accessToken.secret as string);
    } catch (error) {
      throw ErrorTypes.UNAUTHORIZED("Invalid or expired access token");
    }

    if (decoded.type !== "access") {
      throw ErrorTypes.UNAUTHORIZED("Invalid token type");
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        isFreelancer: true,
        isClient: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        isDeleted: true,
        isSuspended: true,
        isBlocked: true,
      },
    });

    if (!user) {
      throw ErrorTypes.NOT_FOUND("User");
    }

    // Check if user is active
    if (user.isDeleted || user.isSuspended || user.isBlocked) {
      throw ErrorTypes.ACCOUNT_INACTIVE();
    }

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      isFreelancer: user.isFreelancer,
      isClient: user.isClient,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }
  }
};

// Optional authentication middleware (doesn't throw error if no token)
export const optionalAuthenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(); // Continue without authentication
    }

    const token = authHeader.substring(7);

    if (!appConfig.jwt.accessToken.secret) {
      return next(); // Continue without authentication
    }

    // Verify access token
    let decoded: any;
    try {
      decoded = jwt.verify(token, appConfig.jwt.accessToken.secret as string);
    } catch (error) {
      return next(); // Continue without authentication
    }

    if (decoded.type !== "access") {
      return next(); // Continue without authentication
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        isFreelancer: true,
        isClient: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        isDeleted: true,
        isSuspended: true,
        isBlocked: true,
      },
    });

    if (user && !user.isDeleted && !user.isSuspended && !user.isBlocked) {
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        isFreelancer: user.isFreelancer,
        isClient: user.isClient,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
      };
    }

    next();
  } catch (error) {
    next(); // Continue without authentication
  }
};

// Authorization middleware for freelancers
export const requireFreelancer = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  if (!req.user.isFreelancer) {
    res.status(403).json({
      success: false,
      message: "Freelancer access required",
    });
    return;
  }

  next();
};

// Authorization middleware for clients
export const requireClient = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  if (!req.user.isClient) {
    res.status(403).json({
      success: false,
      message: "Client access required",
    });
    return;
  }

  next();
};

// Authorization middleware for verified users
export const requireVerified = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  if (!req.user.isEmailVerified) {
    res.status(403).json({
      success: false,
      message: "Email verification required",
    });
    return;
  }

  next();
};

// Authorization middleware for phone verified users
export const requirePhoneVerified = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  if (!req.user.isPhoneVerified) {
    res.status(403).json({
      success: false,
      message: "Phone verification required",
    });
    return;
  }

  next();
};

// Authorization middleware for admin users
export const requireAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Check if user has admin role
    const userRole = await prisma.userAndRoleRelation.findFirst({
      where: {
        userId: req.user.id,
        Role: {
          name: "admin"
        }
      },
      include: {
        Role: true
      }
    });

    if (!userRole) {
      res.status(403).json({
        success: false,
        message: "Admin access required",
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking admin permissions",
    });
  }
};

// Authorization middleware for resource ownership
export const requireOwnership = (resourceUserIdField: string = "userId") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (!resourceUserId) {
      res.status(400).json({
        success: false,
        message: "Resource user ID is required",
      });
      return;
    }

    if (req.user.id !== resourceUserId) {
      res.status(403).json({
        success: false,
        message: "Access denied: You can only access your own resources",
      });
      return;
    }

    next();
  };
};

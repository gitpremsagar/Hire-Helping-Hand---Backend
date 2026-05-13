import type { Request, Response } from "express";
import { ServiceStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { AppError, ErrorTypes, handleError, sendSuccess } from "../../utils/controllerErrorHandler.js";
import { enrichCategoryFields } from "../../constants/service-taxonomy.js";

export const adminApproveFreelancingService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = (req as any).validatedParams as { id: string };

    const existing = await prisma.freelancingService.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!existing) {
      throw ErrorTypes.NOT_FOUND("Freelancing service");
    }

    if (existing.status !== ServiceStatus.PENDING_APPROVAL) {
      throw new AppError("Only services pending approval can be approved", 400);
    }

    const updated = await prisma.freelancingService.update({
      where: { id },
      data: {
        status: ServiceStatus.APPROVED,
        rejectionReason: null,
      },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        basePrice: true,
        currency: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        freelancer: {
          select: { id: true, name: true, avatar: true },
        },
        serviceCategory: true,
        serviceSubCategory: true,
      },
    });

    sendSuccess(res, "Service approved", enrichCategoryFields(updated));
  } catch (error) {
    handleError(error, res, "Failed to approve freelancing service");
  }
};

export const adminRejectFreelancingService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = (req as any).validatedParams as { id: string };
    const { rejectionReason } = (req as any).validatedBody as { rejectionReason?: string };

    const existing = await prisma.freelancingService.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!existing) {
      throw ErrorTypes.NOT_FOUND("Freelancing service");
    }

    if (existing.status !== ServiceStatus.PENDING_APPROVAL) {
      throw new AppError("Only services pending approval can be rejected", 400);
    }

    const updated = await prisma.freelancingService.update({
      where: { id },
      data: {
        status: ServiceStatus.REJECTED,
        rejectionReason: rejectionReason?.trim() || null,
      },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        basePrice: true,
        currency: true,
        status: true,
        rejectionReason: true,
        createdAt: true,
        updatedAt: true,
        freelancer: {
          select: { id: true, name: true, avatar: true },
        },
        serviceCategory: true,
        serviceSubCategory: true,
      },
    });

    sendSuccess(res, "Service rejected", enrichCategoryFields(updated));
  } catch (error) {
    handleError(error, res, "Failed to reject freelancing service");
  }
};

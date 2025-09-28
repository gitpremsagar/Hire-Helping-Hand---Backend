import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { AppError, ErrorTypes, handleError, sendSuccess } from "../../utils/controllerErrorHandler.js";

// Create a new service category
export const createServiceCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, isNew } = req.body;

    // Check if service category with the same name already exists
    const existingCategory = await prisma.serviceCategory.findFirst({
      where: { 
        name: {
          equals: name,
          mode: 'insensitive'
        }
      },
    });

    if (existingCategory) {
      throw ErrorTypes.ALREADY_EXISTS("Service category with this name");
    }

    // Create the service category
    const serviceCategory = await prisma.serviceCategory.create({
      data: {
        name,
        description,
        isNew: isNew ?? false,
      },
      select: {
        id: true,
        name: true,
        description: true,
        isNew: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    sendSuccess(res, "Service category created successfully", serviceCategory, 201);
  } catch (error) {
    handleError(error, res, "Failed to create service category");
  }
};

// Get all service categories with pagination and search
export const getServiceCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, search } = (req as any).validatedQuery as {
      page: number;
      limit: number;
      search?: string;
    };

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build where clause for search
    const whereClause = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {};

    // Get service categories with pagination
    const [serviceCategories, totalCount] = await Promise.all([
      prisma.serviceCategory.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          description: true,
          isNew: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              ServiceSubCategory: true,
              FreelancingService: true,
              Job: true,
            },
          },
          ServiceSubCategory: {
            select: {
              id: true,
              name: true,
              description: true,
              isNew: true,
            },
          },
        },
        
      }),
      prisma.serviceCategory.count({
        where: whereClause,
      }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    sendSuccess(res, "Service categories retrieved successfully", {
      serviceCategories,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    handleError(error, res, "Failed to retrieve service categories");
  }
};

// Get a single service category by ID
export const getServiceCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = (req as any).validatedParams as { id: string };

    const serviceCategory = await prisma.serviceCategory.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        isNew: true,
        createdAt: true,
        updatedAt: true,
        ServiceSubCategory: {
          select: {
            id: true,
            name: true,
            description: true,
            isNew: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            FreelancingService: true,
            Job: true,
          },
        },
      },
    });

    if (!serviceCategory) {
      throw ErrorTypes.NOT_FOUND("Service category");
    }

    sendSuccess(res, "Service category retrieved successfully", serviceCategory);
  } catch (error) {
    handleError(error, res, "Failed to retrieve service category");
  }
};

// Update a service category
export const updateServiceCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = (req as any).validatedParams as { id: string };
    const { name, description, isNew } = req.body;

    // Check if service category exists
    const existingCategory = await prisma.serviceCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw ErrorTypes.NOT_FOUND("Service category");
    }

    // Check if another service category with the same name already exists (excluding current one)
    if (name && name !== existingCategory.name) {
      const duplicateCategory = await prisma.serviceCategory.findFirst({
        where: { 
          name: {
            equals: name,
            mode: 'insensitive'
          },
          id: {
            not: id
          }
        },
      });

      if (duplicateCategory) {
        throw ErrorTypes.ALREADY_EXISTS("Service category with this name");
      }
    }

    // Update the service category
    const updatedServiceCategory = await prisma.serviceCategory.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(isNew !== undefined && { isNew }),
      },
      select: {
        id: true,
        name: true,
        description: true,
        isNew: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    sendSuccess(res, "Service category updated successfully", updatedServiceCategory);
  } catch (error) {
    handleError(error, res, "Failed to update service category");
  }
};

// Delete a service category
export const deleteServiceCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = (req as any).validatedParams as { id: string };

    // Check if service category exists
    const existingCategory = await prisma.serviceCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw ErrorTypes.NOT_FOUND("Service category");
    }

    // Check if service category has related data
    const [subCategoryCount, serviceCount, jobCount] = await Promise.all([
      prisma.serviceSubCategory.count({ where: { serviceCategoryId: id } }),
      prisma.freelancingService.count({ where: { serviceCategoryId: id } }),
      prisma.job.count({ where: { serviceCategoryId: id } }),
    ]);

    const hasRelatedData = subCategoryCount > 0 || serviceCount > 0 || jobCount > 0;

    if (hasRelatedData) {
      throw new AppError(
        "Cannot delete service category that has related subcategories, services, or jobs. Please remove all related data first.",
        400
      );
    }

    // Delete the service category
    await prisma.serviceCategory.delete({
      where: { id },
    });

    sendSuccess(res, "Service category deleted successfully");
  } catch (error) {
    handleError(error, res, "Failed to delete service category");
  }
};

import type { Request, Response } from "express";
import { prisma, withTransaction } from "../../lib/prisma.js";
import { AppError, ErrorTypes, handleError, sendSuccess } from "../../utils/controllerErrorHandler.js";

// Create a new user role
export const createUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    // Check if user role with the same name already exists
    const existingRole = await prisma.userRole.findFirst({
      where: { 
        name: {
          equals: name,
          mode: 'insensitive'
        }
      },
    });

    if (existingRole) {
      throw ErrorTypes.ALREADY_EXISTS("User role with this name");
    }

    // Create the user role
    const userRole = await prisma.userRole.create({
      data: {
        name,
        description,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    sendSuccess(res, "User role created successfully", userRole, 201);
  } catch (error) {
    handleError(error, res, "Failed to create user role");
  }
};

// Get all user roles with pagination and search
export const getUserRoles = async (req: Request, res: Response): Promise<void> => {
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

    // Get user roles with pagination
    const [userRoles, totalCount] = await Promise.all([
      prisma.userRole.findMany({
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
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              UserAndRoleRelation: true,//returns the number of users assigned to the role
            },
          },
        },
      }),
      prisma.userRole.count({
        where: whereClause,
      }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    sendSuccess(res, "User roles retrieved successfully", {
      userRoles,
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
    handleError(error, res, "Failed to retrieve user roles");
  }
};

// Get a single user role by ID
export const getUserRoleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = (req as any).validatedParams as { id: string };

    const userRole = await prisma.userRole.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        UserAndRoleRelation: {
          select: {
            id: true,
            createdAt: true,
            User: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            UserAndRoleRelation: true,//returns the number of users assigned to the role
          },
        },
      },
    });

    if (!userRole) {
      throw ErrorTypes.NOT_FOUND("User role");
    }

    sendSuccess(res, "User role retrieved successfully", userRole);
  } catch (error) {
    handleError(error, res, "Failed to retrieve user role");
  }
};

// Update a user role
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = (req as any).validatedParams as { id: string };
    const { name, description } = req.body;

    // Check if user role exists
    const existingRole = await prisma.userRole.findUnique({
      where: { id },
    });

    if (!existingRole) {
      throw ErrorTypes.NOT_FOUND("User role");
    }

    // Check if another user role with the same name already exists (excluding current one)
    if (name && name !== existingRole.name) {
      const duplicateRole = await prisma.userRole.findFirst({
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

      if (duplicateRole) {
        throw ErrorTypes.ALREADY_EXISTS("User role with this name");
      }
    }

    // Update the user role
    const updatedUserRole = await prisma.userRole.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    sendSuccess(res, "User role updated successfully", updatedUserRole);
  } catch (error) {
    handleError(error, res, "Failed to update user role");
  }
};

// Delete a user role
export const deleteUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = (req as any).validatedParams as { id: string };

    // Check if user role exists
    const existingRole = await prisma.userRole.findUnique({
      where: { id },
    });

    if (!existingRole) {
      throw ErrorTypes.NOT_FOUND("User role");
    }
    
    await withTransaction(async (tx) => {
      await tx.userAndRoleRelation.deleteMany({
        where: { roleId: id }
      });
      await tx.userRole.delete({ where: { id } });
    });

    sendSuccess(res, "User role deleted successfully");
  } catch (error) {
    handleError(error, res, "Failed to delete user role");
  }
};

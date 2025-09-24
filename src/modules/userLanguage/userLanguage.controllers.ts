import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { AppError, ErrorTypes, handleError, sendSuccess } from "../../utils/controllerErrorHandler.js";

// Create a new user language
export const createUserLanguage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { language } = req.body;

    // Check if user language with the same language already exists
    const existingUserLanguage = await prisma.userLanguage.findFirst({
      where: { 
        language: {
          equals: language,
          mode: 'insensitive'
        }
      },
    });

    if (existingUserLanguage) {
      throw ErrorTypes.ALREADY_EXISTS("User language with this language name");
    }

    // Create the user language
    const userLanguage = await prisma.userLanguage.create({
      data: {
        language,
      },
      select: {
        id: true,
        language: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    sendSuccess(res, "User language created successfully", userLanguage, 201);
  } catch (error) {
    handleError(error, res, "Failed to create user language");
  }
};

// Get all user languages with pagination and search
export const getUserLanguages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, search } = (req as any).validatedQuery as {
      page: number;
      limit: number;
      search?: string;
    };

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build where clause for search
    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        {
          language: {
            contains: search,
            mode: 'insensitive' as const,
          },
        },
      ];
    }

    // Get user languages with pagination
    const [userLanguages, totalCount] = await Promise.all([
      prisma.userLanguage.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          language: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              UserToLanguageRelation: true,
            },
          },
        },
      }),
      prisma.userLanguage.count({
        where: whereClause,
      }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    sendSuccess(res, "User languages retrieved successfully", {
      userLanguages,
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
    handleError(error, res, "Failed to retrieve user languages");
  }
};

// Get a single user language by ID
export const getUserLanguageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = (req as any).validatedParams as { id: string };

    const userLanguage = await prisma.userLanguage.findUnique({
      where: { id },
      select: {
        id: true,
        language: true,
        createdAt: true,
        updatedAt: true,
        UserToLanguageRelation: {
          select: {
            id: true,
            userId: true,
            createdAt: true,
            user: {
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
            UserToLanguageRelation: true,
          },
        },
      },
    });

    if (!userLanguage) {
      throw ErrorTypes.NOT_FOUND("User language");
    }

    sendSuccess(res, "User language retrieved successfully", userLanguage);
  } catch (error) {
    handleError(error, res, "Failed to retrieve user language");
  }
};

// Update a user language
export const updateUserLanguage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = (req as any).validatedParams as { id: string };
    const { language } = req.body;

    // Check if user language exists
    const existingUserLanguage = await prisma.userLanguage.findUnique({
      where: { id },
    });

    if (!existingUserLanguage) {
      throw ErrorTypes.NOT_FOUND("User language");
    }

    // Check if another user language with the same language already exists (excluding current one)
    if (language && language !== existingUserLanguage.language) {
      const duplicateUserLanguage = await prisma.userLanguage.findFirst({
        where: { 
          language: {
            equals: language,
            mode: 'insensitive'
          },
          id: {
            not: id
          }
        },
      });

      if (duplicateUserLanguage) {
        throw ErrorTypes.ALREADY_EXISTS("User language with this language name");
      }
    }

    // Update the user language
    const updatedUserLanguage = await prisma.userLanguage.update({
      where: { id },
      data: {
        ...(language && { language }),
      },
      select: {
        id: true,
        language: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    sendSuccess(res, "User language updated successfully", updatedUserLanguage);
  } catch (error) {
    handleError(error, res, "Failed to update user language");
  }
};

// Delete a user language
export const deleteUserLanguage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = (req as any).validatedParams as { id: string };

    // Check if user language exists
    const existingUserLanguage = await prisma.userLanguage.findUnique({
      where: { id },
    });

    if (!existingUserLanguage) {
      throw ErrorTypes.NOT_FOUND("User language");
    }

    // Check if user language has related data
    const relationCount = await prisma.userToLanguageRelation.count({ 
      where: { languageId: id } 
    });

    if (relationCount > 0) {
      throw new AppError(
        "Cannot delete user language that has related user associations. Please remove all related user associations first.",
        400
      );
    }

    // Delete the user language
    await prisma.userLanguage.delete({
      where: { id },
    });

    sendSuccess(res, "User language deleted successfully");
  } catch (error) {
    handleError(error, res, "Failed to delete user language");
  }
};

import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { AppError, ErrorTypes, handleError, sendSuccess } from "../../utils/controllerErrorHandler.js";

// Create a new skill
export const createSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, serviceCategoryId, serviceSubCategoryId } = req.body;

    // Check if skill with the same name already exists
    const existingSkill = await prisma.skill.findFirst({
      where: { 
        name: {
          equals: name,
          mode: 'insensitive'
        }
      },
    });

    if (existingSkill) {
      throw ErrorTypes.ALREADY_EXISTS("Skill with this name");
    }

    // Verify service category exists
    const serviceCategory = await prisma.serviceCategory.findUnique({
      where: { id: serviceCategoryId },
    });

    if (!serviceCategory) {
      throw ErrorTypes.NOT_FOUND("Service category");
    }

    // Verify service subcategory exists and belongs to the category
    const serviceSubCategory = await prisma.serviceSubCategory.findFirst({
      where: { 
        id: serviceSubCategoryId,
        serviceCategoryId: serviceCategoryId
      },
    });

    if (!serviceSubCategory) {
      throw ErrorTypes.NOT_FOUND("Service subcategory or it doesn't belong to the specified category");
    }

    // Create the skill
    const skill = await prisma.skill.create({
      data: {
        name,
        description,
        serviceCategoryId,
        serviceSubCategoryId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        serviceCategoryId: true,
        serviceSubCategoryId: true,
        createdAt: true,
        updatedAt: true,
        ServiceCategory: {
          select: {
            id: true,
            name: true,
          },
        },
        ServiceSubCategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    sendSuccess(res, "Skill created successfully", skill, 201);
  } catch (error) {
    handleError(error, res, "Failed to create skill");
  }
};

// Get all skills with pagination and search
export const getSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, search, serviceCategoryId, serviceSubCategoryId } = (req as any).validatedQuery as {
      page: number;
      limit: number;
      search?: string;
      serviceCategoryId?: string;
      serviceSubCategoryId?: string;
    };

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build where clause for search and filters
    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
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
      ];
    }

    if (serviceCategoryId) {
      whereClause.serviceCategoryId = serviceCategoryId;
    }

    if (serviceSubCategoryId) {
      whereClause.serviceSubCategoryId = serviceSubCategoryId;
    }

    // Get skills with pagination
    const [skills, totalCount] = await Promise.all([
      prisma.skill.findMany({
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
          serviceCategoryId: true,
          serviceSubCategoryId: true,
          createdAt: true,
          updatedAt: true,
          ServiceCategory: {
            select: {
              id: true,
              name: true,
            },
          },
          ServiceSubCategory: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              UserSkillRelation: true,
              SkillToFreelancingServiceRelation: true,
              SkillToJobRelation: true,
            },
          },
        },
      }),
      prisma.skill.count({
        where: whereClause,
      }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    sendSuccess(res, "Skills retrieved successfully", {
      skills,
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
    handleError(error, res, "Failed to retrieve skills");
  }
};

// Get a single skill by ID
export const getSkillById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = (req as any).validatedParams as { id: string };

    const skill = await prisma.skill.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        serviceCategoryId: true,
        serviceSubCategoryId: true,
        createdAt: true,
        updatedAt: true,
        ServiceCategory: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        ServiceSubCategory: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        UserSkillRelation: {
          select: {
            id: true,
            userId: true,
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
        SkillToJobRelation: {
          select: {
            id: true,
            jobId: true,
            createdAt: true,
            Job: {
              select: {
                id: true,
                title: true,
                status: true,
              },
            },
          },
        },
        _count: {
          select: {
            UserSkillRelation: true,
            SkillToFreelancingServiceRelation: true,
            SkillToJobRelation: true,
          },
        },
      },
    });

    if (!skill) {
      throw ErrorTypes.NOT_FOUND("Skill");
    }

    sendSuccess(res, "Skill retrieved successfully", skill);
  } catch (error) {
    handleError(error, res, "Failed to retrieve skill");
  }
};

// Update a skill
export const updateSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = (req as any).validatedParams as { id: string };
    const { name, description, serviceCategoryId, serviceSubCategoryId } = req.body;

    // Check if skill exists
    const existingSkill = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existingSkill) {
      throw ErrorTypes.NOT_FOUND("Skill");
    }

    // Check if another skill with the same name already exists (excluding current one)
    if (name && name !== existingSkill.name) {
      const duplicateSkill = await prisma.skill.findFirst({
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

      if (duplicateSkill) {
        throw ErrorTypes.ALREADY_EXISTS("Skill with this name");
      }
    }

    // Verify service category exists if provided
    if (serviceCategoryId && serviceCategoryId !== existingSkill.serviceCategoryId) {
      const serviceCategory = await prisma.serviceCategory.findUnique({
        where: { id: serviceCategoryId },
      });

      if (!serviceCategory) {
        throw ErrorTypes.NOT_FOUND("Service category");
      }
    }

    // Verify service subcategory exists and belongs to the category if provided
    if (serviceSubCategoryId && serviceSubCategoryId !== existingSkill.serviceSubCategoryId) {
      const finalCategoryId = serviceCategoryId || existingSkill.serviceCategoryId;
      const serviceSubCategory = await prisma.serviceSubCategory.findFirst({
        where: { 
          id: serviceSubCategoryId,
          serviceCategoryId: finalCategoryId
        },
      });

      if (!serviceSubCategory) {
        throw ErrorTypes.NOT_FOUND("Service subcategory or it doesn't belong to the specified category");
      }
    }

    // Update the skill
    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(serviceCategoryId && { serviceCategoryId }),
        ...(serviceSubCategoryId && { serviceSubCategoryId }),
      },
      select: {
        id: true,
        name: true,
        description: true,
        serviceCategoryId: true,
        serviceSubCategoryId: true,
        createdAt: true,
        updatedAt: true,
        ServiceCategory: {
          select: {
            id: true,
            name: true,
          },
        },
        ServiceSubCategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    sendSuccess(res, "Skill updated successfully", updatedSkill);
  } catch (error) {
    handleError(error, res, "Failed to update skill");
  }
};

// Delete a skill
export const deleteSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = (req as any).validatedParams as { id: string };

    // Check if skill exists
    const existingSkill = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existingSkill) {
      throw ErrorTypes.NOT_FOUND("Skill");
    }

    // Check if skill has related data
    const [userSkillCount, skillToJobRelationCount] = await Promise.all([
      prisma.userSkillRelation.count({ 
        where: { skillId: id } 
      }),
      prisma.skillToJobRelation.count({ 
        where: { skillId: id } 
      }),
    ]);

    const hasRelatedData = userSkillCount > 0 || skillToJobRelationCount > 0;

    if (hasRelatedData) {
      throw new AppError(
        "Cannot delete skill that has related user or job association. Please remove all related associations first.",
        400
      );
    }

    // Delete the skill
    await prisma.skill.delete({
      where: { id },
    });

    sendSuccess(res, "Skill deleted successfully");
  } catch (error) {
    handleError(error, res, "Failed to delete skill");
  }
};

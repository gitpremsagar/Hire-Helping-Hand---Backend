import { prisma } from "../../lib/prisma.js";
import { AppError, ErrorTypes, handleError, sendSuccess } from "../../utils/controllerErrorHandler.js";
import { categoryAndSubcategoryMatch, enrichCategoryFields, } from "../../constants/service-taxonomy.js";
// Create a new skill
export const createSkill = async (req, res) => {
    try {
        const { name, description, serviceCategoryId, serviceSubCategoryId } = req.body;
        const existingSkill = await prisma.skill.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive",
                },
            },
        });
        if (existingSkill) {
            throw ErrorTypes.ALREADY_EXISTS("Skill with this name");
        }
        if (!categoryAndSubcategoryMatch(serviceCategoryId, serviceSubCategoryId)) {
            throw new AppError("Service subcategory does not belong to the selected category", 400);
        }
        const skill = await prisma.skill.create({
            data: {
                name,
                description,
                serviceCategory: serviceCategoryId,
                serviceSubCategory: serviceSubCategoryId,
            },
            select: {
                id: true,
                name: true,
                description: true,
                serviceCategory: true,
                serviceSubCategory: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        sendSuccess(res, "Skill created successfully", enrichCategoryFields(skill), 201);
    }
    catch (error) {
        handleError(error, res, "Failed to create skill");
    }
};
// Get all skills with pagination and search
export const getSkills = async (req, res) => {
    try {
        const { page, limit, search, serviceCategoryId, serviceSubCategoryId } = req.validatedQuery;
        const skip = (page - 1) * limit;
        const whereClause = {};
        if (search) {
            whereClause.OR = [
                {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }
        if (serviceCategoryId) {
            whereClause.serviceCategory = serviceCategoryId;
        }
        if (serviceSubCategoryId) {
            whereClause.serviceSubCategory = serviceSubCategoryId;
        }
        const [skills, totalCount] = await Promise.all([
            prisma.skill.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    serviceCategory: true,
                    serviceSubCategory: true,
                    createdAt: true,
                    updatedAt: true,
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
        const skillsOut = skills.map((s) => enrichCategoryFields(s));
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        sendSuccess(res, "Skills retrieved successfully", {
            skills: skillsOut,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalCount,
                itemsPerPage: limit,
                hasNextPage,
                hasPrevPage,
            },
        });
    }
    catch (error) {
        handleError(error, res, "Failed to retrieve skills");
    }
};
// Get a single skill by ID
export const getSkillById = async (req, res) => {
    try {
        const { id } = req.validatedParams;
        const skill = await prisma.skill.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                serviceCategory: true,
                serviceSubCategory: true,
                createdAt: true,
                updatedAt: true,
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
        sendSuccess(res, "Skill retrieved successfully", enrichCategoryFields(skill));
    }
    catch (error) {
        handleError(error, res, "Failed to retrieve skill");
    }
};
// Update a skill
export const updateSkill = async (req, res) => {
    try {
        const { id } = req.validatedParams;
        const { name, description, serviceCategoryId, serviceSubCategoryId } = req.body;
        const existingSkill = await prisma.skill.findUnique({
            where: { id },
        });
        if (!existingSkill) {
            throw ErrorTypes.NOT_FOUND("Skill");
        }
        if (name && name !== existingSkill.name) {
            const duplicateSkill = await prisma.skill.findFirst({
                where: {
                    name: {
                        equals: name,
                        mode: "insensitive",
                    },
                    id: {
                        not: id,
                    },
                },
            });
            if (duplicateSkill) {
                throw ErrorTypes.ALREADY_EXISTS("Skill with this name");
            }
        }
        const nextCategory = serviceCategoryId ?? existingSkill.serviceCategory;
        const nextSub = serviceSubCategoryId ?? existingSkill.serviceSubCategory;
        if (!categoryAndSubcategoryMatch(nextCategory, nextSub)) {
            throw new AppError("Service subcategory does not belong to the selected category", 400);
        }
        const updatedSkill = await prisma.skill.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description && { description }),
                ...(serviceCategoryId !== undefined && { serviceCategory: serviceCategoryId }),
                ...(serviceSubCategoryId !== undefined && { serviceSubCategory: serviceSubCategoryId }),
            },
            select: {
                id: true,
                name: true,
                description: true,
                serviceCategory: true,
                serviceSubCategory: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        sendSuccess(res, "Skill updated successfully", enrichCategoryFields(updatedSkill));
    }
    catch (error) {
        handleError(error, res, "Failed to update skill");
    }
};
// Delete a skill
export const deleteSkill = async (req, res) => {
    try {
        const { id } = req.validatedParams;
        const existingSkill = await prisma.skill.findUnique({
            where: { id },
        });
        if (!existingSkill) {
            throw ErrorTypes.NOT_FOUND("Skill");
        }
        const [userSkillCount, skillToJobRelationCount] = await Promise.all([
            prisma.userSkillRelation.count({
                where: { skillId: id },
            }),
            prisma.skillToJobRelation.count({
                where: { skillId: id },
            }),
        ]);
        const hasRelatedData = userSkillCount > 0 || skillToJobRelationCount > 0;
        if (hasRelatedData) {
            throw new AppError("Cannot delete skill that has related user or job association. Please remove all related associations first.", 400);
        }
        await prisma.skill.delete({
            where: { id },
        });
        sendSuccess(res, "Skill deleted successfully");
    }
    catch (error) {
        handleError(error, res, "Failed to delete skill");
    }
};
//# sourceMappingURL=skill.controllers.js.map
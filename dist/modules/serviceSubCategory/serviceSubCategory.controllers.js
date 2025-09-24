import { prisma } from "../../lib/prisma.js";
import { AppError, ErrorTypes, handleError, sendSuccess } from "../../utils/controllerErrorHandler.js";
// Create a new service subcategory
export const createServiceSubCategory = async (req, res) => {
    try {
        const { name, description, isNew, serviceCategoryId } = req.body;
        // Check if service category exists
        const serviceCategory = await prisma.serviceCategory.findUnique({
            where: { id: serviceCategoryId },
        });
        if (!serviceCategory) {
            throw ErrorTypes.NOT_FOUND("Service category");
        }
        // Check if service subcategory with the same name already exists in the same category
        const existingSubCategory = await prisma.serviceSubCategory.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive'
                },
                serviceCategoryId
            },
        });
        if (existingSubCategory) {
            throw ErrorTypes.ALREADY_EXISTS("Service subcategory with this name in the selected category");
        }
        // Create the service subcategory
        const serviceSubCategory = await prisma.serviceSubCategory.create({
            data: {
                name,
                description,
                isNew: isNew ?? false,
                serviceCategoryId,
            },
            select: {
                id: true,
                name: true,
                description: true,
                isNew: true,
                serviceCategoryId: true,
                createdAt: true,
                updatedAt: true,
                ServiceCategory: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        sendSuccess(res, "Service subcategory created successfully", serviceSubCategory, 201);
    }
    catch (error) {
        handleError(error, res, "Failed to create service subcategory");
    }
};
// Get all service subcategories with pagination and search
export const getServiceSubCategories = async (req, res) => {
    try {
        const { page, limit, search, serviceCategoryId } = req.validatedQuery;
        // Calculate skip value for pagination
        const skip = (page - 1) * limit;
        // Build where clause for search and filtering
        const whereClause = {};
        if (search) {
            whereClause.OR = [
                {
                    name: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    description: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
            ];
        }
        if (serviceCategoryId) {
            whereClause.serviceCategoryId = serviceCategoryId;
        }
        // Get service subcategories with pagination
        const [serviceSubCategories, totalCount] = await Promise.all([
            prisma.serviceSubCategory.findMany({
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
                    serviceCategoryId: true,
                    createdAt: true,
                    updatedAt: true,
                    ServiceCategory: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    _count: {
                        select: {
                            FreelancingService: true,
                            Job: true,
                        },
                    },
                },
            }),
            prisma.serviceSubCategory.count({
                where: whereClause,
            }),
        ]);
        // Calculate pagination info
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        sendSuccess(res, "Service subcategories retrieved successfully", {
            serviceSubCategories,
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
        handleError(error, res, "Failed to retrieve service subcategories");
    }
};
// Get a single service subcategory by ID
export const getServiceSubCategoryById = async (req, res) => {
    try {
        const { id } = req.validatedParams;
        const serviceSubCategory = await prisma.serviceSubCategory.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                isNew: true,
                serviceCategoryId: true,
                createdAt: true,
                updatedAt: true,
                ServiceCategory: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
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
        if (!serviceSubCategory) {
            throw ErrorTypes.NOT_FOUND("Service subcategory");
        }
        sendSuccess(res, "Service subcategory retrieved successfully", serviceSubCategory);
    }
    catch (error) {
        handleError(error, res, "Failed to retrieve service subcategory");
    }
};
// Update a service subcategory
export const updateServiceSubCategory = async (req, res) => {
    try {
        const { id } = req.validatedParams;
        const { name, description, isNew, serviceCategoryId } = req.body;
        // Check if service subcategory exists
        const existingSubCategory = await prisma.serviceSubCategory.findUnique({
            where: { id },
        });
        if (!existingSubCategory) {
            throw ErrorTypes.NOT_FOUND("Service subcategory");
        }
        // Check if service category exists (if serviceCategoryId is being updated)
        if (serviceCategoryId && serviceCategoryId !== existingSubCategory.serviceCategoryId) {
            const serviceCategory = await prisma.serviceCategory.findUnique({
                where: { id: serviceCategoryId },
            });
            if (!serviceCategory) {
                throw ErrorTypes.NOT_FOUND("Service category");
            }
        }
        // Check if another service subcategory with the same name already exists in the same category
        if (name && name !== existingSubCategory.name) {
            const categoryId = serviceCategoryId || existingSubCategory.serviceCategoryId;
            const duplicateSubCategory = await prisma.serviceSubCategory.findFirst({
                where: {
                    name: {
                        equals: name,
                        mode: 'insensitive'
                    },
                    serviceCategoryId: categoryId,
                    id: {
                        not: id
                    }
                },
            });
            if (duplicateSubCategory) {
                throw ErrorTypes.ALREADY_EXISTS("Service subcategory with this name in the selected category");
            }
        }
        // Update the service subcategory
        const updatedServiceSubCategory = await prisma.serviceSubCategory.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description && { description }),
                ...(isNew !== undefined && { isNew }),
                ...(serviceCategoryId && { serviceCategoryId }),
            },
            select: {
                id: true,
                name: true,
                description: true,
                isNew: true,
                serviceCategoryId: true,
                createdAt: true,
                updatedAt: true,
                ServiceCategory: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        sendSuccess(res, "Service subcategory updated successfully", updatedServiceSubCategory);
    }
    catch (error) {
        handleError(error, res, "Failed to update service subcategory");
    }
};
// Delete a service subcategory
export const deleteServiceSubCategory = async (req, res) => {
    try {
        const { id } = req.validatedParams;
        // Check if service subcategory exists
        const existingSubCategory = await prisma.serviceSubCategory.findUnique({
            where: { id },
        });
        if (!existingSubCategory) {
            throw ErrorTypes.NOT_FOUND("Service subcategory");
        }
        // Check if service subcategory has related data
        const [serviceCount, jobCount] = await Promise.all([
            prisma.freelancingService.count({ where: { serviceSubCategoryId: id } }),
            prisma.job.count({ where: { serviceSubCategoryId: id } }),
        ]);
        const hasRelatedData = serviceCount > 0 || jobCount > 0;
        if (hasRelatedData) {
            throw new AppError("Cannot delete service subcategory that has related services or jobs. Please remove all related data first.", 400);
        }
        // Delete the service subcategory
        await prisma.serviceSubCategory.delete({
            where: { id },
        });
        sendSuccess(res, "Service subcategory deleted successfully");
    }
    catch (error) {
        handleError(error, res, "Failed to delete service subcategory");
    }
};
//# sourceMappingURL=serviceSubCategory.controllers.js.map
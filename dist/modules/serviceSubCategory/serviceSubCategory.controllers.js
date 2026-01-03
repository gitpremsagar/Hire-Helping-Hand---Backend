import { prisma } from "../../lib/prisma.js";
import { AppError, ErrorTypes, handleError, sendSuccess } from "../../utils/controllerErrorHandler.js";
// Utility function to generate slug from name
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};
// Utility function to get the next order number for a specific category
const getNextOrderNumber = async (serviceCategoryId) => {
    const lastSubCategory = await prisma.serviceSubCategory.findFirst({
        where: { serviceCategoryId },
        orderBy: { orderNumber: 'desc' },
        select: { orderNumber: true },
    });
    return (lastSubCategory?.orderNumber ?? 0) + 1;
};
// Create a new service subcategory
export const createServiceSubCategory = async (req, res) => {
    try {
        const { name, description, slug, orderNumber, isNew, serviceCategoryId } = req.body;
        // Generate slug if not provided
        const finalSlug = slug || generateSlug(name);
        // Check if service category exists
        const serviceCategory = await prisma.serviceCategory.findUnique({
            where: { id: serviceCategoryId },
        });
        if (!serviceCategory) {
            throw ErrorTypes.NOT_FOUND("Service category");
        }
        // Check if service subcategory with the same name already exists in the same category
        const existingSubCategoryByName = await prisma.serviceSubCategory.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive'
                },
                serviceCategoryId
            },
        });
        if (existingSubCategoryByName) {
            throw ErrorTypes.ALREADY_EXISTS("Service subcategory with this name in the selected category");
        }
        // Check if service subcategory with the same slug already exists
        const existingSubCategoryBySlug = await prisma.serviceSubCategory.findFirst({
            where: {
                slug: {
                    equals: finalSlug,
                    mode: 'insensitive'
                }
            },
        });
        if (existingSubCategoryBySlug) {
            throw ErrorTypes.ALREADY_EXISTS("Service subcategory with this slug");
        }
        // Get the order number (use provided or auto-assign)
        const finalOrderNumber = orderNumber ?? await getNextOrderNumber(serviceCategoryId);
        // Create the service subcategory
        const serviceSubCategory = await prisma.serviceSubCategory.create({
            data: {
                name,
                description,
                slug: finalSlug,
                orderNumber: finalOrderNumber,
                isNew: isNew ?? false,
                serviceCategoryId,
            },
            select: {
                id: true,
                name: true,
                description: true,
                slug: true,
                orderNumber: true,
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
                orderBy: [
                    { orderNumber: 'asc' },
                    { createdAt: 'desc' },
                ],
                select: {
                    id: true,
                    name: true,
                    description: true,
                    slug: true,
                    orderNumber: true,
                    isNew: true,
                    serviceCategoryId: true,
                    createdAt: true,
                    updatedAt: true,
                    ServiceCategory: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
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
                slug: true,
                orderNumber: true,
                isNew: true,
                serviceCategoryId: true,
                createdAt: true,
                updatedAt: true,
                ServiceCategory: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        slug: true,
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
// Get a single service subcategory by slug
export const getServiceSubCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.validatedParams;
        const serviceSubCategory = await prisma.serviceSubCategory.findUnique({
            where: { slug },
            select: {
                id: true,
                name: true,
                description: true,
                slug: true,
                orderNumber: true,
                isNew: true,
                serviceCategoryId: true,
                createdAt: true,
                updatedAt: true,
                ServiceCategory: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        slug: true,
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
        const { name, description, slug, orderNumber, isNew, serviceCategoryId } = req.body;
        // Check if service subcategory exists
        const existingSubCategory = await prisma.serviceSubCategory.findUnique({
            where: { id },
        });
        if (!existingSubCategory) {
            throw ErrorTypes.NOT_FOUND("Service subcategory");
        }
        // Generate slug if name is provided but slug is not
        const finalSlug = slug || (name ? generateSlug(name) : existingSubCategory.slug);
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
        // Check if another service subcategory with the same slug already exists
        if (finalSlug && finalSlug !== existingSubCategory.slug) {
            const duplicateSlug = await prisma.serviceSubCategory.findFirst({
                where: {
                    slug: {
                        equals: finalSlug,
                        mode: 'insensitive'
                    },
                    id: {
                        not: id
                    }
                },
            });
            if (duplicateSlug) {
                throw ErrorTypes.ALREADY_EXISTS("Service subcategory with this slug");
            }
        }
        // Update the service subcategory
        const updatedServiceSubCategory = await prisma.serviceSubCategory.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description && { description }),
                ...(finalSlug && { slug: finalSlug }),
                ...(orderNumber !== undefined && { orderNumber }),
                ...(isNew !== undefined && { isNew }),
                ...(serviceCategoryId && { serviceCategoryId }),
            },
            select: {
                id: true,
                name: true,
                description: true,
                slug: true,
                orderNumber: true,
                isNew: true,
                serviceCategoryId: true,
                createdAt: true,
                updatedAt: true,
                ServiceCategory: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
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
// Reorder service subcategories
export const reorderServiceSubCategories = async (req, res) => {
    try {
        const { subCategoryOrders } = req.body; // Array of { id: string, orderNumber: number }
        if (!Array.isArray(subCategoryOrders) || subCategoryOrders.length === 0) {
            throw new AppError("Subcategory orders array is required", 400);
        }
        // Validate that all IDs exist and are unique
        const subCategoryIds = subCategoryOrders.map((item) => item.id);
        const uniqueIds = [...new Set(subCategoryIds)];
        if (subCategoryIds.length !== uniqueIds.length) {
            throw new AppError("Duplicate subcategory IDs found", 400);
        }
        // Check if all subcategories exist
        const existingSubCategories = await prisma.serviceSubCategory.findMany({
            where: { id: { in: subCategoryIds } },
            select: { id: true },
        });
        if (existingSubCategories.length !== subCategoryIds.length) {
            throw new AppError("One or more service subcategories not found", 404);
        }
        // Update order numbers in a transaction
        await prisma.$transaction(subCategoryOrders.map((item) => prisma.serviceSubCategory.update({
            where: { id: item.id },
            data: { orderNumber: item.orderNumber },
        })));
        // Get updated subcategories with their new order
        const updatedSubCategories = await prisma.serviceSubCategory.findMany({
            where: { id: { in: subCategoryIds } },
            select: {
                id: true,
                name: true,
                orderNumber: true,
                serviceCategoryId: true,
            },
            orderBy: { orderNumber: 'asc' },
        });
        sendSuccess(res, "Service subcategories reordered successfully", updatedSubCategories);
    }
    catch (error) {
        handleError(error, res, "Failed to reorder service subcategories");
    }
};
// Get service subcategories ordered by orderNumber (for frontend display)
export const getServiceSubCategoriesOrdered = async (req, res) => {
    try {
        const { serviceCategoryId } = req.query;
        const whereClause = serviceCategoryId ? { serviceCategoryId } : {};
        const serviceSubCategories = await prisma.serviceSubCategory.findMany({
            where: whereClause,
            orderBy: [
                { orderNumber: 'asc' },
                { createdAt: 'asc' },
            ],
            select: {
                id: true,
                name: true,
                description: true,
                slug: true,
                orderNumber: true,
                isNew: true,
                serviceCategoryId: true,
                createdAt: true,
                updatedAt: true,
                ServiceCategory: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
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
        sendSuccess(res, "Service subcategories retrieved successfully (ordered)", serviceSubCategories);
    }
    catch (error) {
        handleError(error, res, "Failed to retrieve ordered service subcategories");
    }
};
//# sourceMappingURL=serviceSubCategory.controllers.js.map
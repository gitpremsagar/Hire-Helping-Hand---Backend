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
// Utility function to get the next order number
const getNextOrderNumber = async () => {
    const lastCategory = await prisma.serviceCategory.findFirst({
        orderBy: { orderNumber: 'desc' },
        select: { orderNumber: true },
    });
    return (lastCategory?.orderNumber ?? 0) + 1;
};
// Create a new service category
export const createServiceCategory = async (req, res) => {
    try {
        const { name, description, icon, slug, orderNumber, isNew } = req.body;
        // Generate slug if not provided
        const finalSlug = slug || generateSlug(name);
        // Check if service category with the same name already exists
        const existingCategoryByName = await prisma.serviceCategory.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive'
                }
            },
        });
        if (existingCategoryByName) {
            throw ErrorTypes.ALREADY_EXISTS("Service category with this name");
        }
        // Check if service category with the same slug already exists
        const existingCategoryBySlug = await prisma.serviceCategory.findFirst({
            where: {
                slug: {
                    equals: finalSlug,
                    mode: 'insensitive'
                }
            },
        });
        if (existingCategoryBySlug) {
            throw ErrorTypes.ALREADY_EXISTS("Service category with this slug");
        }
        // Get the order number (use provided or auto-assign)
        const finalOrderNumber = orderNumber ?? await getNextOrderNumber();
        // Create the service category
        const serviceCategory = await prisma.serviceCategory.create({
            data: {
                name,
                description,
                icon,
                slug: finalSlug,
                orderNumber: finalOrderNumber,
                isNew: isNew ?? false,
            },
            select: {
                id: true,
                name: true,
                description: true,
                icon: true,
                slug: true,
                orderNumber: true,
                isNew: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        sendSuccess(res, "Service category created successfully", serviceCategory, 201);
    }
    catch (error) {
        handleError(error, res, "Failed to create service category");
    }
};
// Get all service categories with pagination and search
export const getServiceCategories = async (req, res) => {
    try {
        const { page, limit, search } = req.validatedQuery;
        // Calculate skip value for pagination
        const skip = (page - 1) * limit;
        // Build where clause for search
        const whereClause = search
            ? {
                OR: [
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
                ],
            }
            : {};
        // Get service categories with pagination
        const [serviceCategories, totalCount] = await Promise.all([
            prisma.serviceCategory.findMany({
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
                    icon: true,
                    slug: true,
                    orderNumber: true,
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
                            slug: true,
                            orderNumber: true,
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
    }
    catch (error) {
        handleError(error, res, "Failed to retrieve service categories");
    }
};
// Get a single service category by ID
export const getServiceCategoryById = async (req, res) => {
    try {
        const { id } = req.validatedParams;
        const serviceCategory = await prisma.serviceCategory.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                icon: true,
                slug: true,
                orderNumber: true,
                isNew: true,
                createdAt: true,
                updatedAt: true,
                ServiceSubCategory: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        slug: true,
                        orderNumber: true,
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
    }
    catch (error) {
        handleError(error, res, "Failed to retrieve service category");
    }
};
// Get a single service category by slug
export const getServiceCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.validatedParams;
        const serviceCategory = await prisma.serviceCategory.findUnique({
            where: { slug },
            select: {
                id: true,
                name: true,
                description: true,
                icon: true,
                slug: true,
                orderNumber: true,
                isNew: true,
                createdAt: true,
                updatedAt: true,
                ServiceSubCategory: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        slug: true,
                        orderNumber: true,
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
    }
    catch (error) {
        handleError(error, res, "Failed to retrieve service category");
    }
};
// Update a service category
export const updateServiceCategory = async (req, res) => {
    try {
        const { id } = req.validatedParams;
        const { name, description, icon, slug, orderNumber, isNew } = req.body;
        // Check if service category exists
        const existingCategory = await prisma.serviceCategory.findUnique({
            where: { id },
        });
        if (!existingCategory) {
            throw ErrorTypes.NOT_FOUND("Service category");
        }
        // Generate slug if name is provided but slug is not
        const finalSlug = slug || (name ? generateSlug(name) : existingCategory.slug);
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
        // Check if another service category with the same slug already exists (excluding current one)
        if (finalSlug && finalSlug !== existingCategory.slug) {
            const duplicateSlug = await prisma.serviceCategory.findFirst({
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
                throw ErrorTypes.ALREADY_EXISTS("Service category with this slug");
            }
        }
        // Update the service category
        const updatedServiceCategory = await prisma.serviceCategory.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description && { description }),
                ...(icon !== undefined && { icon }),
                ...(finalSlug && { slug: finalSlug }),
                ...(orderNumber !== undefined && { orderNumber }),
                ...(isNew !== undefined && { isNew }),
            },
            select: {
                id: true,
                name: true,
                description: true,
                icon: true,
                slug: true,
                orderNumber: true,
                isNew: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        sendSuccess(res, "Service category updated successfully", updatedServiceCategory);
    }
    catch (error) {
        handleError(error, res, "Failed to update service category");
    }
};
// Delete a service category
export const deleteServiceCategory = async (req, res) => {
    try {
        const { id } = req.validatedParams;
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
            throw new AppError("Cannot delete service category that has related subcategories, services, or jobs. Please remove all related data first.", 400);
        }
        // Delete the service category
        await prisma.serviceCategory.delete({
            where: { id },
        });
        sendSuccess(res, "Service category deleted successfully");
    }
    catch (error) {
        handleError(error, res, "Failed to delete service category");
    }
};
// Reorder service categories
export const reorderServiceCategories = async (req, res) => {
    try {
        const { categoryOrders } = req.body; // Array of { id: string, orderNumber: number }
        if (!Array.isArray(categoryOrders) || categoryOrders.length === 0) {
            throw new AppError("Category orders array is required", 400);
        }
        // Validate that all IDs exist and are unique
        const categoryIds = categoryOrders.map((item) => item.id);
        const uniqueIds = [...new Set(categoryIds)];
        if (categoryIds.length !== uniqueIds.length) {
            throw new AppError("Duplicate category IDs found", 400);
        }
        // Check if all categories exist
        const existingCategories = await prisma.serviceCategory.findMany({
            where: { id: { in: categoryIds } },
            select: { id: true },
        });
        if (existingCategories.length !== categoryIds.length) {
            throw new AppError("One or more service categories not found", 404);
        }
        // Update order numbers in a transaction
        await prisma.$transaction(categoryOrders.map((item) => prisma.serviceCategory.update({
            where: { id: item.id },
            data: { orderNumber: item.orderNumber },
        })));
        // Get updated categories with their new order
        const updatedCategories = await prisma.serviceCategory.findMany({
            where: { id: { in: categoryIds } },
            select: {
                id: true,
                name: true,
                orderNumber: true,
            },
            orderBy: { orderNumber: 'asc' },
        });
        sendSuccess(res, "Service categories reordered successfully", updatedCategories);
    }
    catch (error) {
        handleError(error, res, "Failed to reorder service categories");
    }
};
// Get service categories ordered by orderNumber (for frontend display)
export const getServiceCategoriesOrdered = async (req, res) => {
    try {
        const serviceCategories = await prisma.serviceCategory.findMany({
            orderBy: [
                { orderNumber: 'asc' },
                { createdAt: 'asc' },
            ],
            select: {
                id: true,
                name: true,
                description: true,
                icon: true,
                slug: true,
                orderNumber: true,
                isNew: true,
                createdAt: true,
                updatedAt: true,
                ServiceSubCategory: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        slug: true,
                        orderNumber: true,
                        isNew: true,
                    },
                    orderBy: { orderNumber: 'asc' },
                },
                _count: {
                    select: {
                        ServiceSubCategory: true,
                        FreelancingService: true,
                        Job: true,
                    },
                },
            },
        });
        sendSuccess(res, "Service categories retrieved successfully (ordered)", serviceCategories);
    }
    catch (error) {
        handleError(error, res, "Failed to retrieve ordered service categories");
    }
};
//# sourceMappingURL=serviceCategory.controllers.js.map
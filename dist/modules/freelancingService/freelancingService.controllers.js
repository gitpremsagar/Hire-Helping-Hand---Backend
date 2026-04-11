import { prisma } from "../../lib/prisma.js";
import { AppError, ErrorTypes, handleError, sendSuccess } from "../../utils/controllerErrorHandler.js";
import { categoryAndSubcategoryMatch, enrichCategoryFields, } from "../../constants/service-taxonomy.js";
// Create a new freelancing service
export const createFreelancingService = async (req, res) => {
    try {
        const { freelancerId, title, description, serviceCategoryId, serviceSubCategoryId, basePrice, currency, isCustomPricing, deliveryTime, revisionPolicy, rushDeliveryAvailable, rushDeliveryFee, deliveryGuarantee, requirements, faq, communicationLanguage, timezone, availability, gallery, videoIntroduction, portfolioItems, beforeAfterImages, features, addOns, extras, tags, keywords, metaDescription, isCustomizable, customFields, templateOptions } = req.body;
        // Check if freelancer exists and is active
        const freelancer = await prisma.user.findUnique({
            where: { id: freelancerId },
            select: { id: true, isActive: true, isFreelancer: true }
        });
        if (!freelancer) {
            throw ErrorTypes.NOT_FOUND("Freelancer");
        }
        if (!freelancer.isActive || !freelancer.isFreelancer) {
            throw new AppError("Freelancer is not active or not a freelancer", 400);
        }
        if (!categoryAndSubcategoryMatch(serviceCategoryId, serviceSubCategoryId)) {
            throw new AppError("Service subcategory does not belong to the selected category", 400);
        }
        // Generate unique slug
        const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        let slug = baseSlug;
        let counter = 1;
        while (await prisma.freelancingService.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        // Create the freelancing service
        const freelancingService = await prisma.freelancingService.create({
            data: {
                freelancerId,
                title,
                description,
                slug,
                serviceCategory: serviceCategoryId,
                serviceSubCategory: serviceSubCategoryId,
                basePrice,
                currency: currency || "USD",
                isCustomPricing: isCustomPricing || false,
                deliveryTime,
                revisionPolicy: revisionPolicy || 0,
                rushDeliveryAvailable: rushDeliveryAvailable || false,
                rushDeliveryFee,
                deliveryGuarantee,
                requirements,
                faq,
                communicationLanguage: communicationLanguage || [],
                timezone,
                availability,
                gallery: gallery || [],
                videoIntroduction,
                portfolioItems: portfolioItems || [],
                beforeAfterImages: beforeAfterImages || [],
                features: features || [],
                addOns,
                extras,
                tags: tags || [],
                keywords: keywords || [],
                metaDescription,
                isCustomizable: isCustomizable || false,
                customFields,
                templateOptions
            },
            select: {
                id: true,
                title: true,
                description: true,
                slug: true,
                basePrice: true,
                currency: true,
                isCustomPricing: true,
                deliveryTime: true,
                revisionPolicy: true,
                rushDeliveryAvailable: true,
                rushDeliveryFee: true,
                deliveryGuarantee: true,
                isActive: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                freelancer: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                serviceCategory: true,
                serviceSubCategory: true
            }
        });
        sendSuccess(res, "Freelancing service created successfully", enrichCategoryFields(freelancingService), 201);
    }
    catch (error) {
        console.log(error);
        handleError(error, res, "Failed to create freelancing service");
    }
};
// Get all freelancing services with pagination and search
export const getFreelancingServices = async (req, res) => {
    try {
        const { page, limit, search, categoryId, subCategoryId, freelancerId, status, minPrice, maxPrice, sortBy, sortOrder } = req.validatedQuery;
        // Calculate skip value for pagination
        const skip = (page - 1) * limit;
        // Build where clause for filters
        const whereClause = {};
        if (search) {
            whereClause.OR = [
                {
                    title: {
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
                {
                    tags: {
                        has: search
                    }
                }
            ];
        }
        if (categoryId) {
            whereClause.serviceCategory = categoryId;
        }
        if (subCategoryId) {
            whereClause.serviceSubCategory = subCategoryId;
        }
        if (freelancerId) {
            whereClause.freelancerId = freelancerId;
        }
        if (status) {
            whereClause.status = status;
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            whereClause.basePrice = {};
            if (minPrice !== undefined) {
                whereClause.basePrice.gte = minPrice;
            }
            if (maxPrice !== undefined) {
                whereClause.basePrice.lte = maxPrice;
            }
        }
        // Build order by clause
        let orderBy = { createdAt: 'desc' };
        if (sortBy) {
            const order = sortOrder === 'asc' ? 'asc' : 'desc';
            switch (sortBy) {
                case 'price':
                    orderBy = { basePrice: order };
                    break;
                case 'rating':
                    orderBy = { rating: order };
                    break;
                case 'deliveryTime':
                    orderBy = { deliveryTime: order };
                    break;
                case 'createdAt':
                    orderBy = { createdAt: order };
                    break;
                default:
                    orderBy = { createdAt: 'desc' };
            }
        }
        // Get freelancing services with pagination
        const [freelancingServices, totalCount] = await Promise.all([
            prisma.freelancingService.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy,
                select: {
                    id: true,
                    title: true,
                    description: true,
                    slug: true,
                    basePrice: true,
                    currency: true,
                    isCustomPricing: true,
                    deliveryTime: true,
                    revisionPolicy: true,
                    rushDeliveryAvailable: true,
                    rushDeliveryFee: true,
                    deliveryGuarantee: true,
                    isActive: true,
                    isTopRated: true,
                    isProSeller: true,
                    isFeatured: true,
                    badges: true,
                    rating: true,
                    ratingCount: true,
                    completionRate: true,
                    responseTime: true,
                    orderCount: true,
                    status: true,
                    views: true,
                    favorites: true,
                    createdAt: true,
                    updatedAt: true,
                    freelancer: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                            country: true,
                            city: true
                        }
                    },
                    serviceCategory: true,
                    serviceSubCategory: true,
                    _count: {
                        select: {
                            reviews: true,
                            contracts: true
                        }
                    }
                }
            }),
            prisma.freelancingService.count({
                where: whereClause
            })
        ]);
        // Calculate pagination info
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        sendSuccess(res, "Freelancing services retrieved successfully", {
            freelancingServices: freelancingServices.map((fs) => enrichCategoryFields(fs)),
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalCount,
                itemsPerPage: limit,
                hasNextPage,
                hasPrevPage
            }
        });
    }
    catch (error) {
        handleError(error, res, "Failed to retrieve freelancing services");
    }
};
// Get a single freelancing service by ID
export const getFreelancingServiceById = async (req, res) => {
    try {
        const { id } = req.validatedParams;
        const freelancingService = await prisma.freelancingService.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                description: true,
                slug: true,
                basePrice: true,
                currency: true,
                isCustomPricing: true,
                deliveryTime: true,
                revisionPolicy: true,
                rushDeliveryAvailable: true,
                rushDeliveryFee: true,
                deliveryGuarantee: true,
                isActive: true,
                isTopRated: true,
                isProSeller: true,
                isFeatured: true,
                badges: true,
                rating: true,
                ratingCount: true,
                completionRate: true,
                responseTime: true,
                orderCount: true,
                requirements: true,
                faq: true,
                communicationLanguage: true,
                timezone: true,
                availability: true,
                gallery: true,
                videoIntroduction: true,
                portfolioItems: true,
                beforeAfterImages: true,
                features: true,
                addOns: true,
                extras: true,
                tags: true,
                keywords: true,
                metaDescription: true,
                status: true,
                views: true,
                favorites: true,
                conversionRate: true,
                lastOrderDate: true,
                averageOrderValue: true,
                isCustomizable: true,
                customFields: true,
                templateOptions: true,
                createdAt: true,
                updatedAt: true,
                freelancer: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        bio: true,
                        country: true,
                        city: true,
                        website: true,
                        _count: {
                            select: {
                                freelancingServices: true,
                                portfolioItems: true
                            }
                        }
                    }
                },
                serviceCategory: true,
                serviceSubCategory: true,
                packages: {
                    select: {
                        id: true,
                        tier: true,
                        name: true,
                        description: true,
                        deliveryDays: true,
                        revisions: true,
                        price: true
                    }
                },
                reviews: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                        createdAt: true,
                        clientId: true
                    },
                    take: 10,
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                _count: {
                    select: {
                        reviews: true,
                        contracts: true
                    }
                }
            }
        });
        if (!freelancingService) {
            throw ErrorTypes.NOT_FOUND("Freelancing service");
        }
        // Increment view count
        await prisma.freelancingService.update({
            where: { id },
            data: {
                views: {
                    increment: 1
                }
            }
        });
        sendSuccess(res, "Freelancing service retrieved successfully", enrichCategoryFields(freelancingService));
    }
    catch (error) {
        handleError(error, res, "Failed to retrieve freelancing service");
    }
};
// Update a freelancing service
export const updateFreelancingService = async (req, res) => {
    try {
        const { id } = req.validatedParams;
        const updateData = req.body;
        const existingService = await prisma.freelancingService.findUnique({
            where: { id },
            select: {
                id: true,
                freelancerId: true,
                title: true,
                slug: true,
                serviceCategory: true,
                serviceSubCategory: true,
            },
        });
        if (!existingService) {
            throw ErrorTypes.NOT_FOUND("Freelancing service");
        }
        const { serviceCategoryId, serviceSubCategoryId, ...rest } = updateData;
        const data = { ...rest };
        delete data.serviceCategoryId;
        delete data.serviceSubCategoryId;
        if (serviceCategoryId !== undefined) {
            data.serviceCategory = serviceCategoryId;
        }
        if (serviceSubCategoryId !== undefined) {
            data.serviceSubCategory = serviceSubCategoryId;
        }
        const nextCategory = data.serviceCategory ?? existingService.serviceCategory;
        const nextSub = data.serviceSubCategory ?? existingService.serviceSubCategory;
        if (!categoryAndSubcategoryMatch(nextCategory, nextSub)) {
            throw new AppError("Service subcategory does not belong to the selected category", 400);
        }
        if (updateData.title && updateData.title !== existingService.title) {
            const baseSlug = String(updateData.title)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            let slug = baseSlug;
            let counter = 1;
            while (await prisma.freelancingService.findUnique({ where: { slug } })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
            data.slug = slug;
        }
        const updatedFreelancingService = await prisma.freelancingService.update({
            where: { id },
            data: data,
            select: {
                id: true,
                title: true,
                description: true,
                slug: true,
                basePrice: true,
                currency: true,
                isCustomPricing: true,
                deliveryTime: true,
                revisionPolicy: true,
                rushDeliveryAvailable: true,
                rushDeliveryFee: true,
                deliveryGuarantee: true,
                isActive: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                freelancer: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                serviceCategory: true,
                serviceSubCategory: true,
            },
        });
        sendSuccess(res, "Freelancing service updated successfully", enrichCategoryFields(updatedFreelancingService));
    }
    catch (error) {
        handleError(error, res, "Failed to update freelancing service");
    }
};
// Delete a freelancing service
export const deleteFreelancingService = async (req, res) => {
    try {
        const { id } = req.validatedParams;
        // Check if freelancing service exists
        const existingService = await prisma.freelancingService.findUnique({
            where: { id }
        });
        if (!existingService) {
            throw ErrorTypes.NOT_FOUND("Freelancing service");
        }
        // Check if freelancing service has related data
        const [packageCount, reviewCount, contractCount] = await Promise.all([
            prisma.freelancingServicePackage.count({ where: { freelancingServiceId: id } }),
            prisma.freelancingServiceReview.count({ where: { freelancingServiceId: id } }),
            prisma.contract.count({ where: { boughtFreelancingServiceId: id } })
        ]);
        const hasRelatedData = packageCount > 0 || reviewCount > 0 || contractCount > 0;
        if (hasRelatedData) {
            throw new AppError("Cannot delete freelancing service that has related packages, reviews, or contracts. Please remove all related data first.", 400);
        }
        // Delete the freelancing service
        await prisma.freelancingService.delete({
            where: { id }
        });
        sendSuccess(res, "Freelancing service deleted successfully");
    }
    catch (error) {
        handleError(error, res, "Failed to delete freelancing service");
    }
};
// Get freelancing services by freelancer
export const getFreelancingServicesByFreelancer = async (req, res) => {
    try {
        const { freelancerId } = req.validatedParams;
        const { page, limit, status } = req.validatedQuery;
        // Calculate skip value for pagination
        const skip = (page - 1) * limit;
        // Build where clause
        const whereClause = { freelancerId };
        if (status) {
            whereClause.status = status;
        }
        // Get freelancing services
        const [freelancingServices, totalCount] = await Promise.all([
            prisma.freelancingService.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    slug: true,
                    basePrice: true,
                    currency: true,
                    deliveryTime: true,
                    isActive: true,
                    status: true,
                    views: true,
                    favorites: true,
                    orderCount: true,
                    rating: true,
                    ratingCount: true,
                    createdAt: true,
                    updatedAt: true,
                    serviceCategory: true,
                    serviceSubCategory: true,
                    _count: {
                        select: {
                            reviews: true,
                            contracts: true
                        }
                    }
                }
            }),
            prisma.freelancingService.count({
                where: whereClause
            })
        ]);
        // Calculate pagination info
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        sendSuccess(res, "Freelancing services retrieved successfully", {
            freelancingServices: freelancingServices.map((fs) => enrichCategoryFields(fs)),
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalCount,
                itemsPerPage: limit,
                hasNextPage,
                hasPrevPage
            }
        });
    }
    catch (error) {
        handleError(error, res, "Failed to retrieve freelancing services");
    }
};
//# sourceMappingURL=freelancingService.controllers.js.map
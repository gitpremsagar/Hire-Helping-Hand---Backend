import { JobStatus, JobVisibility } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { AppError, handleError, sendSuccess } from "../../utils/controllerErrorHandler.js";
import { findCategoryBySlug, findSubcategoryBySlug, categoryAndSubcategoryMatch, } from "../../constants/service-taxonomy.js";
export const getBrowseJobs = async (req, res) => {
    try {
        const { categorySlug, subCategorySlug, page, limit } = req.validatedQuery;
        const categoryEnum = findCategoryBySlug(categorySlug);
        const subEnum = findSubcategoryBySlug(subCategorySlug);
        if (!categoryEnum || !subEnum) {
            throw new AppError("Invalid category or subcategory", 400);
        }
        if (!categoryAndSubcategoryMatch(categoryEnum, subEnum)) {
            throw new AppError("Subcategory does not belong to the selected category", 400);
        }
        const whereClause = {
            serviceCategory: categoryEnum,
            serviceSubCategory: subEnum,
            status: JobStatus.OPEN,
            visibility: { in: [JobVisibility.PUBLIC, JobVisibility.FEATURED] },
            isActive: true,
            isDeleted: false,
            isArchived: false,
            isInTrash: false,
            isPaused: false,
        };
        const skip = (page - 1) * limit;
        const [jobs, totalCount] = await Promise.all([
            prisma.job.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: [{ isFeatured: "desc" }, { deadline: "asc" }],
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    description: true,
                    deadline: true,
                    serviceCategory: true,
                    serviceSubCategory: true,
                    budget: true,
                    budgetMin: true,
                    budgetMax: true,
                    budgetType: true,
                    currency: true,
                    complexity: true,
                    experienceLevel: true,
                    clientLocation: true,
                    isUrgent: true,
                    client: {
                        select: {
                            id: true,
                            name: true,
                            country: true,
                            city: true,
                        },
                    },
                },
            }),
            prisma.job.count({ where: whereClause }),
        ]);
        const totalPages = Math.ceil(totalCount / limit) || 1;
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        sendSuccess(res, "Jobs retrieved successfully", {
            jobs,
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
        handleError(error, res, "Failed to retrieve jobs");
    }
};
//# sourceMappingURL=freelancerBrowseJobs.controllers.js.map
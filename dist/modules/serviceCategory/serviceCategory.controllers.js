import { ServiceCategory } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { ErrorTypes, handleError, sendSuccess } from "../../utils/controllerErrorHandler.js";
import { SERVICE_CATEGORY_ORDER, buildServiceCategoryApiRow, findCategoryBySlug, isValidServiceCategory, } from "../../constants/service-taxonomy.js";
/** Only rows with a valid enum value (excludes legacy null / invalid MongoDB values that break groupBy). */
const ALL_SERVICE_CATEGORIES = Object.values(ServiceCategory);
async function loadUsageCountsByCategory() {
    const [fsGroups, jobGroups] = await Promise.all([
        prisma.freelancingService.groupBy({
            by: ["serviceCategory"],
            where: { serviceCategory: { in: ALL_SERVICE_CATEGORIES } },
            _count: { _all: true },
        }),
        prisma.job.groupBy({
            by: ["serviceCategory"],
            where: { serviceCategory: { in: ALL_SERVICE_CATEGORIES } },
            _count: { _all: true },
        }),
    ]);
    const freelancing = Object.fromEntries(fsGroups.map((r) => [r.serviceCategory, r._count._all]));
    const jobs = Object.fromEntries(jobGroups.map((r) => [r.serviceCategory, r._count._all]));
    const out = {};
    for (const cat of SERVICE_CATEGORY_ORDER) {
        out[cat] = {
            freelancing: freelancing[cat] ?? 0,
            jobs: jobs[cat] ?? 0,
        };
    }
    return out;
}
function allCategoryRows(counts) {
    return SERVICE_CATEGORY_ORDER.map((cat) => buildServiceCategoryApiRow(cat, counts[cat]));
}
/** GET / — paginated list with optional search (name/description/slug) */
export const getServiceCategories = async (req, res) => {
    try {
        const { page, limit, search } = req.validatedQuery;
        const counts = await loadUsageCountsByCategory();
        let rows = allCategoryRows(counts);
        if (search?.trim()) {
            const q = search.trim().toLowerCase();
            rows = rows.filter((row) => {
                const hay = `${row.name} ${row.description} ${row.slug}`.toLowerCase();
                return hay.includes(q);
            });
        }
        const totalCount = rows.length;
        const skip = (page - 1) * limit;
        const serviceCategories = rows.slice(skip, skip + limit);
        const totalPages = Math.ceil(totalCount / limit) || 1;
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
/** GET /:id — id is enum value e.g. PROGRAMMING_AND_TECH */
export const getServiceCategoryById = async (req, res) => {
    try {
        const { id } = req.validatedParams;
        if (!isValidServiceCategory(id)) {
            throw ErrorTypes.NOT_FOUND("Service category");
        }
        const counts = await loadUsageCountsByCategory();
        const serviceCategory = buildServiceCategoryApiRow(id, counts[id]);
        sendSuccess(res, "Service category retrieved successfully", serviceCategory);
    }
    catch (error) {
        handleError(error, res, "Failed to retrieve service category");
    }
};
/** GET /slug/:slug */
export const getServiceCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.validatedParams;
        const cat = findCategoryBySlug(slug);
        if (!cat) {
            throw ErrorTypes.NOT_FOUND("Service category");
        }
        const counts = await loadUsageCountsByCategory();
        const serviceCategory = buildServiceCategoryApiRow(cat, counts[cat]);
        sendSuccess(res, "Service category retrieved successfully", serviceCategory);
    }
    catch (error) {
        handleError(error, res, "Failed to retrieve service category");
    }
};
/** GET /ordered — all categories with nested subcategories (for dropdowns) */
export const getServiceCategoriesOrdered = async (_req, res) => {
    try {
        const counts = await loadUsageCountsByCategory();
        const serviceCategories = allCategoryRows(counts);
        sendSuccess(res, "Service categories retrieved successfully (ordered)", serviceCategories);
    }
    catch (error) {
        handleError(error, res, "Failed to retrieve ordered service categories");
    }
};
//# sourceMappingURL=serviceCategory.controllers.js.map
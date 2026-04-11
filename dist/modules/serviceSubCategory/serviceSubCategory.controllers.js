import { ErrorTypes, handleError, sendSuccess } from "../../utils/controllerErrorHandler.js";
import { SERVICE_CATEGORY_METADATA, SERVICE_SUBCATEGORY_METADATA, findSubcategoryBySlug, isValidServiceCategory, isValidServiceSubCategory, subcategoriesOrderedForCategory, subcategorySummary, } from "../../constants/service-taxonomy.js";
const TAXONOMY_FIXED_DATETIME = "2024-01-01T00:00:00.000Z";
function subRow(sub) {
    const sm = SERVICE_SUBCATEGORY_METADATA[sub];
    const catMeta = SERVICE_CATEGORY_METADATA[sm.serviceCategoryId];
    return {
        id: sub,
        name: sm.name,
        description: sm.description,
        slug: sm.slug,
        orderNumber: sm.orderNumber,
        isNew: sm.isNew,
        icon: sm.icon,
        serviceCategoryId: sm.serviceCategoryId,
        createdAt: TAXONOMY_FIXED_DATETIME,
        updatedAt: TAXONOMY_FIXED_DATETIME,
        ServiceCategory: {
            id: sm.serviceCategoryId,
            name: catMeta.name,
        },
    };
}
/** GET / */
export const getServiceSubCategories = async (req, res) => {
    try {
        const { page, limit, search, serviceCategoryId } = req.validatedQuery;
        let subs;
        if (serviceCategoryId) {
            if (!isValidServiceCategory(serviceCategoryId)) {
                throw ErrorTypes.NOT_FOUND("Service category");
            }
            subs = subcategoriesOrderedForCategory(serviceCategoryId);
        }
        else {
            subs = Object.keys(SERVICE_SUBCATEGORY_METADATA).sort((a, b) => SERVICE_SUBCATEGORY_METADATA[a].orderNumber - SERVICE_SUBCATEGORY_METADATA[b].orderNumber);
        }
        let rows = subs.map((s) => subRow(s));
        if (search?.trim()) {
            const q = search.trim().toLowerCase();
            rows = rows.filter((row) => {
                const hay = `${row.name} ${row.description} ${row.slug}`.toLowerCase();
                return hay.includes(q);
            });
        }
        const totalCount = rows.length;
        const skip = (page - 1) * limit;
        const serviceSubCategories = rows.slice(skip, skip + limit);
        const totalPages = Math.ceil(totalCount / limit) || 1;
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
/** GET /ordered */
export const getServiceSubCategoriesOrdered = async (req, res) => {
    try {
        const { serviceCategoryId } = req.query;
        let subs;
        if (serviceCategoryId) {
            if (!isValidServiceCategory(serviceCategoryId)) {
                throw ErrorTypes.NOT_FOUND("Service category");
            }
            subs = subcategoriesOrderedForCategory(serviceCategoryId);
        }
        else {
            subs = Object.keys(SERVICE_SUBCATEGORY_METADATA).sort((a, b) => SERVICE_SUBCATEGORY_METADATA[a].orderNumber - SERVICE_SUBCATEGORY_METADATA[b].orderNumber);
        }
        const serviceSubCategories = subs.map((s) => ({
            ...subcategorySummary(s),
            createdAt: TAXONOMY_FIXED_DATETIME,
            updatedAt: TAXONOMY_FIXED_DATETIME,
        }));
        sendSuccess(res, "Service subcategories retrieved successfully (ordered)", serviceSubCategories);
    }
    catch (error) {
        handleError(error, res, "Failed to retrieve ordered service subcategories");
    }
};
/** GET /:id */
export const getServiceSubCategoryById = async (req, res) => {
    try {
        const { id } = req.validatedParams;
        if (!isValidServiceSubCategory(id)) {
            throw ErrorTypes.NOT_FOUND("Service subcategory");
        }
        const serviceSubCategory = subRow(id);
        sendSuccess(res, "Service subcategory retrieved successfully", serviceSubCategory);
    }
    catch (error) {
        handleError(error, res, "Failed to retrieve service subcategory");
    }
};
/** GET /slug/:slug */
export const getServiceSubCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.validatedParams;
        const sub = findSubcategoryBySlug(slug);
        if (!sub) {
            throw ErrorTypes.NOT_FOUND("Service subcategory");
        }
        const serviceSubCategory = subRow(sub);
        sendSuccess(res, "Service subcategory retrieved successfully", serviceSubCategory);
    }
    catch (error) {
        handleError(error, res, "Failed to retrieve service subcategory");
    }
};
//# sourceMappingURL=serviceSubCategory.controllers.js.map
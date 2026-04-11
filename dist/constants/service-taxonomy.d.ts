/**
 * Canonical service category / subcategory taxonomy (code-defined).
 * Matches Prisma enums `ServiceCategory` and `ServiceSubCategory` in schema.prisma.
 * Update enums and this file together.
 */
import { ServiceCategory as ServiceCategoryEnum, ServiceSubCategory as ServiceSubCategoryEnum } from "@prisma/client";
export { ServiceCategoryEnum, ServiceSubCategoryEnum };
export declare const SERVICE_SUBCATEGORY_TO_CATEGORY: Record<ServiceSubCategoryEnum, ServiceCategoryEnum>;
export type ServiceCategoryMeta = {
    name: string;
    description: string;
    slug: string;
    orderNumber: number;
    icon: string | null;
    isNew: boolean;
};
export type ServiceSubCategoryMeta = ServiceCategoryMeta & {
    serviceCategoryId: ServiceCategoryEnum;
};
export declare const SERVICE_CATEGORY_ORDER: ServiceCategoryEnum[];
export declare const SERVICE_CATEGORY_METADATA: Record<ServiceCategoryEnum, ServiceCategoryMeta>;
export declare const SERVICE_SUBCATEGORY_METADATA: Record<ServiceSubCategoryEnum, ServiceSubCategoryMeta>;
export declare function isValidServiceCategory(value: string): value is ServiceCategoryEnum;
export declare function isValidServiceSubCategory(value: string): value is ServiceSubCategoryEnum;
export declare function categoryAndSubcategoryMatch(category: ServiceCategoryEnum, subcategory: ServiceSubCategoryEnum): boolean;
export declare function getSubcategoriesForCategory(category: ServiceCategoryEnum): ServiceSubCategoryEnum[];
export declare function subcategoriesOrderedForCategory(category: ServiceCategoryEnum): ServiceSubCategoryEnum[];
export declare function categorySummary(cat: ServiceCategoryEnum): {
    id: import("@prisma/client").$Enums.ServiceCategory;
    name: string;
    description: string;
    slug: string;
    icon: string | null;
    orderNumber: number;
    isNew: boolean;
};
export declare function subcategorySummary(sub: ServiceSubCategoryEnum): {
    id: import("@prisma/client").$Enums.ServiceSubCategory;
    name: string;
    description: string;
    slug: string;
    icon: string | null;
    orderNumber: number;
    isNew: boolean;
    serviceCategoryId: import("@prisma/client").$Enums.ServiceCategory;
};
/** API compatibility: legacy `*Id` keys + nested summaries (matches former Prisma relation shape). */
export declare function enrichCategoryFields<T extends {
    serviceCategory: ServiceCategoryEnum;
    serviceSubCategory: ServiceSubCategoryEnum;
}>(row: T): T & {
    serviceCategoryId: import("@prisma/client").$Enums.ServiceCategory;
    serviceSubCategoryId: import("@prisma/client").$Enums.ServiceSubCategory;
    ServiceCategory: {
        id: import("@prisma/client").$Enums.ServiceCategory;
        name: string;
        description: string;
        slug: string;
        icon: string | null;
        orderNumber: number;
        isNew: boolean;
    };
    ServiceSubCategory: {
        id: import("@prisma/client").$Enums.ServiceSubCategory;
        name: string;
        description: string;
        slug: string;
        icon: string | null;
        orderNumber: number;
        isNew: boolean;
        serviceCategoryId: import("@prisma/client").$Enums.ServiceCategory;
    };
};
/** Full category row for GET /service-categories (shape aligned with former Prisma response). */
export declare function buildServiceCategoryApiRow(cat: ServiceCategoryEnum, counts: {
    freelancing: number;
    jobs: number;
}): {
    id: import("@prisma/client").$Enums.ServiceCategory;
    name: string;
    description: string;
    icon: string | null;
    slug: string;
    orderNumber: number;
    isNew: boolean;
    createdAt: string;
    updatedAt: string;
    ServiceSubCategory: {
        id: import("@prisma/client").$Enums.ServiceSubCategory;
        name: string;
        description: string;
        slug: string;
        orderNumber: number;
        isNew: boolean;
        icon: string | null;
        serviceCategoryId: import("@prisma/client").$Enums.ServiceCategory;
        createdAt: string;
        updatedAt: string;
    }[];
    _count: {
        ServiceSubCategory: number;
        FreelancingService: number;
        Job: number;
    };
};
export declare function findCategoryBySlug(slug: string): ServiceCategoryEnum | undefined;
export declare function findSubcategoryBySlug(slug: string): ServiceSubCategoryEnum | undefined;
//# sourceMappingURL=service-taxonomy.d.ts.map
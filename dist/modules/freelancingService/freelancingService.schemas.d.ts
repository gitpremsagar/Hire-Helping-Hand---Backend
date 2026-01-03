import { z } from "zod";
declare const createFreelancingServiceSchema: z.ZodObject<{
    freelancerId: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    serviceCategoryId: z.ZodString;
    serviceSubCategoryId: z.ZodString;
    basePrice: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    isCustomPricing: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    deliveryTime: z.ZodNumber;
    revisionPolicy: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    rushDeliveryAvailable: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    rushDeliveryFee: z.ZodOptional<z.ZodNumber>;
    deliveryGuarantee: z.ZodOptional<z.ZodString>;
    requirements: z.ZodOptional<z.ZodString>;
    faq: z.ZodOptional<z.ZodAny>;
    communicationLanguage: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    timezone: z.ZodOptional<z.ZodString>;
    availability: z.ZodOptional<z.ZodAny>;
    gallery: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    videoIntroduction: z.ZodOptional<z.ZodString>;
    portfolioItems: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    beforeAfterImages: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    features: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    addOns: z.ZodOptional<z.ZodAny>;
    extras: z.ZodOptional<z.ZodAny>;
    tags: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    keywords: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    metaDescription: z.ZodOptional<z.ZodString>;
    isCustomizable: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    customFields: z.ZodOptional<z.ZodAny>;
    templateOptions: z.ZodOptional<z.ZodAny>;
}, z.core.$strip>;
declare const updateFreelancingServiceSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    serviceCategoryId: z.ZodOptional<z.ZodString>;
    serviceSubCategoryId: z.ZodOptional<z.ZodString>;
    basePrice: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodOptional<z.ZodString>;
    isCustomPricing: z.ZodOptional<z.ZodBoolean>;
    deliveryTime: z.ZodOptional<z.ZodNumber>;
    revisionPolicy: z.ZodOptional<z.ZodNumber>;
    rushDeliveryAvailable: z.ZodOptional<z.ZodBoolean>;
    rushDeliveryFee: z.ZodOptional<z.ZodNumber>;
    deliveryGuarantee: z.ZodOptional<z.ZodString>;
    requirements: z.ZodOptional<z.ZodString>;
    faq: z.ZodOptional<z.ZodAny>;
    communicationLanguage: z.ZodOptional<z.ZodArray<z.ZodString>>;
    timezone: z.ZodOptional<z.ZodString>;
    availability: z.ZodOptional<z.ZodAny>;
    gallery: z.ZodOptional<z.ZodArray<z.ZodString>>;
    videoIntroduction: z.ZodOptional<z.ZodString>;
    portfolioItems: z.ZodOptional<z.ZodArray<z.ZodString>>;
    beforeAfterImages: z.ZodOptional<z.ZodArray<z.ZodString>>;
    features: z.ZodOptional<z.ZodArray<z.ZodString>>;
    addOns: z.ZodOptional<z.ZodAny>;
    extras: z.ZodOptional<z.ZodAny>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    keywords: z.ZodOptional<z.ZodArray<z.ZodString>>;
    metaDescription: z.ZodOptional<z.ZodString>;
    isCustomizable: z.ZodOptional<z.ZodBoolean>;
    customFields: z.ZodOptional<z.ZodAny>;
    templateOptions: z.ZodOptional<z.ZodAny>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    isTopRated: z.ZodOptional<z.ZodBoolean>;
    isProSeller: z.ZodOptional<z.ZodBoolean>;
    isFeatured: z.ZodOptional<z.ZodBoolean>;
    badges: z.ZodOptional<z.ZodArray<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<{
        DRAFT: "DRAFT";
        PENDING_APPROVAL: "PENDING_APPROVAL";
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
        SUSPENDED: "SUSPENDED";
        ARCHIVED: "ARCHIVED";
    }>>;
    rejectionReason: z.ZodOptional<z.ZodString>;
    moderationNotes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const freelancingServiceIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
declare const freelancerIdSchema: z.ZodObject<{
    freelancerId: z.ZodString;
}, z.core.$strip>;
declare const getFreelancingServicesQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    search: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    subCategoryId: z.ZodOptional<z.ZodString>;
    freelancerId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        DRAFT: "DRAFT";
        PENDING_APPROVAL: "PENDING_APPROVAL";
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
        SUSPENDED: "SUSPENDED";
        ARCHIVED: "ARCHIVED";
    }>>;
    minPrice: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number | undefined, string | undefined>>;
    maxPrice: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number | undefined, string | undefined>>;
    sortBy: z.ZodOptional<z.ZodEnum<{
        createdAt: "createdAt";
        deliveryTime: "deliveryTime";
        rating: "rating";
        price: "price";
    }>>;
    sortOrder: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
declare const getFreelancingServicesByFreelancerQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    status: z.ZodOptional<z.ZodEnum<{
        DRAFT: "DRAFT";
        PENDING_APPROVAL: "PENDING_APPROVAL";
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
        SUSPENDED: "SUSPENDED";
        ARCHIVED: "ARCHIVED";
    }>>;
}, z.core.$strip>;
export { createFreelancingServiceSchema, updateFreelancingServiceSchema, freelancingServiceIdSchema, freelancerIdSchema, getFreelancingServicesQuerySchema, getFreelancingServicesByFreelancerQuerySchema, };
//# sourceMappingURL=freelancingService.schemas.d.ts.map
import { z } from "zod";
declare const freelancerIdParamSchema: z.ZodObject<{
    freelancerId: z.ZodString;
}, z.core.$strip>;
declare const portfolioItemParamsSchema: z.ZodObject<{
    freelancerId: z.ZodString;
    portfolioItemId: z.ZodString;
}, z.core.$strip>;
declare const employmentParamsSchema: z.ZodObject<{
    freelancerId: z.ZodString;
    employmentId: z.ZodString;
}, z.core.$strip>;
declare const educationParamsSchema: z.ZodObject<{
    freelancerId: z.ZodString;
    educationId: z.ZodString;
}, z.core.$strip>;
declare const certificationParamsSchema: z.ZodObject<{
    freelancerId: z.ZodString;
    certificationId: z.ZodString;
}, z.core.$strip>;
declare const freelancerProfileSchema: z.ZodObject<{
    title: z.ZodString;
    overview: z.ZodString;
    experienceLevel: z.ZodEnum<{
        EXPERT: "EXPERT";
        BEGINNER: "BEGINNER";
        INTERMEDIATE: "INTERMEDIATE";
    }>;
}, z.core.$strip>;
declare const portfolioItemSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    mediaUrls: z.ZodArray<z.ZodString>;
    projectUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    serviceCategoryId: z.ZodString;
    serviceSubCategoryId: z.ZodString;
}, z.core.$strip>;
declare const updatePortfolioItemSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    mediaUrls: z.ZodOptional<z.ZodArray<z.ZodString>>;
    projectUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    serviceCategoryId: z.ZodOptional<z.ZodString>;
    serviceSubCategoryId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const employmentSchema: z.ZodObject<{
    company: z.ZodString;
    role: z.ZodString;
    startDate: z.ZodString;
    endDate: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    description: z.ZodOptional<z.ZodString>;
    serviceCategoryId: z.ZodString;
    serviceSubCategoryId: z.ZodString;
}, z.core.$strip>;
declare const updateEmploymentSchema: z.ZodObject<{
    company: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    description: z.ZodOptional<z.ZodString>;
    serviceCategoryId: z.ZodOptional<z.ZodString>;
    serviceSubCategoryId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const educationSchema: z.ZodObject<{
    school: z.ZodString;
    degree: z.ZodOptional<z.ZodString>;
    field: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    serviceCategoryId: z.ZodString;
    serviceSubCategoryId: z.ZodString;
}, z.core.$strip>;
declare const updateEducationSchema: z.ZodObject<{
    school: z.ZodOptional<z.ZodString>;
    degree: z.ZodOptional<z.ZodString>;
    field: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    serviceCategoryId: z.ZodOptional<z.ZodString>;
    serviceSubCategoryId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const certificationSchema: z.ZodObject<{
    name: z.ZodString;
    issuer: z.ZodOptional<z.ZodString>;
    issuedAt: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodOptional<z.ZodString>;
    credentialId: z.ZodOptional<z.ZodString>;
    credentialUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    serviceCategoryId: z.ZodString;
    serviceSubCategoryId: z.ZodString;
}, z.core.$strip>;
declare const updateCertificationSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    issuer: z.ZodOptional<z.ZodString>;
    issuedAt: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodOptional<z.ZodString>;
    credentialId: z.ZodOptional<z.ZodString>;
    credentialUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    serviceCategoryId: z.ZodOptional<z.ZodString>;
    serviceSubCategoryId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export { freelancerIdParamSchema, portfolioItemParamsSchema, employmentParamsSchema, educationParamsSchema, certificationParamsSchema, freelancerProfileSchema, portfolioItemSchema, updatePortfolioItemSchema, employmentSchema, updateEmploymentSchema, educationSchema, updateEducationSchema, certificationSchema, updateCertificationSchema, };
//# sourceMappingURL=freelancer.schemas.d.ts.map
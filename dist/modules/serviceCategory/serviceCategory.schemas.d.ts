import { z } from "zod";
declare const serviceCategoryIdSchema: z.ZodObject<{
    id: z.ZodEnum<{
        PROGRAMMING_AND_TECH: "PROGRAMMING_AND_TECH";
        DESIGN_AND_CREATIVE: "DESIGN_AND_CREATIVE";
        DIGITAL_MARKETING: "DIGITAL_MARKETING";
        WRITING_AND_TRANSLATION: "WRITING_AND_TRANSLATION";
        VIDEO_AND_ANIMATION: "VIDEO_AND_ANIMATION";
        MUSIC_AND_AUDIO: "MUSIC_AND_AUDIO";
        BUSINESS_SUPPORT: "BUSINESS_SUPPORT";
        DATA_AND_AI: "DATA_AND_AI";
        LEGAL_AND_FINANCE: "LEGAL_AND_FINANCE";
        EDUCATION_AND_TRAINING: "EDUCATION_AND_TRAINING";
    }>;
}, z.core.$strip>;
declare const serviceCategorySlugSchema: z.ZodObject<{
    slug: z.ZodString;
}, z.core.$strip>;
declare const getServiceCategoriesQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export { serviceCategoryIdSchema, serviceCategorySlugSchema, getServiceCategoriesQuerySchema, };
//# sourceMappingURL=serviceCategory.schemas.d.ts.map
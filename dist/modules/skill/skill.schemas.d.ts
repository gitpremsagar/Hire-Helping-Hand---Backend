import { z } from "zod";
declare const createSkillSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    serviceCategoryId: z.ZodString;
    serviceSubCategoryId: z.ZodString;
}, z.core.$strip>;
declare const updateSkillSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    serviceCategoryId: z.ZodOptional<z.ZodString>;
    serviceSubCategoryId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const skillIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
declare const getSkillsQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    search: z.ZodOptional<z.ZodString>;
    serviceCategoryId: z.ZodOptional<z.ZodString>;
    serviceSubCategoryId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export { createSkillSchema, updateSkillSchema, skillIdSchema, getSkillsQuerySchema, };
//# sourceMappingURL=skill.schemas.d.ts.map
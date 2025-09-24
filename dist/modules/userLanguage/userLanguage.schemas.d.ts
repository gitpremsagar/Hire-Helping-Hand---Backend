import { z } from "zod";
declare const createUserLanguageSchema: z.ZodObject<{
    language: z.ZodString;
}, z.core.$strip>;
declare const updateUserLanguageSchema: z.ZodObject<{
    language: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const userLanguageIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
declare const getUserLanguagesQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export { createUserLanguageSchema, updateUserLanguageSchema, userLanguageIdSchema, getUserLanguagesQuerySchema, };
//# sourceMappingURL=userLanguage.schemas.d.ts.map
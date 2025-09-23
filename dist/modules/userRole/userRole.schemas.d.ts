import { z } from "zod";
declare const createUserRoleSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
}, z.core.$strip>;
declare const updateUserRoleSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const userRoleIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
declare const getUserRolesQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export { createUserRoleSchema, updateUserRoleSchema, userRoleIdSchema, getUserRolesQuerySchema, };
//# sourceMappingURL=userRole.schemas.d.ts.map
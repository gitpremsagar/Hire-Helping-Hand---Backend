import { z } from "zod";
declare const signUpSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    isFreelancer: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    isClient: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
declare const loginSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
declare const forgotPasswordSchema: z.ZodObject<{
    email: z.ZodEmail;
}, z.core.$strip>;
declare const resetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
declare const verifyEmailSchema: z.ZodObject<{
    token: z.ZodString;
}, z.core.$strip>;
declare const verifyPhoneSchema: z.ZodObject<{
    phone: z.ZodString;
    code: z.ZodString;
}, z.core.$strip>;
export { signUpSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema, verifyPhoneSchema, };
//# sourceMappingURL=auth.schemas.d.ts.map
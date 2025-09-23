import { z } from "zod";
// Validation schemas
const signUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    isFreelancer: z.boolean().optional().default(false),
    isClient: z.boolean().optional().default(false),
});
const loginSchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});
const forgotPasswordSchema = z.object({
    email: z.email("Invalid email format"),
});
const resetPasswordSchema = z.object({
    token: z.string().min(1, "Reset token is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
const verifyEmailSchema = z.object({
    token: z.string().min(1, "Verification token is required"),
});
const verifyPhoneSchema = z.object({
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    code: z.string().min(4, "Verification code must be at least 4 digits"),
});
const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
});
export { signUpSchema, loginSchema, refreshTokenSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema, verifyPhoneSchema, };
//# sourceMappingURL=auth.schemas.js.map
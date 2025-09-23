import express from "express";
import { signUp, login, logout, refreshToken, forgotPassword, resetPassword, verifyEmail, verifyPhone } from "./auth.controllers.js";
import { validateSignUpJson, validateLoginJson, validateRefreshTokenJson, validateForgotPasswordJson, validateResetPasswordJson, validateVerifyEmailJson, validateVerifyPhoneJson } from "./auth.validation.middlewares.js";
const authRoutes = express.Router();
authRoutes.post("/sign-up", validateSignUpJson, signUp);
authRoutes.post("/log-in", validateLoginJson, login);
authRoutes.post("/log-out", logout);
authRoutes.post("/refresh-token", validateRefreshTokenJson, refreshToken);
authRoutes.post("/forgot-password", validateForgotPasswordJson, forgotPassword);
authRoutes.post("/reset-password", validateResetPasswordJson, resetPassword);
authRoutes.post("/verify-email", validateVerifyEmailJson, verifyEmail);
authRoutes.post("/verify-phone", validateVerifyPhoneJson, verifyPhone);
export default authRoutes;
//# sourceMappingURL=auth.routes.js.map
import express from "express";
import { signUp, login, logout, refreshToken, forgotPassword, resetPassword, verifyEmail, verifyPhone, setUserRole } from "./auth.controllers.js";
import { validateSignUpJson, validateLoginJson, validateForgotPasswordJson, validateResetPasswordJson, validateVerifyEmailJson, validateVerifyPhoneJson, validateSetUserRoleJson } from "./auth.validation.middlewares.js";

const authRoutes = express.Router();
authRoutes.post("/sign-up", validateSignUpJson, signUp);
authRoutes.post("/log-in", validateLoginJson, login);
authRoutes.post("/log-out", logout);
authRoutes.post("/refresh-token", refreshToken);
authRoutes.post("/forgot-password", validateForgotPasswordJson, forgotPassword);
authRoutes.post("/reset-password", validateResetPasswordJson, resetPassword);
authRoutes.post("/verify-email", validateVerifyEmailJson, verifyEmail);
authRoutes.post("/verify-phone", validateVerifyPhoneJson, verifyPhone);
authRoutes.post("/set-user-role", validateSetUserRoleJson, setUserRole);

export default authRoutes;
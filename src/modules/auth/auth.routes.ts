import express from "express";
import { signUp, login, logout, refreshToken, forgotPassword, resetPassword, verifyEmail, verifyPhone, addRoleToUser, removeRoleFromUser } from "./auth.controllers.js";
import { validateSignUpJson, validateLoginJson, validateForgotPasswordJson, validateResetPasswordJson, validateVerifyEmailJson, validateVerifyPhoneJson, validateAddRoleToUserJson, validateRemoveRoleFromUserJson } from "./auth.validation.middlewares.js";

const authRoutes = express.Router();
authRoutes.post("/sign-up", validateSignUpJson, signUp);
authRoutes.post("/log-in", validateLoginJson, login);
authRoutes.post("/log-out", logout);
authRoutes.post("/refresh-token", refreshToken);
authRoutes.post("/forgot-password", validateForgotPasswordJson, forgotPassword);
authRoutes.post("/reset-password", validateResetPasswordJson, resetPassword);
authRoutes.post("/verify-email", validateVerifyEmailJson, verifyEmail);
authRoutes.post("/verify-phone", validateVerifyPhoneJson, verifyPhone);
authRoutes.post("/user-role", validateAddRoleToUserJson, addRoleToUser);
authRoutes.delete("/user-role", validateRemoveRoleFromUserJson, removeRoleFromUser);

export default authRoutes;
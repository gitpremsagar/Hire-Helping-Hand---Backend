import express from "express";
import { register, login, logout, forgotPassword, resetPassword, verifyEmail, verifyPhone } from "./auth.controllers.js";
import { validateRegisterJson, validateLoginJson, validateForgotPasswordJson, validateResetPasswordJson, validateVerifyEmailJson, validateVerifyPhoneJson } from "./auth.validation.middlewares.js";

const authRoutes = express.Router();
authRoutes.post("/register", validateRegisterJson, register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password", resetPassword);
authRoutes.post("/verify-email", verifyEmail);
authRoutes.post("/verify-phone", verifyPhone);

export default authRoutes;
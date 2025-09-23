import express from "express";
import { signUp, login, logout, forgotPassword, resetPassword, verifyEmail, verifyPhone } from "./auth.controllers.js";
import { validateSignUpJson, validateLoginJson, validateForgotPasswordJson, validateResetPasswordJson, validateVerifyEmailJson, validateVerifyPhoneJson } from "./auth.validation.middlewares.js";

const authRoutes = express.Router();
authRoutes.post("/sign-up", validateSignUpJson, signUp);
authRoutes.post("/log-in", login);
authRoutes.post("/log-out", logout);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password", resetPassword);
authRoutes.post("/verify-email", verifyEmail);
authRoutes.post("/verify-phone", verifyPhone);

export default authRoutes;
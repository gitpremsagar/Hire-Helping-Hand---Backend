import express from "express";
import { createUserRole, getUserRoles, getUserRoleById, updateUserRole, deleteUserRole } from "./userRole.controllers.js";
import { validateCreateUserRoleJson, validateUpdateUserRoleJson, validateUserRoleId, validateGetUserRolesQuery } from "./userRole.validation.middlewares.js";
import { authenticate, requireAdmin } from "../../middleware/auth.middlewares.js";
const userRoleRoutes = express.Router();
// Create a new user role
userRoleRoutes.post("/", authenticate, requireAdmin, validateCreateUserRoleJson, createUserRole);
// Get all user roles with pagination and search
userRoleRoutes.get("/", validateGetUserRolesQuery, getUserRoles);
// Get a single user role by ID
userRoleRoutes.get("/:id", validateUserRoleId, getUserRoleById);
// Update a user role
userRoleRoutes.put("/:id", authenticate, requireAdmin, validateUserRoleId, validateUpdateUserRoleJson, updateUserRole);
// Delete a user role
userRoleRoutes.delete("/:id", authenticate, requireAdmin, validateUserRoleId, deleteUserRole);
export default userRoleRoutes;
//# sourceMappingURL=userRole.routes.js.map
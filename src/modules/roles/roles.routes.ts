import express from "express";
import { listAppRoles } from "./roles.controllers.js";

const rolesRoutes = express.Router();
rolesRoutes.get("/", listAppRoles);

export default rolesRoutes;

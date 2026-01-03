import express from "express";
import { createFreelancingService, getFreelancingServices, getFreelancingServiceById, updateFreelancingService, deleteFreelancingService, getFreelancingServicesByFreelancer } from "./freelancingService.controllers.js";
import { validateCreateFreelancingServiceJson, validateUpdateFreelancingServiceJson, validateFreelancingServiceId, validateGetFreelancingServicesQuery, validateFreelancerId, validateGetFreelancingServicesByFreelancerQuery } from "./freelancingService.validation.middlewares.js";
import { authenticate, requireAdmin } from "../../middleware/auth.middlewares.js";
const freelancingServiceRoutes = express.Router();
// Create a new freelancing service
freelancingServiceRoutes.post("/", authenticate, validateCreateFreelancingServiceJson, createFreelancingService);
// Get all freelancing services with pagination and search
freelancingServiceRoutes.get("/", validateGetFreelancingServicesQuery, getFreelancingServices);
// Get a single freelancing service by ID
freelancingServiceRoutes.get("/:id", validateFreelancingServiceId, getFreelancingServiceById);
// Update a freelancing service
freelancingServiceRoutes.put("/:id", authenticate, validateFreelancingServiceId, validateUpdateFreelancingServiceJson, updateFreelancingService);
// Delete a freelancing service
freelancingServiceRoutes.delete("/:id", authenticate, validateFreelancingServiceId, deleteFreelancingService);
// Get freelancing services by freelancer
freelancingServiceRoutes.get("/freelancer/:freelancerId", validateFreelancerId, validateGetFreelancingServicesByFreelancerQuery, getFreelancingServicesByFreelancer);
export default freelancingServiceRoutes;
//# sourceMappingURL=freelancingService.routes.js.map
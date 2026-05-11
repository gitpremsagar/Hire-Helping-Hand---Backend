import express from "express";
import { 
  createFreelancingService, 
  getFreelancingServices, 
  getFreelancingServiceById, 
  updateFreelancingService, 
  publishFreelancingService,
  deleteFreelancingService,
  getFreelancingServicesByFreelancer
} from "./freelancingService.controllers.js";
import { 
  validateCreateFreelancingServiceJson, 
  validateUpdateFreelancingServiceJson, 
  validateFreelancingServiceId,
  validateGetFreelancingServicesQuery,
  validateFreelancerId,
  validateGetFreelancingServicesByFreelancerQuery
} from "./freelancingService.validation.middlewares.js";
import { authenticate } from "../../middleware/auth.middlewares.js";

const freelancingServiceRoutes = express.Router();

// Create a new freelancing service
freelancingServiceRoutes.post("/", authenticate, validateCreateFreelancingServiceJson, createFreelancingService);

// Get all freelancing services with pagination and search
freelancingServiceRoutes.get("/", validateGetFreelancingServicesQuery, getFreelancingServices);

// Get freelancing services by freelancer (before /:id so "freelancer" is not captured as an id)
freelancingServiceRoutes.get("/freelancer/:freelancerId", validateFreelancerId, validateGetFreelancingServicesByFreelancerQuery, getFreelancingServicesByFreelancer);

// Get a single freelancing service by ID
freelancingServiceRoutes.get("/:id", validateFreelancingServiceId, getFreelancingServiceById);

// Update a freelancing service
freelancingServiceRoutes.put("/:id", authenticate, validateFreelancingServiceId, validateUpdateFreelancingServiceJson, updateFreelancingService);

// Publish (submit for approval)
freelancingServiceRoutes.patch("/:id/publish", authenticate, validateFreelancingServiceId, publishFreelancingService);

// Delete a freelancing service
freelancingServiceRoutes.delete("/:id", authenticate, validateFreelancingServiceId, deleteFreelancingService);

export default freelancingServiceRoutes;

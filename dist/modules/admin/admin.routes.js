import express from "express";
import { authenticate, requireAdmin } from "../../middleware/auth.middlewares.js";
import { validateFreelancingServiceId } from "../freelancingService/freelancingService.validation.middlewares.js";
import { adminApproveFreelancingService, adminRejectFreelancingService, } from "./admin.freelancingService.controllers.js";
import { validateRejectFreelancingServiceJson } from "./admin.validation.middlewares.js";
const adminRoutes = express.Router();
const adminFreelancingServices = express.Router();
adminFreelancingServices.patch("/:id/approve", authenticate, requireAdmin, validateFreelancingServiceId, adminApproveFreelancingService);
adminFreelancingServices.patch("/:id/reject", authenticate, requireAdmin, validateFreelancingServiceId, validateRejectFreelancingServiceJson, adminRejectFreelancingService);
adminRoutes.use("/freelancing-services", adminFreelancingServices);
export default adminRoutes;
//# sourceMappingURL=admin.routes.js.map
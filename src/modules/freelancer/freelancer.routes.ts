import express from "express";
import {
  getFreelancers,
  getFreelancer,
  createFreelancer,
  updateFreelancer,
  deleteFreelancer,
  getFreelancerProfile,
  createOrUpdateFreelancerProfile,
  getFreelancerPortfolio,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  getFreelancerEmployment,
  addEmployment,
  updateEmployment,
  deleteEmployment,
  getFreelancerEducation,
  addEducation,
  updateEducation,
  deleteEducation,
  getFreelancerCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
} from "./freelancer.controllers.js";
import {
  // Parameter validation middlewares
  validateFreelancerIdParams,
  validatePortfolioItemParams,
  validateEmploymentParams,
  validateEducationParams,
  validateCertificationParams,

  // Freelancer profile validation middlewares
  validateFreelancerProfileJson,
  validatePortfolioItemJson,
  validateUpdatePortfolioItemJson,
  validateEmploymentJson,
  validateUpdateEmploymentJson,
  validateEducationJson,
  validateUpdateEducationJson,
  validateCertificationJson,
  validateUpdateCertificationJson,
} from "./freelancer.validation.middlewares.js";

const freelancerRoutes = express.Router();

// Freelancer routes
freelancerRoutes.get("/", getFreelancers);
freelancerRoutes.get("/:freelancerId", validateFreelancerIdParams, getFreelancer);
freelancerRoutes.post("/", createFreelancer);
freelancerRoutes.put("/:freelancerId", validateFreelancerIdParams, updateFreelancer);
freelancerRoutes.delete("/:freelancerId", validateFreelancerIdParams, deleteFreelancer);


// Freelancer profile routes
freelancerRoutes.get("/:freelancerId/profile", validateFreelancerIdParams, getFreelancerProfile);
freelancerRoutes.post("/:freelancerId/profile", validateFreelancerIdParams, validateFreelancerProfileJson, createOrUpdateFreelancerProfile);
freelancerRoutes.put("/:freelancerId/profile", validateFreelancerIdParams, validateFreelancerProfileJson, createOrUpdateFreelancerProfile);

// Portfolio routes
freelancerRoutes.get("/:freelancerId/portfolio", validateFreelancerIdParams, getFreelancerPortfolio);
freelancerRoutes.post("/:freelancerId/portfolio", validateFreelancerIdParams, validatePortfolioItemJson, addPortfolioItem);
freelancerRoutes.put("/:freelancerId/portfolio/:portfolioItemId", validatePortfolioItemParams, validateUpdatePortfolioItemJson, updatePortfolioItem);
freelancerRoutes.delete("/:freelancerId/portfolio/:portfolioItemId", validatePortfolioItemParams, deletePortfolioItem);

// Employment routes
freelancerRoutes.get("/:freelancerId/employment", validateFreelancerIdParams, getFreelancerEmployment);
freelancerRoutes.post("/:freelancerId/employment", validateFreelancerIdParams, validateEmploymentJson, addEmployment);
freelancerRoutes.put("/:freelancerId/employment/:employmentId", validateEmploymentParams, validateUpdateEmploymentJson, updateEmployment);
freelancerRoutes.delete("/:freelancerId/employment/:employmentId", validateEmploymentParams, deleteEmployment);

// Education routes
freelancerRoutes.get("/:freelancerId/education", validateFreelancerIdParams, getFreelancerEducation);
freelancerRoutes.post("/:freelancerId/education", validateFreelancerIdParams, validateEducationJson, addEducation);
freelancerRoutes.put("/:freelancerId/education/:educationId", validateEducationParams, validateUpdateEducationJson, updateEducation);
freelancerRoutes.delete("/:freelancerId/education/:educationId", validateEducationParams, deleteEducation);

// Certification routes
freelancerRoutes.get("/:freelancerId/certifications", validateFreelancerIdParams, getFreelancerCertifications);
freelancerRoutes.post("/:freelancerId/certifications", validateFreelancerIdParams, validateCertificationJson, addCertification);
freelancerRoutes.put("/:freelancerId/certifications/:certificationId", validateCertificationParams, validateUpdateCertificationJson, updateCertification);
freelancerRoutes.delete("/:freelancerId/certifications/:certificationId", validateCertificationParams, deleteCertification);

export default freelancerRoutes;

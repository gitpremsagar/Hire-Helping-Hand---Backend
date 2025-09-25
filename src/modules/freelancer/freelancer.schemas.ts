import { z } from "zod";

// Parameter validation schemas
const freelancerIdParamSchema = z.object({
  freelancerId: z.string().min(1, "Freelancer ID is required"),
});

const portfolioItemParamsSchema = z.object({
  freelancerId: z.string().min(1, "Freelancer ID is required"),
  portfolioItemId: z.string().min(1, "Portfolio Item ID is required"),
});

const employmentParamsSchema = z.object({
  freelancerId: z.string().min(1, "Freelancer ID is required"),
  employmentId: z.string().min(1, "Employment ID is required"),
});

const educationParamsSchema = z.object({
  freelancerId: z.string().min(1, "Freelancer ID is required"),
  educationId: z.string().min(1, "Education ID is required"),
});

const certificationParamsSchema = z.object({
  freelancerId: z.string().min(1, "Freelancer ID is required"),
  certificationId: z.string().min(1, "Certification ID is required"),
});

// Freelancer profile schemas
const freelancerProfileSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  overview: z.string().min(10, "Overview must be at least 10 characters").max(2000, "Overview must be less than 2000 characters"),
  experienceLevel: z.enum(["BEGINNER", "INTERMEDIATE", "EXPERT"], {
    message: "Experience level must be BEGINNER, INTERMEDIATE, or EXPERT"
  }),
});

// Portfolio item schemas
const portfolioItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description must be less than 2000 characters"),
  mediaUrls: z.array(z.string().url("Invalid media URL")).min(1, "At least one media URL is required").max(10, "Maximum 10 media URLs allowed"),
  projectUrl: z.string().url("Invalid project URL").optional().or(z.literal("")),
  serviceCategoryId: z.string().min(1, "Service category ID is required"),
  serviceSubCategoryId: z.string().min(1, "Service sub-category ID is required"),
});

const updatePortfolioItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description must be less than 2000 characters").optional(),
  mediaUrls: z.array(z.string().url("Invalid media URL")).min(1, "At least one media URL is required").max(10, "Maximum 10 media URLs allowed").optional(),
  projectUrl: z.string().url("Invalid project URL").optional().or(z.literal("")),
  serviceCategoryId: z.string().min(1, "Service category ID is required").optional(),
  serviceSubCategoryId: z.string().min(1, "Service sub-category ID is required").optional(),
});

// Employment schemas
const employmentSchema = z.object({
  company: z.string().min(1, "Company name is required").max(100, "Company name must be less than 100 characters"),
  role: z.string().min(1, "Role is required").max(100, "Role must be less than 100 characters"),
  startDate: z.string().datetime("Invalid start date format"),
  endDate: z.string().datetime("Invalid end date format").optional().or(z.literal("")),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  serviceCategoryId: z.string().min(1, "Service category ID is required"),
  serviceSubCategoryId: z.string().min(1, "Service sub-category ID is required"),
});

const updateEmploymentSchema = z.object({
  company: z.string().min(1, "Company name is required").max(100, "Company name must be less than 100 characters").optional(),
  role: z.string().min(1, "Role is required").max(100, "Role must be less than 100 characters").optional(),
  startDate: z.string().datetime("Invalid start date format").optional(),
  endDate: z.string().datetime("Invalid end date format").optional().or(z.literal("")),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  serviceCategoryId: z.string().min(1, "Service category ID is required").optional(),
  serviceSubCategoryId: z.string().min(1, "Service sub-category ID is required").optional(),
});

// Education schemas
const educationSchema = z.object({
  school: z.string().min(1, "School name is required").max(100, "School name must be less than 100 characters"),
  degree: z.string().max(100, "Degree must be less than 100 characters").optional(),
  field: z.string().max(100, "Field must be less than 100 characters").optional(),
  startDate: z.string().datetime("Invalid start date format").optional(),
  endDate: z.string().datetime("Invalid end date format").optional(),
  serviceCategoryId: z.string().min(1, "Service category ID is required"),
  serviceSubCategoryId: z.string().min(1, "Service sub-category ID is required"),
});

const updateEducationSchema = z.object({
  school: z.string().min(1, "School name is required").max(100, "School name must be less than 100 characters").optional(),
  degree: z.string().max(100, "Degree must be less than 100 characters").optional(),
  field: z.string().max(100, "Field must be less than 100 characters").optional(),
  startDate: z.string().datetime("Invalid start date format").optional(),
  endDate: z.string().datetime("Invalid end date format").optional(),
  serviceCategoryId: z.string().min(1, "Service category ID is required").optional(),
  serviceSubCategoryId: z.string().min(1, "Service sub-category ID is required").optional(),
});

// Certification schemas
const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required").max(100, "Certification name must be less than 100 characters"),
  issuer: z.string().max(100, "Issuer must be less than 100 characters").optional(),
  issuedAt: z.string().datetime("Invalid issued date format").optional(),
  expiresAt: z.string().datetime("Invalid expiry date format").optional(),
  credentialId: z.string().max(100, "Credential ID must be less than 100 characters").optional(),
  credentialUrl: z.string().url("Invalid credential URL").optional().or(z.literal("")),
  serviceCategoryId: z.string().min(1, "Service category ID is required"),
  serviceSubCategoryId: z.string().min(1, "Service sub-category ID is required"),
});

const updateCertificationSchema = z.object({
  name: z.string().min(1, "Certification name is required").max(100, "Certification name must be less than 100 characters").optional(),
  issuer: z.string().max(100, "Issuer must be less than 100 characters").optional(),
  issuedAt: z.string().datetime("Invalid issued date format").optional(),
  expiresAt: z.string().datetime("Invalid expiry date format").optional(),
  credentialId: z.string().max(100, "Credential ID must be less than 100 characters").optional(),
  credentialUrl: z.string().url("Invalid credential URL").optional().or(z.literal("")),
  serviceCategoryId: z.string().min(1, "Service category ID is required").optional(),
  serviceSubCategoryId: z.string().min(1, "Service sub-category ID is required").optional(),
});

export {
  freelancerIdParamSchema,
  portfolioItemParamsSchema,
  employmentParamsSchema,
  educationParamsSchema,
  certificationParamsSchema,
  freelancerProfileSchema,
  portfolioItemSchema,
  updatePortfolioItemSchema,
  employmentSchema,
  updateEmploymentSchema,
  educationSchema,
  updateEducationSchema,
  certificationSchema,
  updateCertificationSchema,
};

import { z } from "zod";
import { ServiceCategory, ServiceSubCategory } from "@prisma/client";
import {
  serviceCategoryIdField,
  serviceSubCategoryIdField,
  refineCategoryPair,
} from "../../constants/taxonomy-zod.js";
import {
  canonicalYoutubeEmbedUrl,
  parseYoutubeVideoIdFromInput,
} from "../../utils/youtubeVideoIntroduction.js";

/** Create: omit, empty string, or valid YouTube URL / iframe → canonical embed URL or undefined. */
const videoIntroductionCreateField = z.preprocess(
  (val) => {
    if (val === null || val === undefined) return undefined;
    if (typeof val !== "string") return val;
    const t = val.trim();
    return t === "" ? undefined : t;
  },
  z
    .union([z.undefined(), z.string().max(20000)])
    .superRefine((val, ctx) => {
      if (val === undefined) return;
      if (!parseYoutubeVideoIdFromInput(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "videoIntroduction must be a valid YouTube URL or iframe embed code",
          path: [],
        });
      }
    })
    .transform((val) => {
      if (val === undefined) return undefined;
      const id = parseYoutubeVideoIdFromInput(val)!;
      return canonicalYoutubeEmbedUrl(id);
    })
);

/** Update: omit; null or "" clears; otherwise normalize to embed URL. */
const videoIntroductionUpdateField = z.preprocess(
  (val) => {
    if (val === undefined) return undefined;
    if (val === null) return null;
    if (typeof val !== "string") return val;
    const t = val.trim();
    return t === "" ? null : t;
  },
  z
    .union([z.undefined(), z.null(), z.string().max(20000)])
    .superRefine((val, ctx) => {
      if (val === undefined || val === null) return;
      if (!parseYoutubeVideoIdFromInput(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "videoIntroduction must be a valid YouTube URL or iframe embed code",
          path: [],
        });
      }
    })
    .transform((val) => {
      if (val === undefined) return undefined;
      if (val === null) return null;
      const id = parseYoutubeVideoIdFromInput(val)!;
      return canonicalYoutubeEmbedUrl(id);
    })
);

// Validation schemas for FreelancingService
const createFreelancingServiceSchema = refineCategoryPair(
  z.object({
  freelancerId: z.string().min(1, "Freelancer ID is required"),
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().min(1, "Description is required").max(5000, "Description must be less than 5000 characters"),
  serviceCategoryId: serviceCategoryIdField,
  serviceSubCategoryId: serviceSubCategoryIdField,
  basePrice: z.number().min(0, "Base price must be non-negative").optional(),
  currency: z.string().min(3, "Currency must be at least 3 characters").max(3, "Currency must be 3 characters").optional().default("USD"),
  isCustomPricing: z.boolean().optional().default(false),
  deliveryTime: z.number().min(1, "Delivery time must be at least 1 day"),
  revisionPolicy: z.number().min(0, "Revision policy must be non-negative").optional().default(0),
  rushDeliveryAvailable: z.boolean().optional().default(false),
  rushDeliveryFee: z.number().min(0, "Rush delivery fee must be non-negative").optional(),
  deliveryGuarantee: z.string().max(500, "Delivery guarantee must be less than 500 characters").optional(),
  requirements: z.string().max(2000, "Requirements must be less than 2000 characters").optional(),
  faq: z.any().optional(), // JSON field
  communicationLanguage: z.array(z.string()).optional().default([]),
  timezone: z.string().optional(),
  availability: z.any().optional(), // JSON field
  gallery: z.array(z.string()).optional().default([]),
  videoIntroduction: videoIntroductionCreateField,
  portfolioItems: z.array(z.string()).optional().default([]),
  beforeAfterImages: z.array(z.string()).optional().default([]),
  features: z.array(z.string()).optional().default([]),
  addOns: z.any().optional(), // JSON field
  extras: z.any().optional(), // JSON field
  tags: z.array(z.string()).optional().default([]),
  keywords: z.array(z.string()).optional().default([]),
  metaDescription: z.string().max(500, "Meta description must be less than 500 characters").optional(),
  isCustomizable: z.boolean().optional().default(false),
  customFields: z.any().optional(), // JSON field
  templateOptions: z.any().optional(), // JSON field
})
);

const updateFreelancingServiceSchema = refineCategoryPair(
  z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters").optional(),
  description: z.string().min(1, "Description is required").max(5000, "Description must be less than 5000 characters").optional(),
  serviceCategoryId: serviceCategoryIdField.optional(),
  serviceSubCategoryId: serviceSubCategoryIdField.optional(),
  basePrice: z.number().min(0, "Base price must be non-negative").optional(),
  currency: z.string().min(3, "Currency must be at least 3 characters").max(3, "Currency must be 3 characters").optional(),
  isCustomPricing: z.boolean().optional(),
  deliveryTime: z.number().min(1, "Delivery time must be at least 1 day").optional(),
  revisionPolicy: z.number().min(0, "Revision policy must be non-negative").optional(),
  rushDeliveryAvailable: z.boolean().optional(),
  rushDeliveryFee: z.number().min(0, "Rush delivery fee must be non-negative").optional(),
  deliveryGuarantee: z.string().max(500, "Delivery guarantee must be less than 500 characters").optional(),
  requirements: z.string().max(2000, "Requirements must be less than 2000 characters").optional(),
  faq: z.any().optional(), // JSON field
  communicationLanguage: z.array(z.string()).optional(),
  timezone: z.string().optional(),
  availability: z.any().optional(), // JSON field
  gallery: z.array(z.string()).optional(),
  videoIntroduction: videoIntroductionUpdateField.optional(),
  portfolioItems: z.array(z.string()).optional(),
  beforeAfterImages: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  addOns: z.any().optional(), // JSON field
  extras: z.any().optional(), // JSON field
  tags: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  metaDescription: z.string().max(500, "Meta description must be less than 500 characters").optional(),
  isCustomizable: z.boolean().optional(),
  customFields: z.any().optional(), // JSON field
  templateOptions: z.any().optional(), // JSON field
  isActive: z.boolean().optional(),
  isTopRated: z.boolean().optional(),
  isProSeller: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  badges: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PENDING_APPROVAL", "APPROVED", "REJECTED", "SUSPENDED", "ARCHIVED"]).optional(),
  rejectionReason: z.string().optional(),
  moderationNotes: z.string().optional(),
})
);

const freelancingServiceIdSchema = z.object({
  id: z.string().min(1, "Freelancing service ID is required"),
});

const freelancerIdSchema = z.object({
  freelancerId: z.string().min(1, "Freelancer ID is required"),
});

const getFreelancingServicesQuerySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 20),
  search: z.string().optional(),
  categoryId: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.nativeEnum(ServiceCategory).optional()
  ),
  subCategoryId: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.nativeEnum(ServiceSubCategory).optional()
  ),
  freelancerId: z.string().optional(),
  status: z.enum(["DRAFT", "PENDING_APPROVAL", "APPROVED", "REJECTED", "SUSPENDED", "ARCHIVED"]).optional(),
  minPrice: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  maxPrice: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  sortBy: z.enum(["price", "rating", "deliveryTime", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

const getFreelancingServicesByFreelancerQuerySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 20),
  status: z.enum(["DRAFT", "PENDING_APPROVAL", "APPROVED", "REJECTED", "SUSPENDED", "ARCHIVED"]).optional(),
});

export {
  createFreelancingServiceSchema,
  updateFreelancingServiceSchema,
  freelancingServiceIdSchema,
  freelancerIdSchema,
  getFreelancingServicesQuerySchema,
  getFreelancingServicesByFreelancerQuerySchema,
};

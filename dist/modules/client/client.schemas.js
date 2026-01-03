import { z } from "zod";
// Validation schemas for client operations
// Update client profile schema
const updateClientProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    bio: z.string().max(1000, "Bio must be less than 1000 characters").optional(),
    website: z.string().url("Invalid website URL").optional().or(z.literal("")),
    phone: z.string().min(10, "Phone number must be at least 10 digits").optional().or(z.literal("")),
    address: z.string().max(500, "Address must be less than 500 characters").optional().or(z.literal("")),
    country: z.string().min(2, "Country must be at least 2 characters").optional().or(z.literal("")),
    state: z.string().min(2, "State must be at least 2 characters").optional().or(z.literal("")),
    city: z.string().min(2, "City must be at least 2 characters").optional().or(z.literal("")),
    zip: z.string().min(3, "ZIP code must be at least 3 characters").optional().or(z.literal("")),
    latitude: z.number().min(-90).max(90, "Latitude must be between -90 and 90").optional(),
    longitude: z.number().min(-180).max(180, "Longitude must be between -180 and 180").optional(),
});
// Get clients query parameters schema
const getClientsQuerySchema = z.object({
    page: z.string().regex(/^\d+$/, "Page must be a positive integer").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a positive integer").optional(),
    search: z.string().min(1, "Search term must not be empty").optional(),
    country: z.string().min(2, "Country must be at least 2 characters").optional(),
    state: z.string().min(2, "State must be at least 2 characters").optional(),
    city: z.string().min(2, "City must be at least 2 characters").optional(),
    isEmailVerified: z.enum(["true", "false"]).optional(),
    isPhoneVerified: z.enum(["true", "false"]).optional(),
    sortBy: z.enum(["name", "email", "createdAt", "updatedAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
});
// Get client contracts query parameters schema
const getClientContractsQuerySchema = z.object({
    page: z.string().regex(/^\d+$/, "Page must be a positive integer").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a positive integer").optional(),
    status: z.enum(["PENDING", "ACTIVE", "COMPLETED", "CANCELLED", "DISPUTED"]).optional(),
    sortBy: z.enum(["title", "status", "budget", "createdAt", "updatedAt", "startDate", "endDate"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
});
// Client ID parameter schema
const clientIdParamSchema = z.object({
    clientId: z.string().min(1, "Client ID is required"),
});
export { updateClientProfileSchema, getClientsQuerySchema, getClientContractsQuerySchema, clientIdParamSchema, };
//# sourceMappingURL=client.schemas.js.map
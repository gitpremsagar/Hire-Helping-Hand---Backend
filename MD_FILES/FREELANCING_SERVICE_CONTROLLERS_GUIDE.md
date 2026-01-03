# Freelancing Service Controllers Documentation

## Overview

The `freelancingService.controllers.ts` module provides a comprehensive set of controllers for managing freelancing services in the platform. These controllers handle CRUD operations, search and filtering, pagination, and service management features.

**Location:** `src/modules/freelancingService/freelancingService.controllers.ts`

---

## Table of Contents

1. [Controller Functions](#controller-functions)
2. [Request/Response Formats](#requestresponse-formats)
3. [Error Handling](#error-handling)
4. [Validation Requirements](#validation-requirements)
5. [Usage Examples](#usage-examples)
6. [Best Practices](#best-practices)
7. [Related Models](#related-models)

---

## Controller Functions

### 1. createFreelancingService

Creates a new freelancing service for a freelancer.

**Route:** `POST /freelancing-services`  
**Authentication:** Required  
**Validation:** `validateCreateFreelancingServiceJson`

**Request Body:**
```typescript
{
  freelancerId: string;                    // Required: ID of the freelancer
  title: string;                           // Required: Service title (max 200 chars)
  description: string;                      // Required: Service description (max 5000 chars)
  serviceCategoryId: string;                // Required: Service category ID
  serviceSubCategoryId: string;             // Required: Service subcategory ID
  basePrice?: number;                       // Optional: Base price (min 0)
  currency?: string;                       // Optional: Currency code (default: "USD")
  isCustomPricing?: boolean;               // Optional: Custom pricing flag (default: false)
  deliveryTime: number;                    // Required: Delivery time in days (min 1)
  revisionPolicy?: number;                 // Optional: Number of revisions (default: 0)
  rushDeliveryAvailable?: boolean;        // Optional: Rush delivery available (default: false)
  rushDeliveryFee?: number;                // Optional: Rush delivery fee (min 0)
  deliveryGuarantee?: string;              // Optional: Delivery guarantee (max 500 chars)
  requirements?: string;                  // Optional: Service requirements (max 2000 chars)
  faq?: any;                               // Optional: FAQ JSON object
  communicationLanguage?: string[];        // Optional: Communication languages array
  timezone?: string;                       // Optional: Timezone
  availability?: any;                      // Optional: Availability JSON object
  gallery?: string[];                      // Optional: Gallery image URLs array
  videoIntroduction?: string;              // Optional: Video introduction URL
  portfolioItems?: string[];               // Optional: Portfolio item IDs array
  beforeAfterImages?: string[];            // Optional: Before/after image URLs array
  features?: string[];                     // Optional: Features array
  addOns?: any;                           // Optional: Add-ons JSON object
  extras?: any;                           // Optional: Extras JSON object
  tags?: string[];                        // Optional: Tags array
  keywords?: string[];                     // Optional: SEO keywords array
  metaDescription?: string;                // Optional: Meta description (max 500 chars)
  isCustomizable?: boolean;               // Optional: Customizable flag (default: false)
  customFields?: any;                     // Optional: Custom fields JSON object
  templateOptions?: any;                  // Optional: Template options JSON object
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Freelancing service created successfully",
  "data": {
    "id": "service-id",
    "title": "Service Title",
    "description": "Service Description",
    "slug": "service-title",
    "basePrice": 100,
    "currency": "USD",
    "isCustomPricing": false,
    "deliveryTime": 7,
    "revisionPolicy": 2,
    "rushDeliveryAvailable": true,
    "rushDeliveryFee": 50,
    "deliveryGuarantee": "Money-back guarantee",
    "isActive": true,
    "status": "DRAFT",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "freelancer": {
      "id": "freelancer-id",
      "name": "John Doe",
      "avatar": "avatar-url"
    },
    "ServiceCategory": {
      "id": "category-id",
      "name": "Category Name"
    },
    "ServiceSubCategory": {
      "id": "subcategory-id",
      "name": "Subcategory Name"
    }
  }
}
```

**Business Logic:**
- Validates that the freelancer exists, is active, and is a freelancer
- Validates that service category and subcategory exist
- Generates a unique slug from the title (auto-increments if duplicate exists)
- Sets default values for optional fields

**Errors:**
- `404` - Freelancer not found
- `400` - Freelancer is not active or not a freelancer
- `404` - Service category not found
- `404` - Service subcategory not found

---

### 2. getFreelancingServices

Retrieves a paginated list of freelancing services with advanced filtering and search capabilities.

**Route:** `GET /freelancing-services`  
**Authentication:** Not required (public endpoint)  
**Validation:** `validateGetFreelancingServicesQuery`

**Query Parameters:**
```typescript
{
  page?: string;          // Optional: Page number (default: 1)
  limit?: string;         // Optional: Items per page (default: 20)
  search?: string;        // Optional: Search in title, description, or tags
  categoryId?: string;    // Optional: Filter by service category
  subCategoryId?: string; // Optional: Filter by service subcategory
  freelancerId?: string;  // Optional: Filter by freelancer
  status?: string;        // Optional: Filter by status (DRAFT, PENDING_APPROVAL, APPROVED, REJECTED, SUSPENDED, ARCHIVED)
  minPrice?: string;      // Optional: Minimum price filter
  maxPrice?: string;      // Optional: Maximum price filter
  sortBy?: string;        // Optional: Sort field (price, rating, deliveryTime, createdAt)
  sortOrder?: string;     // Optional: Sort order (asc, desc)
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Freelancing services retrieved successfully",
  "data": {
    "freelancingServices": [
      {
        "id": "service-id",
        "title": "Service Title",
        "description": "Service Description",
        "slug": "service-title",
        "basePrice": 100,
        "currency": "USD",
        "isCustomPricing": false,
        "deliveryTime": 7,
        "revisionPolicy": 2,
        "rushDeliveryAvailable": true,
        "rushDeliveryFee": 50,
        "deliveryGuarantee": "Money-back guarantee",
        "isActive": true,
        "isTopRated": false,
        "isProSeller": false,
        "isFeatured": false,
        "badges": [],
        "rating": 4.5,
        "ratingCount": 10,
        "completionRate": 95.5,
        "responseTime": "1 hour",
        "orderCount": 25,
        "status": "APPROVED",
        "views": 150,
        "favorites": 12,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "freelancer": {
          "id": "freelancer-id",
          "name": "John Doe",
          "avatar": "avatar-url",
          "country": "USA",
          "city": "New York"
        },
        "ServiceCategory": {
          "id": "category-id",
          "name": "Category Name"
        },
        "ServiceSubCategory": {
          "id": "subcategory-id",
          "name": "Subcategory Name"
        },
        "_count": {
          "reviews": 10,
          "contracts": 5
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "itemsPerPage": 20,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

**Search Functionality:**
- Searches in `title` (case-insensitive)
- Searches in `description` (case-insensitive)
- Searches in `tags` array (exact match)

**Sorting Options:**
- `price` - Sort by basePrice
- `rating` - Sort by rating
- `deliveryTime` - Sort by deliveryTime
- `createdAt` - Sort by creation date (default)

---

### 3. getFreelancingServiceById

Retrieves a single freelancing service by ID with full details.

**Route:** `GET /freelancing-services/:id`  
**Authentication:** Not required (public endpoint)  
**Validation:** `validateFreelancingServiceId`

**URL Parameters:**
```typescript
{
  id: string;  // Required: Freelancing service ID
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Freelancing service retrieved successfully",
  "data": {
    "id": "service-id",
    "title": "Service Title",
    "description": "Service Description",
    "slug": "service-title",
    "basePrice": 100,
    "currency": "USD",
    "isCustomPricing": false,
    "deliveryTime": 7,
    "revisionPolicy": 2,
    "rushDeliveryAvailable": true,
    "rushDeliveryFee": 50,
    "deliveryGuarantee": "Money-back guarantee",
    "isActive": true,
    "isTopRated": false,
    "isProSeller": false,
    "isFeatured": false,
    "badges": [],
    "rating": 4.5,
    "ratingCount": 10,
    "completionRate": 95.5,
    "responseTime": "1 hour",
    "orderCount": 25,
    "requirements": "Service requirements",
    "faq": {},
    "communicationLanguage": ["English", "Spanish"],
    "timezone": "UTC-5",
    "availability": {},
    "gallery": ["image1.jpg", "image2.jpg"],
    "videoIntroduction": "video-url",
    "portfolioItems": ["portfolio-id-1", "portfolio-id-2"],
    "beforeAfterImages": ["before.jpg", "after.jpg"],
    "features": ["Feature 1", "Feature 2"],
    "addOns": {},
    "extras": {},
    "tags": ["tag1", "tag2"],
    "keywords": ["keyword1", "keyword2"],
    "metaDescription": "SEO meta description",
    "status": "APPROVED",
    "views": 150,
    "favorites": 12,
    "conversionRate": 5.5,
    "lastOrderDate": "2024-01-15T00:00:00.000Z",
    "averageOrderValue": 120.50,
    "isCustomizable": false,
    "customFields": {},
    "templateOptions": {},
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "freelancer": {
      "id": "freelancer-id",
      "name": "John Doe",
      "avatar": "avatar-url",
      "bio": "Freelancer bio",
      "country": "USA",
      "city": "New York",
      "website": "https://example.com",
      "_count": {
        "freelancingServices": 10,
        "portfolioItems": 5
      }
    },
    "ServiceCategory": {
      "id": "category-id",
      "name": "Category Name",
      "description": "Category description"
    },
    "ServiceSubCategory": {
      "id": "subcategory-id",
      "name": "Subcategory Name",
      "description": "Subcategory description"
    },
    "packages": [
      {
        "id": "package-id",
        "tier": "BASIC",
        "name": "Basic Package",
        "description": "Basic package description",
        "deliveryDays": 7,
        "revisions": 2,
        "price": 100
      }
    ],
    "reviews": [
      {
        "id": "review-id",
        "rating": 5,
        "comment": "Great service!",
        "createdAt": "2024-01-10T00:00:00.000Z",
        "clientId": "client-id"
      }
    ],
    "_count": {
      "reviews": 10,
      "contracts": 5
    }
  }
}
```

**Business Logic:**
- Automatically increments the view count when a service is retrieved
- Returns up to 10 most recent reviews
- Includes related data: freelancer, category, subcategory, packages, and reviews

**Errors:**
- `404` - Freelancing service not found

---

### 4. updateFreelancingService

Updates an existing freelancing service.

**Route:** `PUT /freelancing-services/:id`  
**Authentication:** Required  
**Validation:** `validateFreelancingServiceId`, `validateUpdateFreelancingServiceJson`

**URL Parameters:**
```typescript
{
  id: string;  // Required: Freelancing service ID
}
```

**Request Body:**
All fields from `createFreelancingService` are optional. Additionally:
```typescript
{
  isActive?: boolean;                      // Optional: Active status
  isTopRated?: boolean;                   // Optional: Top rated flag
  isProSeller?: boolean;                  // Optional: Pro seller flag
  isFeatured?: boolean;                   // Optional: Featured flag
  badges?: string[];                      // Optional: Badges array
  status?: string;                        // Optional: Status (DRAFT, PENDING_APPROVAL, APPROVED, REJECTED, SUSPENDED, ARCHIVED)
  rejectionReason?: string;               // Optional: Rejection reason
  moderationNotes?: string;               // Optional: Moderation notes
  // ... all other fields from createFreelancingService (all optional)
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Freelancing service updated successfully",
  "data": {
    // Same structure as createFreelancingService response
  }
}
```

**Business Logic:**
- If title is updated, automatically generates a new unique slug
- Validates that the service exists before updating
- Only updates fields provided in the request body

**Errors:**
- `404` - Freelancing service not found

---

### 5. deleteFreelancingService

Deletes a freelancing service.

**Route:** `DELETE /freelancing-services/:id`  
**Authentication:** Required  
**Validation:** `validateFreelancingServiceId`

**URL Parameters:**
```typescript
{
  id: string;  // Required: Freelancing service ID
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Freelancing service deleted successfully"
}
```

**Business Logic:**
- Checks if the service has related data (packages, reviews, contracts)
- Prevents deletion if related data exists
- Returns a clear error message if deletion is not allowed

**Errors:**
- `404` - Freelancing service not found
- `400` - Cannot delete service with related packages, reviews, or contracts

**Note:** Before deleting, you must:
1. Delete all related `FreelancingServicePackage` records
2. Delete all related `FreelancingServiceReview` records
3. Delete or update all related `Contract` records

---

### 6. getFreelancingServicesByFreelancer

Retrieves all freelancing services for a specific freelancer with pagination.

**Route:** `GET /freelancing-services/freelancer/:freelancerId`  
**Authentication:** Not required (public endpoint)  
**Validation:** `validateFreelancerId`, `validateGetFreelancingServicesByFreelancerQuery`

**URL Parameters:**
```typescript
{
  freelancerId: string;  // Required: Freelancer ID
}
```

**Query Parameters:**
```typescript
{
  page?: string;   // Optional: Page number (default: 1)
  limit?: string;  // Optional: Items per page (default: 20)
  status?: string; // Optional: Filter by status (DRAFT, PENDING_APPROVAL, APPROVED, REJECTED, SUSPENDED, ARCHIVED)
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Freelancing services retrieved successfully",
  "data": {
    "freelancingServices": [
      {
        "id": "service-id",
        "title": "Service Title",
        "description": "Service Description",
        "slug": "service-title",
        "basePrice": 100,
        "currency": "USD",
        "deliveryTime": 7,
        "isActive": true,
        "status": "APPROVED",
        "views": 150,
        "favorites": 12,
        "orderCount": 25,
        "rating": 4.5,
        "ratingCount": 10,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "ServiceCategory": {
          "id": "category-id",
          "name": "Category Name"
        },
        "ServiceSubCategory": {
          "id": "subcategory-id",
          "name": "Subcategory Name"
        },
        "_count": {
          "reviews": 10,
          "contracts": 5
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "itemsPerPage": 20,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

**Business Logic:**
- Filters services by freelancer ID
- Optionally filters by status
- Orders by creation date (newest first)
- Returns paginated results

---

## Request/Response Formats

### Standard Success Response

All successful responses follow this format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Standard Error Response

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message"
}
```

In development mode, additional error details may be included:
```json
{
  "success": false,
  "message": "Error message",
  "stack": "Error stack trace...",
  "code": "ERROR_CODE"
}
```

---

## Error Handling

The controllers use the centralized error handling system from `controllerErrorHandler.ts`. All errors are automatically caught and formatted consistently.

### Common Error Types

| Error Type | Status Code | Description |
|------------|-------------|-------------|
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Validation failed |
| `ALREADY_EXISTS` | 409 | Resource already exists |
| `FORBIDDEN` | 403 | Access forbidden |
| `INTERNAL_ERROR` | 500 | Internal server error |

### Error Examples

**Freelancer Not Found:**
```json
{
  "success": false,
  "message": "Freelancer not found"
}
```

**Validation Error:**
```json
{
  "success": false,
  "message": "Title is required"
}
```

**Cannot Delete Service:**
```json
{
  "success": false,
  "message": "Cannot delete freelancing service that has related packages, reviews, or contracts. Please remove all related data first."
}
```

---

## Validation Requirements

All requests are validated using Zod schemas defined in `freelancingService.schemas.ts`. The validation middleware automatically:

1. Validates request body/query/params
2. Transforms data types (e.g., string to number for pagination)
3. Provides detailed error messages
4. Attaches validated data to `req.validatedBody`, `req.validatedQuery`, or `req.validatedParams`

### Field Validation Rules

**Title:**
- Required for creation
- Min length: 1
- Max length: 200 characters

**Description:**
- Required for creation
- Min length: 1
- Max length: 5000 characters

**Base Price:**
- Optional
- Must be non-negative (min: 0)

**Delivery Time:**
- Required for creation
- Must be at least 1 day

**Currency:**
- Optional
- Default: "USD"
- Must be exactly 3 characters

**Status:**
- Optional
- Must be one of: `DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `SUSPENDED`, `ARCHIVED`

---

## Usage Examples

### Example 1: Create a Freelancing Service

```typescript
// POST /freelancing-services
// Headers: Authorization: Bearer <access-token>

const response = await fetch('/freelancing-services', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    freelancerId: 'freelancer-id-123',
    title: 'Professional Logo Design',
    description: 'I will create a professional logo for your brand...',
    serviceCategoryId: 'category-id-123',
    serviceSubCategoryId: 'subcategory-id-123',
    basePrice: 100,
    currency: 'USD',
    deliveryTime: 7,
    revisionPolicy: 2,
    tags: ['logo', 'design', 'branding'],
    gallery: ['image1.jpg', 'image2.jpg']
  })
});

const data = await response.json();
```

### Example 2: Search Freelancing Services

```typescript
// GET /freelancing-services?search=logo&categoryId=cat-123&minPrice=50&maxPrice=200&sortBy=price&sortOrder=asc&page=1&limit=20

const response = await fetch(
  '/freelancing-services?search=logo&categoryId=cat-123&minPrice=50&maxPrice=200&sortBy=price&sortOrder=asc&page=1&limit=20'
);

const data = await response.json();
```

### Example 3: Get Service by ID

```typescript
// GET /freelancing-services/:id

const serviceId = 'service-id-123';
const response = await fetch(`/freelancing-services/${serviceId}`);
const data = await response.json();
```

### Example 4: Update a Service

```typescript
// PUT /freelancing-services/:id
// Headers: Authorization: Bearer <access-token>

const serviceId = 'service-id-123';
const response = await fetch(`/freelancing-services/${serviceId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    title: 'Updated Service Title',
    basePrice: 150,
    isFeatured: true
  })
});

const data = await response.json();
```

### Example 5: Get Services by Freelancer

```typescript
// GET /freelancing-services/freelancer/:freelancerId?page=1&limit=10&status=APPROVED

const freelancerId = 'freelancer-id-123';
const response = await fetch(
  `/freelancing-services/freelancer/${freelancerId}?page=1&limit=10&status=APPROVED`
);

const data = await response.json();
```

---

## Best Practices

### 1. Slug Generation

Slugs are automatically generated from titles. If a duplicate slug exists, a counter is appended:
- "Logo Design" → "logo-design"
- "Logo Design" (duplicate) → "logo-design-1"
- "Logo Design" (another duplicate) → "logo-design-2"

### 2. View Count Incrementation

The view count is automatically incremented when a service is retrieved via `getFreelancingServiceById`. This happens server-side and doesn't require client action.

### 3. Related Data Management

Before deleting a service, ensure all related data is removed:
- Delete all packages
- Delete all reviews
- Update or delete all contracts

### 4. Status Management

Use appropriate status values:
- `DRAFT` - Service is being created/edited
- `PENDING_APPROVAL` - Submitted for review
- `APPROVED` - Active and visible
- `REJECTED` - Rejected by moderators
- `SUSPENDED` - Temporarily suspended
- `ARCHIVED` - Archived (not visible)

### 5. Pagination

Always use pagination for list endpoints:
- Default page size: 20
- Maximum recommended: 100 items per page
- Always check `hasNextPage` and `hasPrevPage` for navigation

### 6. Search Optimization

For better search results:
- Use specific keywords in tags
- Include relevant terms in title and description
- Use proper meta descriptions for SEO

### 7. Price Filtering

When filtering by price:
- Use `minPrice` and `maxPrice` together for range filtering
- Consider currency conversion if supporting multiple currencies
- Remember that `isCustomPricing: true` services may not have a `basePrice`

---

## Related Models

### FreelancingService Model

The main model with the following key fields:
- Basic info: `id`, `title`, `description`, `slug`
- Pricing: `basePrice`, `currency`, `isCustomPricing`
- Delivery: `deliveryTime`, `revisionPolicy`, `rushDeliveryAvailable`
- Status: `status`, `isActive`, `isFeatured`, `isTopRated`
- Analytics: `views`, `favorites`, `rating`, `orderCount`
- Relations: `freelancer`, `ServiceCategory`, `ServiceSubCategory`, `packages`, `reviews`, `contracts`

### Related Models

- **User** - The freelancer who owns the service
- **ServiceCategory** - Main service category
- **ServiceSubCategory** - Service subcategory
- **FreelancingServicePackage** - Service packages (Basic, Standard, Premium)
- **FreelancingServiceReview** - Client reviews
- **Contract** - Contracts created from this service

---

## Route Configuration

Routes are defined in `freelancingService.routes.ts`:

```typescript
// Create
POST /freelancing-services
  - authenticate
  - validateCreateFreelancingServiceJson
  - createFreelancingService

// List (with filters)
GET /freelancing-services
  - validateGetFreelancingServicesQuery
  - getFreelancingServices

// Get by ID
GET /freelancing-services/:id
  - validateFreelancingServiceId
  - getFreelancingServiceById

// Update
PUT /freelancing-services/:id
  - authenticate
  - validateFreelancingServiceId
  - validateUpdateFreelancingServiceJson
  - updateFreelancingService

// Delete
DELETE /freelancing-services/:id
  - authenticate
  - validateFreelancingServiceId
  - deleteFreelancingService

// Get by Freelancer
GET /freelancing-services/freelancer/:freelancerId
  - validateFreelancerId
  - validateGetFreelancingServicesByFreelancerQuery
  - getFreelancingServicesByFreelancer
```

---

## Troubleshooting

### Issue: Slug Already Exists

**Solution:** The controller automatically handles duplicate slugs by appending a counter. This is transparent to the user.

### Issue: Cannot Delete Service

**Solution:** Check for related data:
1. Query `FreelancingServicePackage` where `freelancingServiceId = serviceId`
2. Query `FreelancingServiceReview` where `freelancingServiceId = serviceId`
3. Query `Contract` where `boughtFreelancingServiceId = serviceId`

Remove or update all related records before deletion.

### Issue: View Count Not Incrementing

**Solution:** View count only increments when using `getFreelancingServiceById`. List endpoints (`getFreelancingServices`) do not increment views.

### Issue: Search Not Finding Results

**Solution:** 
- Search is case-insensitive for title and description
- Tags use exact match
- Ensure the search term appears in title, description, or tags array

### Issue: Price Filter Not Working

**Solution:**
- Check if service has `basePrice` set (custom pricing services may not have one)
- Ensure `minPrice` and `maxPrice` are valid numbers
- Verify currency matches if filtering by currency

---

## Additional Notes

- All timestamps are in ISO 8601 format (UTC)
- Object IDs are MongoDB ObjectIds (24-character hex strings)
- JSON fields (`faq`, `availability`, `addOns`, `extras`, `customFields`, `templateOptions`) accept any valid JSON structure
- Array fields default to empty arrays if not provided
- Boolean fields default to `false` if not provided
- The slug is URL-friendly and unique across all services

---

## Related Documentation

- [Error Handler Guide](./ERROR_HANDLER_GUIDE.md) - Error handling patterns
- [Authentication Guide](./AUTHENTICATION_GUIDE.md) - Authentication and authorization
- [Freelancing Service Improvements](./FREELANCING_SERVICE_IMPROVEMENTS.md) - Service model details

---

## Support

For issues or questions:
1. Check the error messages and status codes
2. Verify validation requirements are met
3. Ensure authentication tokens are valid
4. Review the Prisma schema for field types
5. Check related data dependencies before deletion


# Error Handler Documentation

## Overview

The `controllerErrorHandler.ts` utility provides a centralized, consistent error handling system for the application. It standardizes error responses, handles various error types (Prisma, Zod, custom errors), and provides helper functions for success and error responses.

**Location:** `src/utils/controllerErrorHandler.ts`

---

## Table of Contents

1. [Components](#components)
2. [Usage Examples](#usage-examples)
3. [Error Types Reference](#error-types-reference)
4. [Prisma Error Mappings](#prisma-error-mappings)
5. [Best Practices](#best-practices)
6. [Response Format](#response-format)

---

## Components

### 1. AppError Class

A custom error class that extends the native `Error` class with additional properties for HTTP status codes and operational flags.

**Properties:**
- `statusCode: number` - HTTP status code for the error
- `isOperational: boolean` - Indicates if the error is operational (default: `true`)
- `message: string` - Error message (inherited from Error)

**Constructor:**
```typescript
constructor(message: string, statusCode: number = 500, isOperational: boolean = true)
```

**Example:**
```typescript
throw new AppError("User not found", 404);
```

---

### 2. ErrorTypes Object

A collection of predefined error factory functions organized by category. Each function returns an `AppError` instance with appropriate status codes.

**Categories:**
- **Authentication & Authorization** (401, 403)
- **Validation** (400)
- **Resource Management** (404, 409)
- **Server Errors** (500, 503)
- **Configuration** (500)

**Usage:**
```typescript
import { ErrorTypes } from '../utils/controllerErrorHandler';

// Throw predefined errors
throw ErrorTypes.NOT_FOUND("User");
throw ErrorTypes.UNAUTHORIZED("Invalid token");
throw ErrorTypes.ALREADY_EXISTS("Email");
```

---

### 3. handleError Function

The central error handling function that processes different error types and sends standardized JSON responses.

**Signature:**
```typescript
handleError(error: unknown, res: Response, defaultMessage?: string): void
```

**Error Handling Order:**
1. `AppError` instances (custom application errors)
2. `Prisma.PrismaClientKnownRequestError` (known Prisma errors)
3. `Prisma.PrismaClientValidationError` (Prisma validation errors)
4. `Prisma.PrismaClientInitializationError` (database connection errors)
5. `Prisma.PrismaClientUnknownRequestError` (unknown Prisma errors)
6. Zod validation errors (objects with `issues` property)
7. Generic `Error` instances
8. Unknown error types

**Features:**
- Automatically logs errors to console
- Returns appropriate HTTP status codes
- Includes stack traces in development mode
- Provides detailed error information in development

---

### 4. asyncHandler Function

A wrapper function that automatically catches errors from async controller functions and passes them to `handleError`.

**Signature:**
```typescript
asyncHandler(fn: Function): (req: any, res: Response, next: any) => void
```

**Usage:**
```typescript
// Wrap async controller functions
export const getUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany();
  sendSuccess(res, "Users retrieved successfully", users);
});
```

**Benefits:**
- Eliminates need for try-catch blocks in controllers
- Ensures all async errors are properly handled
- Maintains consistent error response format

---

### 5. sendSuccess Function

A helper function for sending standardized success responses.

**Signature:**
```typescript
sendSuccess(res: Response, message: string, data?: any, statusCode?: number): void
```

**Parameters:**
- `res` - Express response object
- `message` - Success message
- `data` - Optional data payload
- `statusCode` - HTTP status code (default: 200)

**Response Format:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

---

### 6. sendError Function

A helper function for sending standardized error responses (simpler alternative to throwing errors).

**Signature:**
```typescript
sendError(res: Response, message: string, statusCode?: number): void
```

**Parameters:**
- `res` - Express response object
- `message` - Error message
- `statusCode` - HTTP status code (default: 500)

**Response Format:**
```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Usage Examples

### Example 1: Using asyncHandler with ErrorTypes

```typescript
import { asyncHandler, ErrorTypes, sendSuccess } from '../utils/controllerErrorHandler';
import { prisma } from '../lib/prisma';

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) }
  });
  
  if (!user) {
    throw ErrorTypes.NOT_FOUND("User");
  }
  
  sendSuccess(res, "User retrieved successfully", user);
});
```

### Example 2: Custom AppError

```typescript
import { AppError, asyncHandler, sendSuccess } from '../utils/controllerErrorHandler';

export const createUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Custom validation
  if (password.length < 8) {
    throw new AppError("Password must be at least 8 characters", 400);
  }
  
  // Business logic...
  const user = await prisma.user.create({ data: { email, password } });
  
  sendSuccess(res, "User created successfully", user, 201);
});
```

### Example 3: Handling Prisma Errors

```typescript
import { asyncHandler, ErrorTypes, sendSuccess } from '../utils/controllerErrorHandler';
import { prisma } from '../lib/prisma';

export const createUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await prisma.user.create({
      data: { email, password }
    });
    sendSuccess(res, "User created successfully", user, 201);
  } catch (error) {
    // Prisma unique constraint error (P2002) will be automatically handled
    // by handleError, but you can also throw custom errors
    if (error.code === 'P2002') {
      throw ErrorTypes.ALREADY_EXISTS("Email");
    }
    throw error; // Let handleError process other errors
  }
});
```

### Example 4: Using sendError Directly

```typescript
import { sendError, sendSuccess } from '../utils/controllerErrorHandler';

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  
  if (!email) {
    return sendError(res, "Email is required", 400);
  }
  
  // Update logic...
  sendSuccess(res, "User updated successfully");
});
```

### Example 5: Route Setup

```typescript
import express from 'express';
import { getUserById, createUser } from './user.controllers';

const router = express.Router();

// Controllers are already wrapped with asyncHandler
router.get('/:id', getUserById);
router.post('/', createUser);

export default router;
```

---

## Error Types Reference

### Authentication & Authorization

| Function | Status Code | Default Message | Customizable |
|----------|------------|-----------------|--------------|
| `UNAUTHORIZED(message?)` | 401 | "Unauthorized access" | Yes |
| `FORBIDDEN(message?)` | 403 | "Access forbidden" | Yes |
| `INVALID_CREDENTIALS()` | 401 | "Invalid email or password" | No |
| `ACCOUNT_INACTIVE()` | 401 | "Account is inactive or suspended" | No |

### Validation

| Function | Status Code | Default Message | Customizable |
|----------|------------|-----------------|--------------|
| `VALIDATION_ERROR(message?)` | 400 | "Validation failed" | Yes |
| `INVALID_DATA(message?)` | 400 | "Invalid data provided" | Yes |
| `MISSING_REQUIRED_FIELD(field)` | 400 | "Missing required field: {field}" | Partial |

### Resource Management

| Function | Status Code | Default Message | Customizable |
|----------|------------|-----------------|--------------|
| `NOT_FOUND(resource?)` | 404 | "{resource} not found" | Yes |
| `ALREADY_EXISTS(resource?)` | 409 | "{resource} already exists" | Yes |
| `CONFLICT(message?)` | 409 | "Resource conflict" | Yes |

### Server Errors

| Function | Status Code | Default Message | Customizable |
|----------|------------|-----------------|--------------|
| `INTERNAL_ERROR(message?)` | 500 | "Internal server error" | Yes |
| `SERVICE_UNAVAILABLE(message?)` | 503 | "Service temporarily unavailable" | Yes |

### Configuration

| Function | Status Code | Default Message | Customizable |
|----------|------------|-----------------|--------------|
| `CONFIG_ERROR(message?)` | 500 | "Configuration error" | Yes |
| `JWT_SECRET_MISSING()` | 500 | "JWT secret not configured" | No |
| `BCRYPT_CONFIG_MISSING()` | 500 | "BCrypt salt rounds not configured" | No |

---

## Prisma Error Mappings

The handler automatically maps Prisma error codes to appropriate HTTP status codes and user-friendly messages:

| Prisma Code | HTTP Status | Message |
|-------------|-------------|---------|
| `P2002` | 409 | "A record with this information already exists" |
| `P2025` | 404 | "Record not found" |
| `P2003` | 400 | "Foreign key constraint failed" |
| `P2014` | 400 | "Invalid ID provided" |
| `P2016` | 400 | "Query interpretation error" |
| `P2021` | 404 | "Table does not exist" |
| `P2022` | 404 | "Column does not exist" |

**Unknown Prisma codes** default to:
- Status: 500
- Message: "Database operation failed"

---

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Optional data payload
  }
}
```

### Error Response (Production)

```json
{
  "success": false,
  "message": "Error message"
}
```

### Error Response (Development)

```json
{
  "success": false,
  "message": "Error message",
  "stack": "Error stack trace...",
  "code": "P2002",
  "meta": {
    // Additional error metadata (for Prisma errors)
  }
}
```

---

## Best Practices

### 1. Always Use asyncHandler

Wrap all async controller functions with `asyncHandler` to ensure errors are caught:

```typescript
// ✅ Good
export const getUsers = asyncHandler(async (req, res) => {
  // Controller logic
});

// ❌ Bad - errors won't be caught
export const getUsers = async (req, res) => {
  // Controller logic
};
```

### 2. Use Predefined Error Types

Prefer `ErrorTypes` over creating new `AppError` instances for consistency:

```typescript
// ✅ Good
throw ErrorTypes.NOT_FOUND("User");

// ❌ Less consistent
throw new AppError("User not found", 404);
```

### 3. Use sendSuccess for Success Responses

Always use `sendSuccess` for consistent response formatting:

```typescript
// ✅ Good
sendSuccess(res, "Users retrieved", users);

// ❌ Inconsistent
res.status(200).json({ users });
```

### 4. Let handleError Handle Prisma Errors

Don't manually handle Prisma errors unless you need custom logic:

```typescript
// ✅ Good - let handleError process it
const user = await prisma.user.create({ data });

// ✅ Also good - custom handling when needed
try {
  const user = await prisma.user.create({ data });
} catch (error) {
  if (error.code === 'P2002') {
    throw ErrorTypes.ALREADY_EXISTS("Email");
  }
  throw error; // Let handleError process others
}
```

### 5. Provide Meaningful Error Messages

Use descriptive messages that help frontend developers and users:

```typescript
// ✅ Good
throw ErrorTypes.NOT_FOUND("User with ID 123");

// ❌ Less helpful
throw ErrorTypes.NOT_FOUND();
```

### 6. Use Appropriate Status Codes

Choose status codes that match the error type:

```typescript
// ✅ Good
throw ErrorTypes.UNAUTHORIZED("Invalid token"); // 401
throw ErrorTypes.FORBIDDEN("Insufficient permissions"); // 403
throw ErrorTypes.NOT_FOUND("Resource"); // 404

// ❌ Bad
throw new AppError("Not found", 500); // Should be 404
```

### 7. Don't Expose Internal Details in Production

The handler automatically hides stack traces and detailed error information in production. Don't manually expose sensitive information:

```typescript
// ✅ Good - handleError handles this automatically
throw ErrorTypes.INTERNAL_ERROR();

// ❌ Bad - exposes internal details
res.status(500).json({
  message: error.message,
  stack: error.stack, // Don't do this in production
  databaseQuery: error.query // Don't expose this
});
```

---

## Error Handling Flow

```
Controller Function (wrapped with asyncHandler)
    ↓
    ↓ (Error occurs)
    ↓
asyncHandler catches error
    ↓
    ↓
handleError function
    ↓
    ├─→ AppError? → Return with statusCode
    ├─→ Prisma Known Error? → Map code to message
    ├─→ Prisma Validation Error? → Return 400
    ├─→ Prisma Init Error? → Return 500
    ├─→ Prisma Unknown Error? → Return 500
    ├─→ Zod Error? → Return 400
    ├─→ Generic Error? → Return 500
    └─→ Unknown Error? → Return 500
    ↓
JSON Response sent to client
```

---

## Environment-Specific Behavior

### Development Mode (`NODE_ENV === 'development'`)

- Includes stack traces in error responses
- Includes Prisma error codes and metadata
- Includes detailed error messages
- Logs all errors to console

### Production Mode

- Hides stack traces
- Hides internal error details
- Returns user-friendly messages only
- Still logs errors to console (for monitoring)

---

## Common Patterns

### Pattern 1: Find or Throw

```typescript
export const getUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) }
  });
  
  if (!user) {
    throw ErrorTypes.NOT_FOUND("User");
  }
  
  sendSuccess(res, "User found", user);
});
```

### Pattern 2: Create with Conflict Check

```typescript
export const createResource = asyncHandler(async (req, res) => {
  const existing = await prisma.resource.findUnique({
    where: { email: req.body.email }
  });
  
  if (existing) {
    throw ErrorTypes.ALREADY_EXISTS("Email");
  }
  
  const resource = await prisma.resource.create({
    data: req.body
  });
  
  sendSuccess(res, "Resource created", resource, 201);
});
```

### Pattern 3: Update with Validation

```typescript
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) }
  });
  
  if (!user) {
    throw ErrorTypes.NOT_FOUND("User");
  }
  
  const updated = await prisma.user.update({
    where: { id: parseInt(id) },
    data: req.body
  });
  
  sendSuccess(res, "User updated", updated);
});
```

---

## Troubleshooting

### Issue: Errors not being caught

**Solution:** Ensure your controller is wrapped with `asyncHandler`:

```typescript
// Make sure you're using asyncHandler
export const controller = asyncHandler(async (req, res) => {
  // Your code
});
```

### Issue: Getting generic 500 errors for Prisma errors

**Solution:** The handler should automatically map Prisma errors. Check that:
1. You're using the latest version of Prisma
2. The error is being thrown (not caught and swallowed)
3. You're not manually handling Prisma errors incorrectly

### Issue: Stack traces appearing in production

**Solution:** Ensure `NODE_ENV` is set to `production`. The handler checks this environment variable to determine whether to include stack traces.

---

## Additional Notes

- All errors are logged to the console using `console.error`
- The handler maintains a consistent response format across all endpoints
- Prisma errors are automatically mapped to user-friendly messages
- Development mode provides additional debugging information
- The system is extensible - you can add new error types to `ErrorTypes` as needed

---

## Related Documentation

- [Prisma Error Codes](https://www.prisma.io/docs/reference/api-reference/error-reference)
- [Express Error Handling](https://expressjs.com/en/guide/error-handling.html)
- [Zod Validation](https://zod.dev/)


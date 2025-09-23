# Authentication and Authorization System

This document provides a comprehensive guide to the implemented authentication and authorization system using access tokens and refresh tokens.

## Overview

The system implements a secure JWT-based authentication with the following features:

- **Access Tokens**: Short-lived (15 minutes) for API access
- **Refresh Tokens**: Long-lived (7 days) for token renewal
- **Token Rotation**: New refresh tokens issued on each refresh
- **Token Revocation**: Refresh tokens can be revoked on logout
- **Role-based Authorization**: Freelancer/Client specific access
- **Verification Gates**: Email/Phone verification requirements
- **Resource Ownership**: Users can only access their own resources

## Environment Setup

Add these environment variables to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
BCRYPT_SALT_ROUNDS=12
```

**Important**: Use strong, unique secrets for production. The refresh secret should be different from the JWT secret.

## Database Schema

The system uses a `RefreshToken` model to track refresh tokens:

```prisma
model RefreshToken {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  token     String   @unique
  expiresAt DateTime
  isRevoked Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id])
}
```

## API Endpoints

### Authentication Endpoints

#### 1. User Registration
```http
POST /auth/sign-up
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "isFreelancer": true,
  "isClient": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "isFreelancer": true,
      "isClient": false,
      "isEmailVerified": false,
      "isPhoneVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. User Login
```http
POST /auth/log-in
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 3. Refresh Token
```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 4. Logout
```http
POST /auth/log-out
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

## Middleware Usage

### Authentication Middleware

#### 1. Required Authentication
```typescript
import { authenticate } from "../middleware/auth.middlewares.js";

router.get("/profile", authenticate, (req, res) => {
  // req.user is available here
  res.json({ user: req.user });
});
```

#### 2. Optional Authentication
```typescript
import { optionalAuthenticate } from "../middleware/auth.middlewares.js";

router.get("/public-content", optionalAuthenticate, (req, res) => {
  if (req.user) {
    // User is logged in
    res.json({ message: `Hello ${req.user.name}!` });
  } else {
    // User is not logged in
    res.json({ message: "Welcome!" });
  }
});
```

### Authorization Middleware

#### 1. Freelancer Only
```typescript
import { authenticate, requireFreelancer } from "../middleware/auth.middlewares.js";

router.get("/freelancer/dashboard", authenticate, requireFreelancer, (req, res) => {
  res.json({ message: "Freelancer dashboard" });
});
```

#### 2. Client Only
```typescript
import { authenticate, requireClient } from "../middleware/auth.middlewares.js";

router.get("/client/dashboard", authenticate, requireClient, (req, res) => {
  res.json({ message: "Client dashboard" });
});
```

#### 3. Verified Users Only
```typescript
import { authenticate, requireVerified } from "../middleware/auth.middlewares.js";

router.post("/create-job", authenticate, requireVerified, (req, res) => {
  res.json({ message: "Job created" });
});
```

#### 4. Phone Verified Users Only
```typescript
import { authenticate, requirePhoneVerified } from "../middleware/auth.middlewares.js";

router.post("/withdraw-funds", authenticate, requirePhoneVerified, (req, res) => {
  res.json({ message: "Withdrawal processed" });
});
```

#### 5. Resource Ownership
```typescript
import { authenticate, requireOwnership } from "../middleware/auth.middlewares.js";

router.get("/user/:userId/profile", authenticate, requireOwnership("userId"), (req, res) => {
  res.json({ message: "User profile" });
});
```

#### 6. Complex Authorization Chain
```typescript
import { 
  authenticate, 
  requireFreelancer, 
  requireVerified, 
  requireOwnership 
} from "../middleware/auth.middlewares.js";

router.put("/freelancer/:freelancerId/portfolio", 
  authenticate, 
  requireFreelancer, 
  requireVerified, 
  requireOwnership("freelancerId"), 
  (req, res) => {
    res.json({ message: "Portfolio updated" });
  }
);
```

## Client-Side Implementation

### Token Storage
Store tokens securely on the client side:

```javascript
// Store tokens in httpOnly cookies (recommended) or secure storage
localStorage.setItem('accessToken', response.data.accessToken);
localStorage.setItem('refreshToken', response.data.refreshToken);
```

### API Request with Token
```javascript
const accessToken = localStorage.getItem('accessToken');

fetch('/api/profile', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

### Automatic Token Refresh
```javascript
async function makeAuthenticatedRequest(url, options = {}) {
  let accessToken = localStorage.getItem('accessToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (response.status === 401) {
    // Token expired, try to refresh
    const refreshToken = localStorage.getItem('refreshToken');
    
    const refreshResponse = await fetch('/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    
    if (refreshResponse.ok) {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshResponse.json();
      
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      // Retry original request
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newAccessToken}`
        }
      });
    } else {
      // Refresh failed, redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
  }
  
  return response;
}
```

## Security Features

### 1. Token Expiration
- **Access Token**: 15 minutes (short-lived for security)
- **Refresh Token**: 7 days (long-lived for convenience)

### 2. Token Rotation
- New refresh token issued on each refresh
- Old refresh token is revoked immediately
- Prevents token reuse attacks

### 3. Token Revocation
- Refresh tokens can be revoked on logout
- All user refresh tokens can be revoked if needed
- Database tracks token status

### 4. User Status Checking
- Inactive users cannot authenticate
- Suspended/blocked users are denied access
- Deleted users cannot access the system

### 5. Role-based Access Control
- Freelancer-specific endpoints
- Client-specific endpoints
- Mixed role support (users can be both)

### 6. Verification Gates
- Email verification requirements
- Phone verification for sensitive operations
- Gradual permission escalation

### 7. Resource Ownership
- Users can only access their own resources
- Configurable user ID field matching
- Prevents unauthorized resource access

## Error Handling

The system provides comprehensive error handling:

### Authentication Errors
```json
{
  "success": false,
  "message": "Access token is required"
}
```

### Authorization Errors
```json
{
  "success": false,
  "message": "Freelancer access required"
}
```

### Token Errors
```json
{
  "success": false,
  "message": "Invalid or expired refresh token"
}
```

## Best Practices

### 1. Environment Variables
- Use strong, unique secrets
- Different secrets for access and refresh tokens
- Rotate secrets regularly in production

### 2. Token Storage
- Use httpOnly cookies when possible
- Avoid localStorage for sensitive tokens
- Implement secure token cleanup on logout

### 3. Error Handling
- Don't expose sensitive information in errors
- Log security events for monitoring
- Implement rate limiting on auth endpoints

### 4. Token Refresh
- Implement automatic token refresh
- Handle refresh failures gracefully
- Provide clear user feedback

### 5. Security Headers
- Use HTTPS in production
- Implement CORS properly
- Add security headers (HSTS, CSP, etc.)

## Migration Guide

If you're upgrading from a single-token system:

1. **Update Database**: Run Prisma migration to add RefreshToken model
2. **Update Environment**: Add JWT_REFRESH_SECRET
3. **Update Client**: Implement token refresh logic
4. **Update Middleware**: Use new authentication middleware
5. **Test Thoroughly**: Verify all authentication flows

## Troubleshooting

### Common Issues

1. **"JWT refresh secret is not configured"**
   - Add JWT_REFRESH_SECRET to your .env file

2. **"Invalid or expired refresh token"**
   - Check if refresh token exists in database
   - Verify token hasn't been revoked
   - Ensure token hasn't expired

3. **"Authentication required"**
   - Verify Authorization header format: "Bearer <token>"
   - Check if access token is valid and not expired

4. **"Freelancer access required"**
   - Ensure user has isFreelancer: true
   - Check user role assignment

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=auth:*
```

This will provide detailed information about authentication and authorization decisions.

## Support

For issues or questions about the authentication system:

1. Check the error messages and status codes
2. Verify environment variables are set correctly
3. Ensure database schema is up to date
4. Review the middleware chain order
5. Check token expiration and revocation status

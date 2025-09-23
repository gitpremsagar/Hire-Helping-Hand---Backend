/**
 * Authentication and Authorization Usage Examples
 *
 * This file demonstrates how to use the implemented authentication and authorization system.
 * It shows various middleware combinations and their use cases.
 */
declare const router: import("express-serve-static-core").Router;
export default router;
/**
 * Environment Variables Required:
 *
 * Add these to your .env file:
 *
 * JWT_SECRET=your-super-secret-jwt-key-here
 * JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
 * BCRYPT_SALT_ROUNDS=12
 *
 * Example .env:
 * JWT_SECRET=my-super-secret-jwt-key-that-should-be-very-long-and-random
 * JWT_REFRESH_SECRET=my-super-secret-refresh-key-that-should-be-different-from-jwt-secret
 * BCRYPT_SALT_ROUNDS=12
 */
/**
 * API Endpoints Available:
 *
 * Authentication:
 * POST /auth/sign-up - Register new user
 * POST /auth/log-in - Login user
 * POST /auth/log-out - Logout user (revokes refresh token)
 * POST /auth/refresh-token - Refresh access token
 * POST /auth/forgot-password - Request password reset
 * POST /auth/reset-password - Reset password with token
 * POST /auth/verify-email - Verify email with token
 * POST /auth/verify-phone - Verify phone with code
 *
 * Request/Response Examples:
 *
 * 1. Sign Up:
 * POST /auth/sign-up
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "password123",
 *   "isFreelancer": true,
 *   "isClient": false
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "User registered successfully",
 *   "data": {
 *     "user": { ... },
 *     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   }
 * }
 *
 * 2. Login:
 * POST /auth/log-in
 * {
 *   "email": "john@example.com",
 *   "password": "password123"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "data": {
 *     "user": { ... },
 *     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   }
 * }
 *
 * 3. Refresh Token:
 * POST /auth/refresh-token
 * {
 *   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "Token refreshed successfully",
 *   "data": {
 *     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   }
 * }
 *
 * 4. Protected Route:
 * GET /profile
 * Headers: {
 *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "user": {
 *       "id": "user-id",
 *       "email": "john@example.com",
 *       "name": "John Doe",
 *       "isFreelancer": true,
 *       "isClient": false,
 *       "isEmailVerified": true,
 *       "isPhoneVerified": false
 *     }
 *   }
 * }
 */
/**
 * Security Features Implemented:
 *
 * 1. Access Token (15 minutes expiry) - Short-lived for security
 * 2. Refresh Token (7 days expiry) - Long-lived for convenience
 * 3. Refresh Token Rotation - New refresh token issued on each refresh
 * 4. Token Revocation - Refresh tokens can be revoked on logout
 * 5. User Status Checking - Inactive users cannot authenticate
 * 6. Role-based Authorization - Freelancer/Client specific endpoints
 * 7. Verification Requirements - Email/Phone verification gates
 * 8. Resource Ownership - Users can only access their own resources
 * 9. Optional Authentication - Public endpoints with personalized content
 * 10. Comprehensive Error Handling - Clear error messages for different scenarios
 */
//# sourceMappingURL=auth-usage.example.d.ts.map
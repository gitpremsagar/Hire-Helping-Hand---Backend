/**
 * Authentication and Authorization Usage Examples
 *
 * This file demonstrates how to use the implemented authentication and authorization system.
 * It shows various middleware combinations and their use cases.
 */
import express from "express";
import { authenticate, optionalAuthenticate, requireFreelancer, requireClient, requireVerified, requirePhoneVerified, requireOwnership } from "../middleware/auth.middlewares.js";
const router = express.Router();
// Example 1: Basic authentication required
router.get("/profile", authenticate, (req, res) => {
    // req.user is available here
    res.json({
        success: true,
        data: {
            user: req.user,
        },
    });
});
// Example 2: Optional authentication (for public endpoints that can show different content for logged-in users)
router.get("/public-content", optionalAuthenticate, (req, res) => {
    if (req.user) {
        // User is logged in, show personalized content
        res.json({
            success: true,
            data: {
                message: `Hello ${req.user.name}!`,
                personalizedContent: true,
            },
        });
    }
    else {
        // User is not logged in, show general content
        res.json({
            success: true,
            data: {
                message: "Welcome to our platform!",
                personalizedContent: false,
            },
        });
    }
});
// Example 3: Freelancer-only endpoint
router.get("/freelancer/dashboard", authenticate, requireFreelancer, (req, res) => {
    res.json({
        success: true,
        data: {
            message: "Freelancer dashboard",
            user: req.user,
        },
    });
});
// Example 4: Client-only endpoint
router.get("/client/dashboard", authenticate, requireClient, (req, res) => {
    res.json({
        success: true,
        data: {
            message: "Client dashboard",
            user: req.user,
        },
    });
});
// Example 5: Verified users only
router.post("/create-job", authenticate, requireVerified, requireClient, (req, res) => {
    res.json({
        success: true,
        data: {
            message: "Job created successfully",
            user: req.user,
        },
    });
});
// Example 6: Phone verified users only (for sensitive operations)
router.post("/withdraw-funds", authenticate, requirePhoneVerified, (req, res) => {
    res.json({
        success: true,
        data: {
            message: "Withdrawal processed",
            user: req.user,
        },
    });
});
// Example 7: Resource ownership check
router.get("/user/:userId/profile", authenticate, requireOwnership("userId"), (req, res) => {
    res.json({
        success: true,
        data: {
            message: "User profile",
            user: req.user,
            requestedUserId: req.params.userId,
        },
    });
});
// Example 8: Complex authorization chain
router.put("/freelancer/:freelancerId/portfolio", authenticate, requireFreelancer, requireVerified, requireOwnership("freelancerId"), (req, res) => {
    res.json({
        success: true,
        data: {
            message: "Portfolio updated",
            user: req.user,
            freelancerId: req.params.freelancerId,
        },
    });
});
// Example 9: Admin-like functionality (you would need to implement admin role checking)
router.get("/admin/users", authenticate, (req, res) => {
    // You could add admin role checking here
    // For now, just checking if user is verified
    if (!req.user?.isEmailVerified) {
        return res.status(403).json({
            success: false,
            message: "Admin access required",
        });
    }
    res.json({
        success: true,
        data: {
            message: "Admin users list",
            user: req.user,
        },
    });
});
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
//# sourceMappingURL=auth-usage.example.js.map
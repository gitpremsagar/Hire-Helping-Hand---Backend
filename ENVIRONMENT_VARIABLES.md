# Environment Variables Configuration

This document describes all the environment variables used in the application for configuration.

## Required Environment Variables

### Database Configuration
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/hire_helping_hand"
```

### JWT Configuration
```bash
# Main JWT secret for access tokens and password reset tokens
JWT_SECRET="your-super-secret-jwt-key-here"

# Separate secret for refresh tokens (recommended for security)
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"
```

## Optional Environment Variables

### Token Expiration Times
```bash
# Access token expiration (short-lived for security)
JWT_ACCESS_TOKEN_EXPIRES_IN="15m"

# Refresh token expiration (long-lived for convenience)
JWT_REFRESH_TOKEN_EXPIRES_IN="7d"

# Password reset token expiration
JWT_PASSWORD_RESET_EXPIRES_IN="1h"

# Email verification token expiration
JWT_EMAIL_VERIFICATION_EXPIRES_IN="24h"

# Refresh token database expiration (should match JWT expiration)
JWT_REFRESH_TOKEN_DB_EXPIRES_DAYS="7"
```

### Password Hashing Configuration
```bash
# BCrypt salt rounds (10-15 recommended, higher = more secure but slower)
BCRYPT_SALT_ROUNDS="12"
```

### Cookie Configuration (for future use)
```bash
# Cookie max age in days (should match refresh token expiration)
COOKIE_MAX_AGE_DAYS="7"

# Cookie security settings
COOKIE_SAME_SITE="lax"  # Options: strict, lax, none
```

### Application Configuration
```bash
# Server port
PORT="3000"

# Node environment
NODE_ENV="development"

# API prefix
API_PREFIX="/api/v1"
```

### CORS Configuration
```bash
# Allowed origins (comma-separated for multiple origins)
CORS_ORIGIN="*"

# Allow credentials in CORS
CORS_CREDENTIALS="false"
```

### Rate Limiting Configuration (for future implementation)
```bash
# Rate limit window in milliseconds
RATE_LIMIT_WINDOW_MS="900000"  # 15 minutes

# Maximum requests per window
RATE_LIMIT_MAX_REQUESTS="100"
```

## Default Values

If environment variables are not provided, the following defaults will be used:

- `JWT_ACCESS_TOKEN_EXPIRES_IN`: "15m"
- `JWT_REFRESH_TOKEN_EXPIRES_IN`: "7d"
- `JWT_PASSWORD_RESET_EXPIRES_IN`: "1h"
- `JWT_EMAIL_VERIFICATION_EXPIRES_IN`: "24h"
- `JWT_REFRESH_TOKEN_DB_EXPIRES_DAYS`: 7
- `BCRYPT_SALT_ROUNDS`: 12
- `COOKIE_MAX_AGE_DAYS`: 7
- `COOKIE_SAME_SITE`: "lax"
- `PORT`: 3000
- `NODE_ENV`: "development"
- `API_PREFIX`: "/api/v1"
- `CORS_ORIGIN`: "*"
- `CORS_CREDENTIALS`: false
- `RATE_LIMIT_WINDOW_MS`: 900000
- `RATE_LIMIT_MAX_REQUESTS`: 100

## Security Recommendations

1. **JWT Secrets**: Use strong, random secrets for JWT tokens. Consider using different secrets for access and refresh tokens.

2. **Token Expiration**: 
   - Keep access tokens short-lived (15 minutes or less)
   - Use longer expiration for refresh tokens (7 days or less)
   - Password reset tokens should be short-lived (1 hour or less)

3. **BCrypt Salt Rounds**: Use 12-15 rounds for good security vs performance balance.

4. **Environment**: Set `NODE_ENV=production` in production environments.

5. **CORS**: Restrict `CORS_ORIGIN` to your actual frontend domains in production.

## Example .env File

Create a `.env` file in your project root with the following structure:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/hire_helping_hand"

# JWT Secrets (REQUIRED)
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"

# Optional: Customize token expiration times
JWT_ACCESS_TOKEN_EXPIRES_IN="15m"
JWT_REFRESH_TOKEN_EXPIRES_IN="7d"
JWT_PASSWORD_RESET_EXPIRES_IN="1h"
JWT_EMAIL_VERIFICATION_EXPIRES_IN="24h"

# Optional: Customize password hashing
BCRYPT_SALT_ROUNDS="12"

# Optional: Application settings
PORT="3000"
NODE_ENV="development"
```

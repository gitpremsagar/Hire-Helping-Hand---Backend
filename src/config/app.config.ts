import "dotenv/config";

/**
 * Application configuration for authentication and security settings
 */
export const appConfig = {
  // JWT Configuration
  jwt: {
    // Access token settings
    accessToken: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m",
    },
    // Refresh token settings
    refreshToken: {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d",
      // Database expiration (should match JWT expiration)
      dbExpiresInDays: parseInt(process.env.JWT_REFRESH_TOKEN_DB_EXPIRES_DAYS || "7"),
    },
    // Password reset token settings
    passwordResetToken: {
      secret: process.env.JWT_SECRET, // Uses same secret as access token
      expiresIn: process.env.JWT_PASSWORD_RESET_EXPIRES_IN || "1h",
    },
    // Email verification token settings
    emailVerificationToken: {
      secret: process.env.JWT_SECRET, // Uses same secret as access token
      expiresIn: process.env.JWT_EMAIL_VERIFICATION_EXPIRES_IN || "24h",
    },
  },

  // Password hashing configuration
  password: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "12"),
  },

  // Cookie configuration (for future use)
  cookies: {
    // Secure cookie settings
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: (process.env.COOKIE_SAME_SITE as "strict" | "lax" | "none") || "lax",
    // Cookie expiration (should match refresh token expiration)
    maxAge: process.env.COOKIE_MAX_AGE_DAYS 
      ? parseInt(process.env.COOKIE_MAX_AGE_DAYS) * 24 * 60 * 60 * 1000 // Convert days to milliseconds
      : 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  },

  // Security settings
  security: {
    // Rate limiting (for future implementation)
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
    },
    // CORS settings
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      credentials: process.env.CORS_CREDENTIALS === "true",
    },
  },

  // Application settings
  app: {
    port: parseInt(process.env.PORT || "3000"),
    nodeEnv: process.env.NODE_ENV || "development",
    apiPrefix: process.env.API_PREFIX || "/api/v1",
  },
} as const;

/**
 * Validates that all required environment variables are present
 */
export const validateConfig = (): void => {
  const requiredEnvVars = [
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
  }

  // Validate numeric values
  const numericValidations = [
    { value: appConfig.password.saltRounds, name: "BCRYPT_SALT_ROUNDS", min: 10, max: 15 },
    { value: appConfig.jwt.refreshToken.dbExpiresInDays, name: "JWT_REFRESH_TOKEN_DB_EXPIRES_DAYS", min: 1, max: 30 },
  ];

  for (const validation of numericValidations) {
    if (isNaN(validation.value) || validation.value < validation.min || validation.value > validation.max) {
      throw new Error(
        `${validation.name} must be a number between ${validation.min} and ${validation.max}. Current value: ${validation.value}`
      );
    }
  }
};

/**
 * Helper function to get token expiration in milliseconds
 */
export const getTokenExpirationMs = (expiresIn: string): number => {
  const unit = expiresIn.slice(-1);
  const value = parseInt(expiresIn.slice(0, -1));

  switch (unit) {
    case "s": return value * 1000;
    case "m": return value * 60 * 1000;
    case "h": return value * 60 * 60 * 1000;
    case "d": return value * 24 * 60 * 60 * 1000;
    default: throw new Error(`Invalid time unit: ${unit}`);
  }
};

/**
 * Helper function to get refresh token database expiration date
 */
export const getRefreshTokenExpirationDate = (): Date => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + appConfig.jwt.refreshToken.dbExpiresInDays);
  return expiresAt;
};

// Validate configuration on import
validateConfig();

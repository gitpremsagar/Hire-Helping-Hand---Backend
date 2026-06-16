import "dotenv/config";
/**
 * Application configuration for authentication and security settings
 */
export declare const appConfig: {
    jwt: {
        accessToken: {
            secret: string | undefined;
            expiresIn: string;
        };
        refreshToken: {
            secret: string | undefined;
            expiresIn: string;
            dbExpiresInDays: number;
        };
        passwordResetToken: {
            secret: string | undefined;
            expiresIn: string;
        };
        emailVerificationToken: {
            secret: string | undefined;
            expiresIn: string;
        };
    };
    password: {
        saltRounds: number;
    };
    cookies: {
        secure: boolean;
        httpOnly: boolean;
        sameSite: "strict" | "lax" | "none";
        maxAge: number;
    };
    security: {
        rateLimit: {
            windowMs: number;
            maxRequests: number;
        };
        cors: {
            origin: string;
            credentials: boolean;
        };
    };
    email: {
        from: string;
        adminEmail: string;
        smtp: {
            host: string;
            port: number;
            secure: boolean;
            tls: {
                rejectUnauthorized: boolean;
            };
            auth: {
                user: string | undefined;
                pass: string | undefined;
            };
        };
    };
    app: {
        port: number;
        nodeEnv: string;
        apiPrefix: string;
    };
};
/** Shared options for the HTTP-only refresh token cookie. */
export declare const getRefreshTokenCookieOptions: () => {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "strict" | "lax" | "none";
    maxAge: number;
    path: string;
};
/** Options for clearing the refresh token cookie (must match set options). */
export declare const getRefreshTokenClearCookieOptions: () => {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "strict" | "lax" | "none";
    path: string;
};
/**
 * Validates that all required environment variables are present
 */
export declare const validateConfig: () => void;
/**
 * Helper function to get token expiration in milliseconds
 */
export declare const getTokenExpirationMs: (expiresIn: string) => number;
/**
 * Helper function to get refresh token database expiration date
 */
export declare const getRefreshTokenExpirationDate: () => Date;
//# sourceMappingURL=app.config.d.ts.map
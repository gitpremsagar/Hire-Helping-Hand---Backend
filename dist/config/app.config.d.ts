import "dotenv/config";
/**
 * Application configuration for authentication and security settings
 */
export declare const appConfig: {
    readonly jwt: {
        readonly accessToken: {
            readonly secret: string | undefined;
            readonly expiresIn: string;
        };
        readonly refreshToken: {
            readonly secret: string | undefined;
            readonly expiresIn: string;
            readonly dbExpiresInDays: number;
        };
        readonly passwordResetToken: {
            readonly secret: string | undefined;
            readonly expiresIn: string;
        };
        readonly emailVerificationToken: {
            readonly secret: string | undefined;
            readonly expiresIn: string;
        };
    };
    readonly password: {
        readonly saltRounds: number;
    };
    readonly cookies: {
        readonly secure: boolean;
        readonly httpOnly: true;
        readonly sameSite: "strict" | "lax" | "none";
        readonly maxAge: number;
    };
    readonly security: {
        readonly rateLimit: {
            readonly windowMs: number;
            readonly maxRequests: number;
        };
        readonly cors: {
            readonly origin: string;
            readonly credentials: boolean;
        };
    };
    readonly email: {
        readonly from: string;
        readonly adminEmail: string;
        readonly smtp: {
            readonly host: string;
            readonly port: number;
            readonly secure: false;
            readonly tls: {
                readonly rejectUnauthorized: false;
            };
            readonly auth: {
                readonly user: string | undefined;
                readonly pass: string | undefined;
            };
        };
    };
    readonly app: {
        readonly port: number;
        readonly nodeEnv: string;
        readonly apiPrefix: string;
    };
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
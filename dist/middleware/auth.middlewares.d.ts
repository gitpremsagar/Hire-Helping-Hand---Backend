import type { Request, Response, NextFunction } from "express";
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                isFreelancer: boolean;
                isClient: boolean;
                isEmailVerified: boolean;
                isPhoneVerified: boolean;
            };
        }
    }
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const optionalAuthenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const requireFreelancer: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireClient: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireVerified: (req: Request, res: Response, next: NextFunction) => void;
export declare const requirePhoneVerified: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireOwnership: (resourceUserIdField?: string) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middlewares.d.ts.map
import "dotenv/config";
import type { Request, Response } from "express";
export declare const signUp: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const logout: (req: Request, res: Response) => Promise<void>;
export declare const refreshToken: (req: Request, res: Response) => Promise<void>;
export declare const forgotPassword: (req: Request, res: Response) => Promise<void>;
export declare const resetPassword: (req: Request, res: Response) => Promise<void>;
export declare const verifyEmail: (req: Request, res: Response) => Promise<void>;
export declare const verifyPhone: (req: Request, res: Response) => Promise<void>;
export declare const setUserRole: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=auth.controllers.d.ts.map
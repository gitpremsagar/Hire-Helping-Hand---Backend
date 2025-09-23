import type { Request, Response, NextFunction } from "express";
declare const validateSignUpJson: (req: Request, res: Response, next: NextFunction) => void;
declare const validateLoginJson: (req: Request, res: Response, next: NextFunction) => void;
declare const validateForgotPasswordJson: (req: Request, res: Response, next: NextFunction) => void;
declare const validateResetPasswordJson: (req: Request, res: Response, next: NextFunction) => void;
declare const validateVerifyEmailJson: (req: Request, res: Response, next: NextFunction) => void;
declare const validateVerifyPhoneJson: (req: Request, res: Response, next: NextFunction) => void;
export { validateSignUpJson, validateLoginJson, validateForgotPasswordJson, validateResetPasswordJson, validateVerifyEmailJson, validateVerifyPhoneJson };
//# sourceMappingURL=auth.validation.middlewares.d.ts.map
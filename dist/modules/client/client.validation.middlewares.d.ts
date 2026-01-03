import type { Request, Response, NextFunction } from "express";
declare const validateUpdateClientProfile: (req: Request, res: Response, next: NextFunction) => void;
declare const validateGetClientsQuery: (req: Request, res: Response, next: NextFunction) => void;
declare const validateGetClientContractsQuery: (req: Request, res: Response, next: NextFunction) => void;
declare const validateClientIdParam: (req: Request, res: Response, next: NextFunction) => void;
export { validateUpdateClientProfile, validateGetClientsQuery, validateGetClientContractsQuery, validateClientIdParam, };
//# sourceMappingURL=client.validation.middlewares.d.ts.map
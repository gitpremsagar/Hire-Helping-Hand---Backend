import type { Request, Response, NextFunction } from "express";
declare const validateCreateSkillJson: (req: Request, res: Response, next: NextFunction) => void;
declare const validateUpdateSkillJson: (req: Request, res: Response, next: NextFunction) => void;
declare const validateSkillId: (req: Request, res: Response, next: NextFunction) => void;
declare const validateGetSkillsQuery: (req: Request, res: Response, next: NextFunction) => void;
export { validateCreateSkillJson, validateUpdateSkillJson, validateSkillId, validateGetSkillsQuery };
//# sourceMappingURL=skill.validation.middlewares.d.ts.map
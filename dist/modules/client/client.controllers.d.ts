import "dotenv/config";
import type { Request, Response } from "express";
export declare const getClientProfile: (req: Request, res: Response) => Promise<void>;
export declare const getAllClients: (req: Request, res: Response) => Promise<void>;
export declare const updateClientProfile: (req: Request, res: Response) => Promise<void>;
export declare const getClientContracts: (req: Request, res: Response) => Promise<void>;
export declare const getClientStats: (req: Request, res: Response) => Promise<void>;
export declare const deleteClient: (req: Request, res: Response) => Promise<void>;
export declare const reactivateClient: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=client.controllers.d.ts.map
import type { Request, Response } from "express";
import { AppRole } from "@prisma/client";
import { sendSuccess } from "../../utils/controllerErrorHandler.js";

/** Fixed list of assignable roles (extend when adding enum members in schema). */
const APP_ROLE_LIST: AppRole[] = [AppRole.ADMIN];

export const listAppRoles = async (
  _req: Request,
  res: Response
): Promise<void> => {
  sendSuccess(res, "App roles retrieved successfully", { roles: APP_ROLE_LIST });
};

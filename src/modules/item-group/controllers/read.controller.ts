import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { NextFunction, Request, Response } from "express";
import { ReadItemGroupService } from "../services/read.service.js";
import { db } from "@src/database/database.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";

export const read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization ?? "";
    const readItemService = new ReadItemGroupService(db);
    const tokenService = new VerifyTokenUserService(db);
    if (authorizationHeader === "") {
      throw new ApiError(401);
    }

    const authUser = await tokenService.handle(authorizationHeader);

    const found = authUser.permissions.includes("read-item-group");
    if (!found) {
      throw new ApiError(403);
    }
    const result = await readItemService.handle(req.params.id);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

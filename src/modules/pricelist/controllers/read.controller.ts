import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { NextFunction, Request, Response } from "express";
import { ReadPricelistService } from "../services/read.service.js";
import { db } from "@src/database/database.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";

export const read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization ?? "";
    const readItemService = new ReadPricelistService(db);
    const tokenService = new VerifyTokenUserService(db);
    db.startTransaction();
    if (authorizationHeader === "") {
      throw new ApiError(401);
    }

    const authUser = await tokenService.handle(authorizationHeader);

    const found = authUser.permissions.includes("read-pricelist");
    if (!found) {
      throw new ApiError(403);
    }
    const result = await readItemService.handle(req.params.id);

    await db.commitTransaction();
    res.status(200).json(result);
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};

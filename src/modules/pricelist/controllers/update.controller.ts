import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { NextFunction, Request, Response } from "express";
import { UpdatePricelistService } from "../services/update.service.js";
import { db } from "@src/database/database.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    const updatePricelistService = new UpdatePricelistService(db);
    const verifyTokenService = new VerifyTokenUserService(db);
    const authorizationHeader = req.headers.authorization ?? "";

    if (authorizationHeader === "") {
      throw new ApiError(401, { message: "Unauthorized Access" });
    }
    const authUser = await verifyTokenService.handle(authorizationHeader);
    const found = authUser.permissions.includes("update-item-group");
    if (!found) {
      throw new ApiError(403);
    }
    await updatePricelistService.handle(req.params.id, req.body, session);

    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};

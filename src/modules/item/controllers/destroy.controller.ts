import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { NextFunction, Request, Response } from "express";
import { DestroyItemService } from "../services/destroy.service.js";
import { db } from "@src/database/database.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();
    db.startTransaction();

    const destroyItemService = new DestroyItemService(db);
    const verifyTokenService = new VerifyTokenUserService(db);
    const authorizationHeader = req.headers.authorization ?? "";

    if (authorizationHeader === "") {
      throw new ApiError(401, { message: "Unauthorized Access" });
    }
    const authUser = await verifyTokenService.handle(authorizationHeader);
    const found = authUser.permissions.includes("archive-item");
    if (!found) {
      throw new ApiError(403);
    }
    await destroyItemService.handle(req.params.id, { session });

    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};

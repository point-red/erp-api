import { ApiError } from "@point-hub/express-error-handler";
import { NextFunction, Request, Response } from "express";
import { RestoreAllocationService } from "../services/restore.service.js";
import { db } from "@src/database/database.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";

export const restore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    const authorizationHeader = req.headers.authorization ?? "";

    if (authorizationHeader === "") {
      throw new ApiError(401);
    }

    const verifyTokenService = new VerifyTokenUserService(db);
    const authUser = await verifyTokenService.handle(authorizationHeader);
    const userId: string = authUser._id?.toString() || "";

    const restoreAllocationService = new RestoreAllocationService(db);
    await restoreAllocationService.handle(req.params.id, userId, session);

    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};

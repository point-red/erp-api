import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { NextFunction, Request, Response } from "express";
import { db } from "@src/database/database.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";
import { ArchiveService } from "@src/modules/item/services/archive.service.js";

export const archive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization ?? "";
    if (authorizationHeader === "") {
      throw new ApiError(401);
    }
    const session = db.startSession();

    db.startTransaction();

    const verifyTokenUserService = new VerifyTokenUserService(db);
    const authUser = await verifyTokenUserService.handle(authorizationHeader);
    const found = authUser.permissions.includes("archive-item");
    if (!found) {
      throw new ApiError(403);
    }
    const archiveService = new ArchiveService(db);
    await archiveService.handle(req.params.id, req.body, session);

    await db.commitTransaction();
    res.status(204).json({
      isArchived: true,
    });
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};

import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { NextFunction, Request, Response } from "express";
import { db } from "@src/database/database.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";
import { ArchiveService } from "@src/modules/supplier/services/archive.service.js";

export const archive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    const archiveService = new ArchiveService(db);
    await archiveService.handle({ headers: req.headers, id: req.params.id }, session);

    await db.commitTransaction();
    res.status(204);
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};

import { NextFunction, Request, Response } from "express";
import { RestoreItemService } from "../services/restore.service.js";
import { db } from "@src/database/database.js";

export const restore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();
    db.startTransaction();

    const archiveService = new RestoreItemService(db);
    await archiveService.handle({ headers: req.headers, id: req.params.id }, session);

    await db.commitTransaction();
    res.status(204).json({
      isArchived: false,
    });
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};

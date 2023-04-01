import { NextFunction, Request, Response } from "express";
import { RestoreMachineService } from "../services/restore.service.js";
import { db } from "@src/database/database.js";

export const restore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    const archivedMachineService = new RestoreMachineService(db);
    const result = await archivedMachineService.handle(req.params.id, session);

    await db.commitTransaction();

    res.status(204).json(result);
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};

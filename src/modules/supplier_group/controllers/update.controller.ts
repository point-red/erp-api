import { NextFunction, Request, Response } from "express";
import { UpdateSuppierGroupService } from "../services/update.service.js";
import { db } from "@src/database/database.js";
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    const updateSupplierGroupService = new UpdateSuppierGroupService(db);

    await updateSupplierGroupService.handle({ headers: req.headers, id: req.params.id, body: req.body }, session);

    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};

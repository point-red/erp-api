import { NextFunction, Request, Response } from "express";
import { DestroySupplierGroupService } from "../services/destroy.service.js";
import { db } from "@src/database/database.js";

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();
    db.startTransaction();

    const destroySupplierGroupService = new DestroySupplierGroupService(db);

    await destroySupplierGroupService.handle({ headers: req.headers, id: req.params.id }, { session });

    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};

import { NextFunction, Request, Response } from "express";
import { db } from "@src/database/database.js";
import { SupplierService } from "@src/modules/supplier/services/create.service.js";

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();
    db.startTransaction();
    const createSupplierService = new SupplierService(db);

    const result = await createSupplierService.handle(
      {
        headers: req.headers,
        body: req.body,
      },
      session
    );

    await db.commitTransaction();
    res.status(201).json({
      _id: result._id,
    });
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};

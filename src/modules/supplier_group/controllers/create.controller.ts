import { NextFunction, Request, Response } from "express";
import { db } from "@src/database/database.js";
import { SupplierGroupService } from "@src/modules/supplier_group/services/create.service.js";

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();
    db.startTransaction();
    const createSupplierService = new SupplierGroupService(db);

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

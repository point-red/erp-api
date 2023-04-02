import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { NextFunction, Request, Response } from "express";
import { UpdateSupplierService } from "../services/update.service.js";
import { db } from "@src/database/database.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";
import { validate } from "@src/modules/item/request/item.request.js";

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    const updateSupplierService = new UpdateSupplierService(db);

    await updateSupplierService.handle({ headers: req.headers, id: req.params.id, body: req.body }, session);

    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};

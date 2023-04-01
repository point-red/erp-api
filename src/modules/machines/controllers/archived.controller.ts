import { ApiError } from "@point-hub/express-error-handler";
import { NextFunction, Request, Response } from "express";
import { ArchivedMachineService } from "../services/archived.service.js";
import { db } from "@src/database/database.js";

export const archived = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization ?? "";
    if (authorizationHeader === "") {
      throw new ApiError(401);
    }

    const session = db.startSession();

    db.startTransaction();

    const archivedMachineService = new ArchivedMachineService(db);
    const result = await archivedMachineService.handle(req.params.id, session);
    console.log(" ini service ", result);

    await db.commitTransaction();

    res.status(204).json({ result });
  } catch (error) {
    console.log("ini catch", error);
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};

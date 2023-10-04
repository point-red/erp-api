import { ApiError } from "@point-hub/express-error-handler";
import { NextFunction, Request, Response } from "express";
import { validate } from "../request/create.request.js";
import { CreateMachineService } from "../services/create.service.js";
import { db } from "@src/database/database.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization ?? "";
    if (authorizationHeader === "") {
      throw new ApiError(401);
    }

    const verifyTokenUserService = new VerifyTokenUserService(db);
    const tokenDecode = await verifyTokenUserService.handle(authorizationHeader);
    req.body._userId = tokenDecode._id;

    const session = db.startSession();

    db.startTransaction();

    await validate(req.body);

    const createMachineService = new CreateMachineService(db);
    const result = await createMachineService.handle(req.body, session);

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

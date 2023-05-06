import { ApiError } from "@point-hub/express-error-handler";
import { NextFunction, Request, Response } from "express";
import { AllocationInterface } from "../entities/allocation.entity.js";
import { ReadAllocationService } from "../services/read.service.js";
import { db } from "@src/database/database.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";

export const read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization ?? "";

    if (authorizationHeader === "") {
      throw new ApiError(401);
    }

    const verifyTokenService = new VerifyTokenUserService(db);
    await verifyTokenService.handle(authorizationHeader);

    const readAllocationService = new ReadAllocationService(db);
    const result = (await readAllocationService.handle(req.params.id)) as AllocationInterface;

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

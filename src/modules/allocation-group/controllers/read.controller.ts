import { ApiError } from "@point-hub/express-error-handler";
import { NextFunction, Request, Response } from "express";
import { AllocationGroupInterface } from "../entities/allocation-group.entity.js";
import { ReadAllocationGroupService } from "../services/read.service.js";
import { db } from "@src/database/database.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";

export const read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const readAllocationGroupService = new ReadAllocationGroupService(db);

    const authorizationHeader = req.headers.authorization ?? "";

    if (authorizationHeader === "") {
      throw new ApiError(401);
    }

    const verifyTokenService = new VerifyTokenUserService(db);
    await verifyTokenService.handle(authorizationHeader);

    const result = (await readAllocationGroupService.handle(req.params.id)) as AllocationGroupInterface;

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

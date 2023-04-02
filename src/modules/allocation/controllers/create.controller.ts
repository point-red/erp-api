import { ApiError } from "@point-hub/express-error-handler";
import { NextFunction, Request, Response } from "express";
import { AllocationRepository } from "../repositories/allocation.repository.js";
import { QueryInterface } from "@src/database/connection";
import { db } from "@src/database/database.js";
import { validate } from "@src/modules/allocation/request/create.request.js";
import { CreateAllocationService } from "@src/modules/allocation/services/create.service.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    const authorizationHeader = req.headers.authorization ?? "";

    if (authorizationHeader === "") {
      throw new ApiError(401);
    }

    const verifyTokenService = new VerifyTokenUserService(db);
    const authUser = await verifyTokenService.handle(authorizationHeader);
    const userId: string = authUser._id?.toString() || "";

    validate(req.body);

    // check if name already in database
    const query: QueryInterface = {
      fields: "",
      filter: { name: req.body.name },
      page: 1,
      pageSize: 1,
      sort: "",
    };
    const allocationRepository = new AllocationRepository(db);
    const allocations = (await allocationRepository.readMany(query)) as any;
    if (allocations.data.length > 0) {
      throw new ApiError(422, { name: ["name is exists"] });
    }

    const createAllocationService = new CreateAllocationService(db);
    const result = await createAllocationService.handle(userId, req.body, session);

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

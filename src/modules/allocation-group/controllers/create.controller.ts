import { ApiError } from "@point-hub/express-error-handler";
import { NextFunction, Request, Response } from "express";
import { AllocationGroupRepository } from "../repositories/allocation-group.repository.js";
import { QueryInterface } from "@src/database/connection";
import { db } from "@src/database/database.js";
import { validate } from "@src/modules/allocation-group/request/create.request.js";
import { CreateAllocationGroupService } from "@src/modules/allocation-group/services/create.service.js";
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
    const allocationGroupRepository = new AllocationGroupRepository(db);
    const allocationGroup = (await allocationGroupRepository.readMany(query)) as any;
    if (allocationGroup.data.length > 0) {
      throw new ApiError(422, { name: ["name is exists"] });
    }

    const createAllocationGroupService = new CreateAllocationGroupService(db);
    const result = await createAllocationGroupService.handle(userId, req.body, session);

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

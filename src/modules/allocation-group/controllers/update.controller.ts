import { ApiError } from "@point-hub/express-error-handler";
import { NextFunction, Request, Response } from "express";
import { AllocationGroupRepository } from "../repositories/allocation-group.repository.js";
import { validate } from "../request/create.request.js";
import { UpdateAllocationGroupService } from "../services/update.service.js";
import { QueryInterface } from "@src/database/connection.js";
import { db } from "@src/database/database.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";

export const update = async (req: Request, res: Response, next: NextFunction) => {
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

    const updateAllocationGroupService = new UpdateAllocationGroupService(db);
    await updateAllocationGroupService.handle(req.params.id, userId, req.body, session);

    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};

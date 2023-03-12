import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { NextFunction, Request, Response } from "express";
import { db } from "@src/database/database.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";
import { validate } from "@src/modules/item-group/request/item-group.request.js";
import { ItemGroupService } from "@src/modules/item-group/services/create.service.js";

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();
    db.startTransaction();
    const verifyTokenService = new VerifyTokenUserService(db);
    const createItemGroupService = new ItemGroupService(db);
    const authorizationHeader = req.headers.authorization ?? "";

    if (authorizationHeader === "") {
      throw new ApiError(401, { message: "Unauthorized Access" });
    }
    const authUser = await verifyTokenService.handle(authorizationHeader);
    const found = authUser.permissions.includes("create-item-group");
    if (!found) {
      throw new ApiError(403);
    }

    await validate(req.body);
    const userId: string = authUser._id?.toString() || "";
    const result = await createItemGroupService.handle(userId, req.body, session);

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

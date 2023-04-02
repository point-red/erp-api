import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { NextFunction, Request, Response } from "express";
import { db } from "@src/database/database.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";
import { validate } from "@src/modules/item/request/item.request.js";
import { ItemService } from "@src/modules/item/services/create.service.js";

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();
    db.startTransaction();
    const verifyTokenService = new VerifyTokenUserService(db);
    const createItemService = new ItemService(db);
    const authorizationHeader = req.headers.authorization ?? "";

    if (authorizationHeader === "") {
      throw new ApiError(401);
    }
    const authUser = await verifyTokenService.handle(authorizationHeader);
    const found = authUser.permissions.includes("create-item");
    if (!found) {
      throw new ApiError(403);
    }

    const userId: string = authUser._id?.toString() || "";
    const result = await createItemService.handle(userId, req.body, session);

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

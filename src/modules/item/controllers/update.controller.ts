import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { NextFunction, Request, Response } from "express";
import { UpdateItemService } from "../services/update.service.js";
import { db } from "@src/database/database.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";
import { validate } from "@src/modules/item/request/item.request.js";

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    const updateRoleService = new UpdateItemService(db);
    const verifyTokenService = new VerifyTokenUserService(db);
    const authorizationHeader = req.headers.authorization ?? "";

    if (authorizationHeader === "") {
      throw new ApiError(401, { message: "Unauthorized Access" });
    }

    const authUser = await verifyTokenService.handle(authorizationHeader);
    const found = authUser.permissions.includes("update-item");
    if (!found) {
      throw new ApiError(403);
    }
    await validate(req.body, "update");
    const userId: string = authUser._id?.toString() || "";
    await updateRoleService.handle(userId, req.params.id, req.body, session);

    await db.commitTransaction();

    res.status(204).json();
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};

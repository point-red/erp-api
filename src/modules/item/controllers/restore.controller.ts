import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { NextFunction, Request, Response } from "express";
import { RestoreItemService } from "../services/restore.service.js";
import { db } from "@src/database/database.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";
import { validate } from "@src/modules/item/request/item.request.js";

export const restore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();
    db.startTransaction();

    const authorizationHeader = req.headers.authorization ?? "";
    if (authorizationHeader === "") {
      throw new ApiError(401, { message: "Unauthorized Access" });
    }

    const verifyTokenUserService = new VerifyTokenUserService(db);
    const authUser = await verifyTokenUserService.handle(authorizationHeader);

    const found = authUser.permissions.includes("restore-item");
    if (!found) {
      throw new ApiError(403);
    }

    validate(req.body);
    const archiveService = new RestoreItemService(db);
    await archiveService.handle(req.params.id, req.body, session);

    await db.commitTransaction();
    res.status(200).json({
      isArchived: true,
    });
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};

import { NextFunction, Request, Response } from "express";
import { ReadSupplierGroupService } from "../services/read.service.js";
import { db } from "@src/database/database.js";

export const read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const readSupplierGroupService = new ReadSupplierGroupService(db);

    const result = await readSupplierGroupService.handle({ headers: req.headers }, req.params.id);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

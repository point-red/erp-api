import { NextFunction, Request, Response } from "express";
import { ReadSupplierService } from "../services/read.service.js";
import { db } from "@src/database/database.js";

export const read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const readSupplierService = new ReadSupplierService(db);

    const result = await readSupplierService.handle({ headers: req.headers }, req.params.id);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

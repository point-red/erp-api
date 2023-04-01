import { NextFunction, Request, Response } from "express";
import { ReadMachineService } from "../services/read.service.js";
import { db } from "@src/database/database.js";

export const read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const readMachineService = new ReadMachineService(db);

    const result = await readMachineService.handle(req.params.id);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

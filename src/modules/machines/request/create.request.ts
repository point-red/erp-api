import { ApiError } from "@point-hub/express-error-handler";
import Validatorjs from "validatorjs";
import { ReadManyMachineService } from "../services/read-many.service.js";
import { db } from "@src/database/database.js";

export const validate = async (body: any) => {
  const validation = new Validatorjs(body, {
    name: "required",
  });

  const readManyMachineService = new ReadManyMachineService(db);
  const result1 = await readManyMachineService.handle({
    fields: "name",
    filter: { name: body.name },
    page: 1,
    pageSize: 2,
    sort: "desc",
  });

  if (result1.data.length > 0) {
    throw new ApiError(422, { name: ["name is exists"] });
  }

  if (validation.fails()) {
    throw new ApiError(422, validation.errors.errors);
  }
};

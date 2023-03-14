import { ApiError } from "@point-hub/express-error-handler";
import Validatorjs from "validatorjs";
import { db } from "@src/database/database.js";
import { ItemRepository } from "@src/modules/item/repositories/item.repository.js";

export const validate = async (body: any) => {
  const validation = new Validatorjs(body, {
    code: "required|exist:item,code",
    unit: "required",
    chartOfAccount: "required",
    name: "required|exist:item,name",
  });

  let passes = () => {};
  let fails = () => {};

  const promise = new Promise((resolve) => {
    passes = () => {
      resolve(true);
    };
    fails = () => {
      resolve(false);
    };
  });

  validation.checkAsync(passes, fails);

  const result = await promise;

  if (result === false) {
    throw new ApiError(422, validation.errors.errors);
  }
};

Validatorjs.registerAsync(
  "exist",
  async function (value, attribute, req, passes) {
    if (!attribute) throw new ApiError(500);

    const attArr = attribute.split(",");
    if (attArr.length !== 2) throw new ApiError(500);

    const { 0: table, 1: column } = attArr;

    const aggregates: any = [{ $limit: 1 }];

    if (column === "code") {
      aggregates.push({
        $match: {
          code: value,
        },
      });
    }
    if (column === "name") {
      aggregates.push({
        $match: {
          name: value,
        },
      });
    }

    console.log("check", value);
    const itemRepository = new ItemRepository(db);
    const aggregateResult = itemRepository.aggregate(aggregates, {
      page: 1,
      pageSize: 10,
    });

    const result = (await aggregateResult) as any;
    if (result.data.length > 0) {
      passes(false, `${column} is exists`); // return false if value exists
      return;
    }
    passes();
  },
  ""
);

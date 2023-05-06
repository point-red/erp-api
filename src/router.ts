import express, { Express } from "express";
import authRouter from "./modules/auth/router.js";
import itemsRouter from "./modules/item/router.js";
import itemGroupRouter from "./modules/item-group/router.js";
import pricelistRouter from "./modules/pricelist/router.js";
import supplierRouter from "./modules/supplier/router.js";
import supplierGroupRouter from "./modules/supplier_group/router.js";

import usersRouter from "./modules/users/router.js";

export default function () {
  ``;
  const app: Express = express();
  /**
   * Register all available modules
   * <modules>/router.ts
   */
  app.use(`/auth`, authRouter);
  app.use(`/users`, usersRouter);
  app.use(`/items`, itemsRouter);
  app.use(`/item-groups`, itemGroupRouter);
  app.use(`/pricelists`, pricelistRouter);
  app.use(`/suppliers`, supplierRouter);
  app.use(`/supplier-groups`, supplierGroupRouter);

  return app;
}

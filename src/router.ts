import express, { Express } from "express";
import allocationRouter from "./modules/allocation/router.js";
import allocationGroupRouter from "./modules/allocation-group/router.js";
import authRouter from "./modules/auth/router.js";
import roleRouter from "./modules/roles/router.js";
import usersRouter from "./modules/users/router.js";

export default function () {
  const app: Express = express();
  /**
   * Register all available modules
   * <modules>/router.ts
   */
  app.use(`/auth`, authRouter);
  app.use(`/users`, usersRouter);
  app.use(`/allocations`, allocationRouter);
  app.use(`/allocation-groups`, allocationGroupRouter);
  app.use(`/roles`, roleRouter);

  return app;
}

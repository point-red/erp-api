import { Router } from "express";
import * as controller from "./controllers/index.js";

const router = Router();

router.get("/", controller.readMany);
router.get("/:id", controller.read);
router.post("/", controller.create);
router.patch("/:id", controller.update);
router.patch("/:id/archive", controller.archived);
router.patch("/:id/restore", controller.restore);
router.delete("/:id", controller.destroy);

export default router;

import { Router } from "express";
import * as controller from "./controllers/index.js";

const router = Router();

router.post("/", controller.create);
router.get("/", controller.readMany);
router.get("/:id", controller.read);
router.patch("/:id", controller.update);
router.patch("/:id/archive", controller.archive);
router.patch("/:id/restore", controller.restore);
router.delete("/:id", controller.destroy);

export default router;

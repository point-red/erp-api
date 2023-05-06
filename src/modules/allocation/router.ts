import { Router } from "express";
import * as controller from "./controllers/index.js";

const router = Router();

router.post("/", controller.create);
router.get("/", controller.readMany);
router.get("/:id", controller.read);
router.patch("/:id", controller.update);
router.delete("/:id", controller.destroy);
router.patch("/:id/archive", controller.archive);
router.patch("/:id/restore", controller.restore);

export default router;

import { Router } from "express";
import { ItemController } from "@Controllers/App";
import Auth from "@Auth";

const router = Router();

router.post("/", Auth.isAuthenticated(), ItemController.create);
router.patch("/", Auth.isAuthenticated(), ItemController.edit);
router.delete("/", Auth.isAuthenticated(), ItemController.destroy);
router.post("/:id", Auth.isAuthenticated(), ItemController.get);

export default router;

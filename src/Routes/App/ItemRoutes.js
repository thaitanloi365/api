import { Router } from "express";
import { ItemController } from "@Controllers/App";
import Auth from "@Auth";

const router = Router();

router.post("/", Auth.isAuthenticated(), ItemController.create);
router.get("/", Auth.isAuthenticated(), ItemController.all);
router.patch("/:id", Auth.isAuthenticated(), ItemController.edit);
router.delete("/:id", Auth.isAuthenticated(), ItemController.destroy);
router.get("/:id", Auth.isAuthenticated(), ItemController.get);
export default router;

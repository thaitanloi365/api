import { Router } from "express";
import { UserController } from "@Controllers/App";
import Auth from "@Auth";

const router = Router();

router.post("/", UserController.create);

router.get("/", Auth.isAuthenticated(), UserController.get);
router.patch("/", Auth.isAuthenticated(), UserController.update);

router.post("/device", Auth.isAuthenticated(), UserController.addDevice);
router.delete("/device", Auth.isAuthenticated(), UserController.deleteDevice);

router.patch("/changePassword", Auth.isAuthenticated(), UserController.changePassword);
router.post("/forgotPassword", UserController.forgotPassword);

router.patch("/reset/:token", UserController.resetPassword);
router.get("/reset/:token", UserController.resetToken);

router.get("/items", Auth.isAuthenticated(), UserController.getAllItem);

export default router;

import { Router } from "express";
import { User } from "@Controllers/App";
import Auth from "@Auth";

const router = Router();

router.post("/", User.create);

router.get("/", Auth.isAuthenticated(), User.get);
router.patch("/", Auth.isAuthenticated(), User.update);

router.post("/device", Auth.isAuthenticated(), User.addDevice);
router.delete("/device", Auth.isAuthenticated(), User.deleteDevice);

router.patch("/changePassword", Auth.isAuthenticated(), User.changePassword);
router.post("/forgotPassword", User.forgotPassword);

router.patch("/reset/:token", User.resetPassword);
router.get("/reset/:token", User.resetToken);

export default router;

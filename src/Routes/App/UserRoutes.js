import { Router } from "express";
import { User } from "@Controllers/App";
import Auth from "@Auth";

const router = Router();

router.post("/", User.create);
router.get("/", Auth.isAuthenticated(), User.get);
router.patch("/", Auth.isAuthenticated(), User.update);
router.patch("/changePassword", Auth.isAuthenticated(), User.changePassword);
router.post("/forgotPassword", Auth.isAuthenticated(), User.forgotPassword);
router.patch("/reset/:token", User.resetPassword);
router.get("/reset/:token", User.resetToken);
router.post("/updateDevice", Auth.isAuthenticated(), User.updateDevice);
router.post("/deleteDevice", Auth.isAuthenticated(), User.deleteDevice);
export default router;

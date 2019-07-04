import { Router } from "express";
import controller from "./AWSController";
import multer from "multer";
import helper from "./AWSHelper";
import Auth from "@Auth";

const router = Router();

const upload = multer({
  limits: {
    fileSize: 2000000
  },
  dest: process.env.NODE_ENV === "development" ? "../../uploads" : "/app/uploads"
});

router.put("/upload", Auth.isAuthenticated(), upload.single("file"), controller.upload);
router.post("/upload", Auth.isAuthenticated(), upload.single("file"), controller.upload);
router.get("/s3Signature", Auth.isAuthenticated(), controller.s3Signature);

export default {
  router,
  helper
};

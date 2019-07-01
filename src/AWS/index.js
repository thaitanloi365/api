import { Router } from "express";
import controller from "./AWSController";
import multer from "multer";
import helper from "./AWSHelper";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.put("/uploads", upload.single("file"), controller.upload);
router.post("/upload", upload.single("file"), controller.upload);
router.get("/s3Signature", controller.s3Signature);

export default {
  router,
  helper
};

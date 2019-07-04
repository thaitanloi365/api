import { Router } from "express";
import controller from "./AWSController";
import multer from "multer";
import helper from "./AWSHelper";

const router = Router();

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"), false);
    }

    cb(undefined, true);
  }
});

router.put("/upload", upload.single("file"), controller.upload);
router.post("/upload", upload.single("file"), controller.upload);
router.get("/s3Signature", controller.s3Signature);

export default {
  router,
  helper
};

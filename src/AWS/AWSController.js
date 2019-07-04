import aws from "aws-sdk";
import crypto from "crypto";
import fs from "fs";
import sharp from "sharp";
import Strings from "@Strings";
import { Utils } from "@Utils";

async function upload(req, res, next) {
  let file = req.file;
  if (!file) {
    return Utils.handleError(res, Strings.FILE_REQUIRED);
  }

  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return Utils.handleError(res, Strings.IMAGE_INVALID, 422);
  }
  // Clean the file name of special characters, extra spaces, etc.
  let fileName = file.originalname
    .replace(/[^a-zA-Z0-9. ]/g, "")
    .replace(/\s+/g, " ")
    .replace(/[ ]/g, "-");

  // Check if the fileName has a file extension
  // If it doesn't we add a fileExt from the mimetype
  const pattern = /\.[0-9a-z]+$/i;
  const foundFileExt = fileName.match(pattern);
  if (!foundFileExt) {
    // Get the file extension from the mimetype
    const fileExt = file.mimetype.substr(file.mimetype.indexOf("/") + 1);

    // Add to the fileName
    fileName += `.${fileExt}`;
  }

  // Create random string to ensure unique filenames
  const randomBytes = crypto.randomBytes(32).toString("hex");
  const fileKey = `${process.env.AWS_S3_FILES_KEY_PREFIX}/${randomBytes}/${fileName}`;

  // Configure aws
  aws.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  aws.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  // Create our bucket and set params
  const bucket = new aws.S3({
    params: { Bucket: process.env.AWS_S3_FILES_BUCKET }
  });

  const width = req.body.width ? parseInt(req.body.width) : null;
  const height = req.body.height ? parseInt(req.body.height) : null;
  const shouldResize = width > 0 && height > 0;

  const buffer = shouldResize
    ? await sharp(file.path)
        .resize(width, height)
        .toBuffer()
    : await sharp(file.path).toBuffer();

  const params = {
    ACL: "public-read",
    Key: fileKey,
    Bucket: process.env.AWS_S3_FILES_BUCKET,
    ContentType: file.mimetype != "" ? file.mimetype : "application/octet-stream",
    Body: buffer
  };

  // Upload file to s3
  bucket.upload(params, function(err, data) {
    if (data) {
      // Delete the file once it's been uploaded to s3
      fs.unlinkSync(file.path);
      const response = {
        key: data.key,
        url: data.Location
      };

      Utils.handleSuccess(res, Strings.UPLOAD_SUCCESS, response);
    } else {
      // Delete the file
      fs.unlinkSync(file.path);
      Utils.handleError(res, err.message, 403);
    }
  });
}

function s3Signature(req, res, next) {
  // Configure aws
  aws.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  aws.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!req.query.fileName) {
    return res.status(422).json({ error: "Missing required parameters" });
  }
  const s3 = new aws.S3({ region: process.env.AWS_REGION });
  let fileType = req.query.fileType || "image";

  // Clean the file name of special characters, extra spaces, etc.
  let fileName = req.query.fileName;

  // Create random string to ensure unique filenames
  let randomBytes = crypto.randomBytes(32).toString("hex");
  let wholeFilePath;
  // we want to make sure the file is a mp4 so we can transcode it
  if (fileType === "video/mp4") {
    wholeFilePath = `${process.env.AWS_S3_VIDEO_OVERSIZED_PREFIX}/${randomBytes}/${fileName}`;
  } else {
    wholeFilePath = `${process.env.AWS_S3_FILES_KEY_PREFIX}/${randomBytes}/${fileName}`;
  }

  const s3Params = {
    Bucket: process.env.AWS_S3_FILES_BUCKET,
    Key: wholeFilePath,
    Expires: 3600,
    ContentType: fileType,
    ACL: "public-read"
  };

  s3.getSignedUrl("putObject", s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    const obj = data;
    const returnData = {
      s3Signature: obj,
      url: wholeFilePath
    };

    res.status(200).json(returnData);
  });
}

export default {
  upload,
  s3Signature
};

import mongoose from "mongoose";
import bodyParser from "body-parser";
import bluebird from "bluebird";
import morgan from "morgan";
import compression from "compression";
import cors from "cors";
import methodOverride from "method-override";

function setup(app) {
  mongoose.Promise = bluebird;

  app.use(cors());
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(methodOverride("_method"));

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }
}

export default {
  setup
};

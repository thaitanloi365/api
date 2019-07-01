import mongoose from "mongoose";

function setup() {
  let mongoDatabase = process.env.MONGODB_URI_DEV;
  if (process.env.NODE_ENV === "production") {
    mongoDatabase = process.env.MONGODB_URI;
  }

  mongoose.connect(mongoDatabase, { useNewUrlParser: true, useCreateIndex: true });
  mongoose.connection.on("error", () => {
    console.log("MongoDB Connection Error. Please make sure that MongoDB is running.");
    process.exit(1);
  });
}

export default {
  setup
};

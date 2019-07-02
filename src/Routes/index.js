import { User } from "@Models";
import UserRoutes from "./App/UserRoutes";
import ItemRoutes from "./App/ItemRoutes";

import Auth from "@Auth";
import AWS from "@AWS";

function setup(app) {
  /*
   * Attach routes
   */
  app.use("/api/user", UserRoutes);
  app.use("/api/item", ItemRoutes);

  /**
   * Attach Admin portal module
   */
  // admin.setUser(User);
  // app.use("/api/admin", admin.router);

  /**
   * Attach Auth module
   */
  Auth.setUser(User);
  app.use("/api", Auth.router);

  /**
   * Attach AWS signature endpoint
   */
  app.use("/api", AWS.router);

  /**
   * Validation errors
   */
  app.use((err, req, res, next) => {
    if (err.name == "ValidationError") {
      let errors = [];
      Object.keys(err.errors).forEach(key => {
        const { message = "Internal Error", value = "Unknown" } = err.errors[key];
        errors.push({ message, value });
      });
      if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == "test") {
        console.log("ValidationError: ", JSON.stringify(errors));
      }
      res.status(422).json({ error: errors[0].message, data: null, code: 422 });
      return;
    }
    next(err);
  });

  /**
   * Error handling -- Production
   */
  if (process.env.NODE_ENV === "production") {
    app.use((err, req, res, next) => {
      // treat as 404
      if (err.message && (~err.message.indexOf("not found") || ~err.message.indexOf("Cast to ObjectId failed"))) {
        next();
        return;
      }
      // error page
      res.status(500).json({ errors: err.errors });
    });
  }
}

export default {
  setup
};

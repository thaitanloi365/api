const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("@Docs");

function setup(app) {
  if (process.env.NODE_ENV === "production") {
    swaggerDocument.host = "lapi-test.herokuapp.com";
  }

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

export default {
  setup
};

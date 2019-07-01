const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("@Docs");

function setup(app) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

export default {
  setup
};

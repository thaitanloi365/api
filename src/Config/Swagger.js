import swaggerUi from "swagger-ui-express";
import swaggerDocument from "@Docs";
import path from "path";

function setup(app) {
  const docPath = __dirname + "/../Docs";

  if (process.env.NODE_ENV === "production") {
    swaggerDocument.host = "lapi-test.herokuapp.com";
    swaggerDocument.schemes = ["https", "http"];
  }

  const options = {
    customCss: ".swagger-ui .topbar { display: none }"
  };

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

  app.get("/redoc", (req, res) => {
    res.sendFile(path.resolve(docPath, "doc.html"));
  });

  app.get("/redoc/doc.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocument);
  });
}

export default {
  setup
};

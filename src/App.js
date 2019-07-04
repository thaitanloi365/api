import "./Environment/env";
import express from "express";

import { Database, Middleware, Port, Swagger } from "@Config";
import Routes from "@Routes";

const app = express();

Database.setup();

Middleware.setup(app);

Routes.setup(app);

Port.setup(app);

Swagger.setup(app);

app.use("/", function(req, res, next) {
  res.write("Home Page");
  res.end();
});
export default app;

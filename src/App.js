import "./Enviroment/env";
import express from "express";

import { Database, Middleware, Port } from "@Config";
import Routes from "@Routes";

const app = express();

Database.setup();

Middleware.setup(app);

Routes.setup(app);

Port.setup(app);

// app.use("/", (req, res) => {
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.write("Home page");
//   res.end();
// });

export default app;

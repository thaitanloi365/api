import "./Enviroment/env";
import express from "express";

import { Database, Middleware, Port, Swagger } from "@Config";
import Routes from "@Routes";

const app = express();

Database.setup();

Middleware.setup(app);

Routes.setup(app);

Port.setup(app);

Swagger.setup(app);

export default app;

import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";

import loggerMiddleware from "./routes/middleware/logger-middleware.js"
import authRoutes from "./routes/auth-routes.js";
import noAuthRoutes from "./routes/noauth-routes.js";
import responseFormatter from "./routes/middleware/return-messages-middleware.js"

const app = express();

// app.use(function(req, res, next) {
	//   res.header("Access-Control-Allow-Origin", "*");
	//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	//   next();
	// });
	
app.use(bodyParser.json());
app.use(helmet());
app.use(responseFormatter);

app.use(loggerMiddleware)// Middleware de logging

// Rotas que não necesistam autenticação
app.use( noAuthRoutes );
// Rotas que necessitam autenticação
app.use( authRoutes );

export default app;

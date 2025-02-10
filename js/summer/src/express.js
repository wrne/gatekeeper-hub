import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";

import loggerMiddleware from "./middleware/logger-middleware.js"
import privateRoutes from "./routes/private-routes.js";
import publicRoutes from "./routes/public-routes.js";
import responseFormatter from "./middleware/return-messages-middleware.js"

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
app.use( publicRoutes );
// Rotas que necessitam autenticação
app.use( privateRoutes );

export default app;

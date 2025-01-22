import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json"  with { type: 'json' };;

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
app.use(responseFormatter);
app.use(helmet());

// Rota para a documentação da API
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas que não necesistam autenticação
app.use( noAuthRoutes );
// Rotas que necessitam autenticação
app.use( authRoutes );

export default app;

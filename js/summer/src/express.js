import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import authRoutes from "./routes/auth-routes.js";
import noAuthRoutes from "./routes/noauth-routes.js";
import responseFormatter from "./middleware/return-messages-middleware.js"

const app = express();

// app.use(function(req, res, next) {
	//   res.header("Access-Control-Allow-Origin", "*");
	//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	//   next();
	// });
	
app.use(bodyParser.json());
app.use(responseFormatter);
app.use(helmet());

app.use('/', noAuthRoutes);
app.use('/a', authRoutes);

export default app;

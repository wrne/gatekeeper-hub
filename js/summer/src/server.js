import app from "./express.js";
import http from "http";

const port = process.env.port || 3000;

// Define variável global para definir configurações da fila de mensagens
process.summer = {
	exchanges: {
		QUEUE_ORDERS : 'orders_teste'
	}
}

http.createServer(app).listen(port, function () {
	console.log(`Servidor escutando na porta: ${port}`);
});


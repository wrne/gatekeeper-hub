import app from "./express.js";
import http from "http";

// Verifica se possui o argumento de modo na chamada do app
const developmentMode = process.argv.includes("--dev-mode");
const port = process.env.port || 3000;


// Define variável global para definir configurações da fila de mensagens
process.summer = {
	exchanges: {
		QUEUE_ORDERS : 'orders_teste'
	},
	MODE: (developmentMode ? 'development' : 'production')
}

http.createServer(app).listen(port, function () {
	console.log(`Servidor escutando na porta: ${port}`);
});


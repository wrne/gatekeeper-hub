import app from "./express.js";
import http from "http";
import webhooks from "./webhooks.js";

// Verifica se possui o argumento de modo na chamada do app
const developmentMode = process.argv.includes("--dev-mode");
const port = process.env.port || 3000;


// Define variável global para definir configurações da fila de mensagens
process.gatekeeper_hub = {
	exchanges: {
		farmi : 'farmi'
	},
	MODE: (developmentMode ? 'development' : 'production')
}

http.createServer(app).listen(port, function () {
	console.log(`
  ____  _   _  ____ ____  ____  
 |  _ \\| | | |/ ___|  _ \\/ ___| 
 | |_) | | | | |   | |_) \\___ \\ 
 |  __/| |_| | |___|  _ < ___) |
 |_|    \\___/ \\____|_| \\_\\____/ 
                                
                                                      V 0.0.1: ${process.gatekeeper_hub.MODE} mode`);
	
	console.log(`Servidor escutando na porta: ${port}`);
	webhooks() //Ativa os webhooks de integração vindos do Protheus

});


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
    ____ ____   _    ____     ____                      _        
  / ___/ ___|  / \\  | __ )   / ___|___  _ __   ___  ___| |_ __ _ 
 | |  | |     / _ \\ |  _ \\  | |   / _ \\| '_ \\ / _ \\/ __| __/ _\` |
 | |__| |___ / ___ \\| |_) | | |__| (_) | | | |  __/ (__| || (_| |
  \\____\\____/_/   \\_\\____/   \\____\\___/|_| |_|\\___|\\___|\\__\\__,_|
                                                      V 0.0.1: ${process.gatekeeper_hub.MODE} mode`);
	
	console.log(`Servidor escutando na porta: ${port}`);
	webhooks() //Ativa os webhooks de integração vindos do Protheus

});


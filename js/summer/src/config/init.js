import dbConn from "../infra/db/database-connection.js"
import amqp from "amqplib/callback_api.js"
import UserControl from '../controllers/auth/login-controllers.js'


async function createNewAdm() {

	const newPwd = process.env.SUMMER_ADM_PWD || 'sUmw3r@2025'
	const defaultUser = {
		login: 'admin',
		name: 'Admin',
		password: newPwd
	}

	UserControl.newUser(defaultUser);
}


/**
 * Função responsável por criar a tabela de usuários de integração.
 * Deve ser executada na implementação do projeto através do comando "npm run init_env"
 * 
 */
async function createTable() {

	const db = new dbConn();

	const createTableUsersStt = `create table [summer_users]
	(
		id       UNIQUEIDENTIFIER primary key,
		login	 varchar(40) not null unique,
		name     varchar(60) not null,
		password VARCHAR(161) not null
	)
	`

	// const extendedPropertyStt = `exec sp_addextendedproperty 'MS_Description', N'Usuários de integração CCAB', 'SCHEMA', 'dbo', 'TABLE', 'summer_users'`

	const createIndexStt = `
	create unique index [summer_users_id_uindex]
	on [summer_users] (id)
	`


	await db.exec(createTableUsersStt);
	// await db.exec(extendedPropertyStt);
	await db.exec(createIndexStt);
	// await db.exec(addConstraintStt);

	await createNewAdm()
}

/**
 * Função que cria a estrutura de fila no RabbitMQ.
 * No formato atual um Exchange de pedidos é criado. Ele deve ser durável para que mesmo que não haja subscriber ativo as mensagens não sejam perdidas.
 * O exchange de pedidos possui duas rotas: "agrega" e "simulador" para indicar as filas correspondentes e tratamento adequado para cada uma.
 */
async function createQueuesStructure() {


	// Exchange de novos pedidos
	const EXCHANGE_NAME = 'orders_teste';
	const bindindRouting = [
		{
			// Binding da fila dos pedidos da Agrega
			queue: "orders_agrega",
			routingKey: "agrega"
		},
		{
			// Binding da fila dos pedidos do Simulador
			queue: "orders_simulador",
			routingKey: "simulador"
		}
	]

	const amqpConnString = `amqp://${process.env.QUEUE_USER}:${process.env.QUEUE_PWD}@${process.env.QUEUE_HOST}`
	amqp.connect(amqpConnString, (err, connection) => {

		if (err) {
			console.error('Erro ao conectar ao RabbitMQ:', err);
			process.exit(1);
		}

		connection.createChannel((err, channel) => {
			if (err) {
				console.error('Erro ao criar o canal:', err);
				process.exit(1);
			}

			// Declarar um exchange durável
			channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });

			// Binding das filas às RoutingKeys
			bindindRouting.forEach((binding) => {

				// Declarar uma fila durável
				channel.assertQueue(binding.queue, { durable: true });

				// Ligar a fila ao exchange
				channel.bindQueue(binding.queue, EXCHANGE_NAME, binding.routingKey);

			})

			console.log(`MessageBroker conectado e exchange "${EXCHANGE_NAME}" configurado.`);
		});
	});
}


createTable();
createQueuesStructure();

setTimeout(function () {
	process.exit(0);
}, 1000);
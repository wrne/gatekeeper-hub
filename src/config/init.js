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
 * Função que cria as views: 
 * - Saldo de limite atual do crédito
 * - Tabelas de Preço ativas
 */
async function createViews() {

	const db = new dbConn();

	// ----------------------------------------------------------------------
	// View de saldo de limite atual do crédito
	// ----------------------------------------------------------------------
	let createViewStt = `
	create or alter View Credit_actualLimit  As
	select ZZH_GRPVEN GRUPO_ECONOMICO, ZZH_SAFRA SAFRA, iif(ZZH_MOEDLC=1, 'BRL','USD') MOEDA, ZZH_SLDDUP DUPLICATAS, ZZH_SLDPED PEDIDOS_PENDENTES,
	              iif(ZZH_LIMDIS + ZZH_LIMCLE > ZZH_LIMPOT,ZZH_LIMPOT,ZZH_LIMDIS + ZZH_LIMCLE)
	                  +iif(ZZH_LIMMAN>0 And ZZH_VIGTMP>Convert(VARCHAR(8),getDate(),112),ZZH_LIMMAN,0 )
	                  - ZZH_SLDDUP
	                  - ZZH_SLDPED SALDO_LIMITE_ATUAL
	  from ZZH010
	 where D_E_L_E_T_ = ''
	   and ZZH_SAFRA <> ''
	   and ZZH_MSBLQL <> '1';
	`

	await db.exec(createViewStt);
	
	// ----------------------------------------------------------------------
	// View de tabelas de preço ativas
	// ----------------------------------------------------------------------
	createViewStt = `
	create or alter view active_price_tables as
	select DA0_CODTAB CODIGO_TABELA, DA0_DESCRI DESCRICAO, DA0_XSAFRA SAFRA
	  from DA0010 DA0
	 where DA0.D_E_L_E_T_ = ''
	   and Convert(Varchar(8), getdate(), 112) between DA0_DATDE And DA0_DATATE
	   and Convert(Varchar(8), getdate(), 112) between DA0_XDECAR And DA0_XATECA
	   and DA0_ATIVO = '1'
	`

	await db.exec(createViewStt);

	
}	

/**
 * Função que cria a estrutura de fila no RabbitMQ.
 * No formato atual um Exchange de pedidos é criado. Ele deve ser durável para que mesmo que não haja subscriber ativo as mensagens não sejam perdidas.
 * O exchange de pedidos possui duas rotas: "agrega" e "simulador" para indicar as filas correspondentes e tratamento adequado para cada uma.
 */
async function createQueuesStructure() {


	// Exchange de novos pedidos
	const exchangesDefault = [
		{
			name: 'orders_teste',
			bindindRouting: [
				{
					// Binding da fila dos pedidos da Agrega
					queue: "agrega_orders",
					routingKey: "agrega_orders"
				},
				{
					// Binding da fila dos pedidos do Simulador
					queue: "agrega_payments",
					routingKey: "agrega_payments"
				}
			]
		}
	]
	

	const amqpConnString = `amqp://${process.env.QUEUE_USER}:${process.env.QUEUE_PWD}@${process.env.QUEUE_HOST}`
	amqp.connect(amqpConnString, (err, connection) => {
		
		if (err) {
			console.error('Erro ao conectar ao RabbitMQ:', err);
			process.exit(1);
		}

		console.log(`RabbitMQ| MessageBroker conectado.`);
		
		connection.createChannel((err, channel) => {
			if (err) {
				console.error('Erro ao criar o canal:', err);
				process.exit(1);
			}
			
			console.log(`RabbitMQ| Channel criado.`);

			exchangesDefault.forEach((exchange) => {
				
				// Declarar um exchange durável
				channel.assertExchange(exchange.name, 'direct', { durable: true });
	
				// Binding das filas às RoutingKeys
				exchange.bindindRouting.forEach((binding) => {
	
					// Declarar uma fila durável
					channel.assertQueue(binding.queue, { durable: true });
	
					// Ligar a fila ao exchange
					channel.bindQueue(binding.queue, exchange.name, binding.routingKey);
	
					console.log(`RabbitMQ| Exchange "${exchange.name}" configurado com a rota ${binding.routingKey}.`);
				})
			})

		});
	});
}


createTable();
createViews();
createQueuesStructure();

setTimeout(function () {
	process.exit(0);
}, 1000);
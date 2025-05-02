import dbConn from "../infra/db/database-connection.js"
import UserControl from '../controllers/auth/login-controllers.js'
import {createQueuesStructure} from "./init-queues.js";


async function createNewAdm() {

	const newPwd = process.env.CONECTA_ADM_PWD || 'sUmw3r@2025'
	const defaultUser = {
		login: 'admin',
		name: 'Admin',
		password: newPwd,
		role: 'admin'
	}

	console.log('BD| Criando admnin...');
	UserControl.newUser(defaultUser);
}


/**
 * Função responsável por criar a tabela de usuários de integração.
 * Deve ser executada na implementação do projeto através do comando "npm run init_env"
 * 
 */
async function createTable() {

	const db = new dbConn();

	const createTableUsersStt = `create table [ccab_conecta_users]
	(
		id       UNIQUEIDENTIFIER primary key,
		login	 varchar(40) not null unique,
		name     varchar(60) not null,
		password VARCHAR(161) not null,
		role 	 VARCHAR(10) not null,
	)
	`

	// const extendedPropertyStt = `exec sp_addextendedproperty 'MS_Description', N'Usuários de integração CCAB', 'SCHEMA', 'dbo', 'TABLE', 'ccab_conecta_users'`

	const createIndexStt = `
	create unique index [ccab_conecta_users_id_uindex]
	on [ccab_conecta_users] (id)
	`


	console.log('BD| Criando tabela de usuários de integração...');
	await db.exec(createTableUsersStt);
	
	// await db.exec(extendedPropertyStt);
	console.log('BD| Criando índice da tabela de usuários de integração...');
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
	select ZZH_GRPVEN GRUPO_ECONOMICO, ZZH_SAFRA SAFRA, iif(ZZH_MOEDLC=1, 'BRL','USD') MOEDA, ZZH_SLDDUP + ZZH_SLDPED TOTAL_CONSUMIDO,
			ZZH_LIMPOT LIMITE_TOTAL,
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

	console.log('BD| Criando views necessárias...');
	await db.exec(createViewStt);

	
}

createTable();
createViews();
createQueuesStructure();

setTimeout(function () {
	process.exit(0);
}, 1000);
import dbConn from "../db/database-connection.js"

const db = new dbConn();




async function createTable(){

	const createTableUsersStt = `create table [summer_users]
	(
		id       UNIQUEIDENTIFIER primary key,
		login	 varchar(40) not null unique,
		name     varchar(60) not null,
		password VARCHAR(161) not null
	)
	`
	
	const extendedPropertyStt = `exec sp_addextendedproperty 'MS_Description', N'Usuários de integração CCAB', 'SCHEMA', 'dbo', 'TABLE', 'summer_users'`
	
	const createIndexStt = `
	create unique index [summer_users_id_uindex]
	on [summer_users] (id)
	`
	

	await db.exec(createTableUsersStt);
	// await db.exec(extendedPropertyStt);
	await db.exec(createIndexStt);
	// await db.exec(addConstraintStt);
}

createTable();
import { v4 as uuidv4 } from 'uuid';
import dbConn from "../../infra/db/database-connection.js"
import {buildHashPwdAndSalt,validPassword,gerarTokenJWT} from "../../utils/auth-utils.js"
import { logMessage } from '../../utils/log-generator.js';

const db = new dbConn();

async function newUser({login, password, name, role}){
	
	const uudi = uuidv4()
	const { salt, hash } = buildHashPwdAndSalt(password);

	// console.log(`salt: ${salt} || hash: ${hash}`);

	const insertNewUserStt = `insert into gatekeeper_hub_users(id, login, name, password, role) values ('${uudi}','${login}', '${name}','${hash}:${salt}', '${role}' )`
	
	return await db.exec(insertNewUserStt) 

}

async function authUser({login, password}){

	const queryStt = `Select password from gatekeeper_hub_users where login = '${login}'`
	const rsHashAndSalt = await db.query(queryStt);
	
	if (!rsHashAndSalt || rsHashAndSalt.length < 1){
		
		throw new Error("User not found");
		
	}

	const [hash,salt] = rsHashAndSalt[0].password.split(':')
	// console.log(`obtido: salt: ${salt} || hash: ${hash}`);
	
	const isValidPassword = validPassword(password, salt, hash)
	
	if (!isValidPassword){

		throw new Error("Password incorrect");
		
	}

	logMessage(`User autenticated: ${login}`);
	
	return gerarTokenJWT({login})
		
	
}

export default {newUser, authUser}


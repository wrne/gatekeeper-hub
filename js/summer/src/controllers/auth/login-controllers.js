import { v4 as uuidv4 } from 'uuid';
import dbConn from "../../infra/db/database-connection.js"
import AuthUtils from "../../utils/auth-utils.js"
import { logMessage } from '../../utils/log-generator.js';

const db = new dbConn();

function newUser({login, password, name}){
	
	const uudi = uuidv4()
	const { salt, hash } = AuthUtils.buildHashPwdAndSalt(password);

	// console.log(`salt: ${salt} || hash: ${hash}`);

	const insertNewUserStt = `insert into summer_users(id, login, name, password) values ('${uudi}','${login}', '${name}','${hash}:${salt}' )`
	return db.exec(insertNewUserStt) > 0

}

async function authUser({login, password}){

	const queryStt = `Select password from summer_users where login = '${login}'`
	const rsHashAndSalt = await db.query(queryStt);
	
	if (!!rsHashAndSalt && rsHashAndSalt.length > 0){

		const [hash,salt] = rsHashAndSalt[0].password.split(':')
		// console.log(`obtido: salt: ${salt} || hash: ${hash}`);
		
		const isValidPassword = AuthUtils.validPassword(password, salt, hash)
		
		if (!isValidPassword){

			throw new Error("Password incorrect");
			
		}

		logMessage(`User autenticated: ${login}`);
		
		return AuthUtils.gerarTokenJWT({login})
		
	}
	
}

export default {newUser, authUser}


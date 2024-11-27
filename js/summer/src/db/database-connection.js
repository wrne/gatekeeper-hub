import sql from "mssql"
import "dotenv/config"

class dbConn {

	constructor(){
		
		this.sqlConfig = {
			user: process.env.DB_USER,
			password: process.env.DB_PWD,
			database: process.env.DB_NAME,
			server: process.env.DB_HOST,
			pool: {
			  max: 10,
			  min: 0,
			  idleTimeoutMillis: 1000
			},
			options: {
			  trustServerCertificate: true // change to true for local dev / self-signed certs
			}
		}
		
	}

	async query(queryStt) {
		if (!this.pool)
			this.pool = await sql.connect(this.sqlConfig)

		console.log(`query: ${queryStt}`);
		
		const result = await this.pool.request().query(queryStt /*,(err, rs)=>{
		
			console.log("rs")
			console.log(rs)
			return rs?.recordset//.forEach(task => task);
			
		}*/)
		

		// if (!result.recordset){
		// 	// tasklist = []
		// } else {
		// 	for (let index = 0; index < result.recordset.length; index++) {
		// 		const element = result.recordset[index];
				
		// 		const newTask = new TaskData(element.finish,element.description,element.done)
		// 		newTask.id = element.id
	
		// 		tasklist.push(newTask)
		// 	}
		// }

		// // Tratar formato do resultset para a lista de tarefas
		return result.recordset
	}
	
	async exec(execStt) {

		if (!this.pool)
			this.pool = await sql.connect(this.sqlConfig)

		await this.pool.request().query(execStt,(err, rs)=>{

			if (!!err){
				console.log(err)
			}

			console.log(`Successful. Rows affected: ${rs?.rowsAffected}`)

			return true

		})

		return false
	}
	
}

export default dbConn
import sql from "mssql"
import "dotenv/config"
import { logError } from "../../utils/log-generator.js"

class dbConn {

	constructor() {

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

		// console.log(`query: ${queryStt}`);

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

	async pagedQuery(fields, table, where, orderBy, pageNumber, pageSize) {

		if (!this.pool)
			this.pool = await sql.connect(this.sqlConfig)

		const request = this.pool.request()

		const fieldsStt = fields.map(f => `${f}`).join(', ')
		let whereStt = '1=1'

		request.input('pageNumber', sql.Int, pageNumber)
		request.input('pageSize', sql.Int, pageSize)

		if (where) {

			// Tratamento contra SQL Injection das condições enviadas no parametro 'Where' 
			const whereArr = Object.entries(where)
			whereStt = whereArr
				.map(condition => {
					const [prop, value] = condition
					request.input(prop, sql.VarChar, value)
					return `${prop} = @${prop}`

				})
				.join(' AND ')
		}

		if (!orderBy)
			orderBy = '1'

		const query = `
			SELECT ${fieldsStt}
			FROM ${table}
			WHERE ${whereStt}
			ORDER BY ${orderBy}
		    OFFSET @pageSize * (@pageNumber - 1) ROWS
			FETCH NEXT @pageSize ROWS ONLY
		`

		console.log(`Query: ${query}`);

		const result = await request.query(query)

		return result.recordset

	}

	async exec(execStt) {

		if (!this.pool)
			this.pool = await sql.connect(this.sqlConfig)

		await this.pool.request().query(execStt, (err, rs) => {

			if (!!err) {
				logError(err)
				throw new Error(err);

			}

			console.log(`Successful. Regs affected: ${rs?.rowsAffected}`)

			return rs?.rowsAffected

		})

	}

}

export default dbConn
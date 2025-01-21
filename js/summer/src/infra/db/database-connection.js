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

	async query(queryStt, params = {}) {
		if (!this.pool)
			this.pool = await sql.connect(this.sqlConfig)

		const request = this.pool.request()


		const { where = [], pageNumber = 1, pageSize = 10, paged = false } = params

		const whereArr = Object.entries(where)
		const isThereWhere = !!where && whereArr.length > 0


		if (isThereWhere) {

			// Tratamento contra SQL Injection das condições enviadas no parametro 'Where' 

			whereArr.forEach(condition => {

				const [prop, value] = condition
				request.input(prop, sql.VarChar, value)

			})
		}

		// Caso queira paginar a query
		let pagedStt = ''
		if (paged) {

			request.input('pageNumber', sql.Int, pageNumber)
			request.input('pageSize', sql.Int, pageSize)
			pagedStt =
				`OFFSET @pageSize * (@pageNumber - 1) ROWS
			FETCH NEXT @pageSize ROWS ONLY`
		}


		queryStt += pagedStt

		const result = await this.pool.request().query(queryStt /*,(err, rs)=>{
		
			console.log("rs")
			console.log(rs)
			return rs?.recordset//.forEach(task => task);
			
		}*/)


		// // Tratar formato do resultset para a lista de tarefas
		return result.recordset
	}

	/**
	 * Consulta paginada no banco. 
	 * 
	 * Samples:
	 * 
	 * @param {Array<String>} fields - Array com os campos buscados: ["A1_COD", "A1_NOME", "A1_CGC"] 
	 * @param {string} table - tabela usada na clásula from: "SA1010" 
	 * @param {Array<object>} join - Array de Objetos contendo as tabelas,campos e valores para join. 
	 * @param {string} join.table - Tabela de junção: "SA3010"
	 * @param {string} join.type - Tipo de junção: "inner"
	 * @param {string} join.on - Objeto contendo as condições do join: {A3_COD: 'A1_COD'}
	 * @param {object} where - Contém um objeto contendo os campos e valores buscados: {A1_COD: '0001', A1_NOME: 'Fulano'}
	 * @param {string} orderBy - Campo usado para ordenação: "A1_COD" 
	 * @param {integer} pageNumber - Pagina da query 
	 * @param {integer} pageSize - Tamanho da página 
	 * @returns 
	 */
	async buildQuery({ fields, table, join, where, orderBy, pageNumber = 1, pageSize = 10, paged = true }) {

		const whereArr = Object.entries(where)
		const isThereWhere = !!where && whereArr.length > 0

		if (!this.pool)
			this.pool = await sql.connect(this.sqlConfig)

		const request = this.pool.request()

		const fieldsStt = fields.map(f => `${f}`).join(', ')
		let joinStt = ''

		if (join instanceof Array)
			join.forEach(aJoin => {

				if (!!aJoin && !!aJoin.table && !!aJoin.on) {
					const type = !!aJoin.type ? aJoin.type : 'inner'

					joinStt = ` ${type} JOIN ${aJoin.table} ON `

					const onArr = Object.entries(aJoin.on)
					joinStt += onArr.map(([key, value]) => `${key} = ${value}`).join(' AND ')

				}
			})

		let pagedStt = ''
		if (paged) {
			request.input('pageNumber', sql.Int, pageNumber)
			request.input('pageSize', sql.Int, pageSize)
			pagedStt =
				`OFFSET @pageSize * (@pageNumber - 1) ROWS
			FETCH NEXT @pageSize ROWS ONLY`
		}

		let whereStt = ''
		if (isThereWhere) {

			// Tratamento contra SQL Injection das condições enviadas no parametro 'Where' 

			whereStt = whereArr
				.map(condition => {
					const [prop, value] = condition
					request.input(prop, sql.VarChar, value)
					return `${table}.${prop} = @${prop}`

				})
				.join(' AND ')
		}

		if (!orderBy)
			orderBy = '1'

		const query = `
			SELECT ${fieldsStt}
			FROM ${table}
			${(joinStt.trim() === '' ? '' : joinStt)}
			${(isThereWhere ? `WHERE ${whereStt}` : '')}
			ORDER BY ${table}.${orderBy}
		    ${pagedStt}
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
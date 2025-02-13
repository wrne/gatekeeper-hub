/**
 * Retorna uma data qualquer no formato YYYYMMDD, formato utilizado pelo Protheus
 * @param {Date} date data que deseja formatar
 * @returns 
 */
export function ProtheusDate(date){
	return date.toISOString().slice(0, 10).replace(/-/g, "")
}
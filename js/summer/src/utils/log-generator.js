function logError(errorMessage, error){

	const reqDate = new Date()		
	console.error(`${reqDate.toISOString()}: ${errorMessage}|\n${error.stack}`);

}

function logMessage(message){

	const reqDate = new Date()
	console.info(`${reqDate.toISOString()}: ${message}`);

}

export {logError, logMessage}
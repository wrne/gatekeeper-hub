function logError(errorMessage, error){

	const reqDate = new Date().toLocaleString()		
	console.error(`${reqDate}: ${errorMessage}\n${error.stack}`);

}

function logMessage(message){

	const reqDate = new Date().toLocaleString()	
	console.info(`${reqDate}: ${message}`);

}

export {logError, logMessage}
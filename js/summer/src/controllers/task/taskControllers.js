import publish from "../../queue/queue-manager.js"

function newTask(routingKey,task){
	
	publish('orders_teste',routingKey,task)

}

export default {newTask}


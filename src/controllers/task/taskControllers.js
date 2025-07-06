import {publish} from "../../infra/queue/queue-manager.js"

function newTask(routingKey,task){
	
	publish(process.gatekeeper_hub.exchanges.QUEUE_ORDERS,routingKey,task)

}

export default {newTask}


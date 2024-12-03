import amqp from "amqplib/callback_api.js"

export default function publish(exchange, routingKey, message) {

	const amqpConnString = `amqp://${process.env.QUEUE_USER}:${process.env.QUEUE_PWD}@${process.env.QUEUE_HOST}`
	// console.log(`Connetion String with AMQP: amqp://${process.env.QUEUE_USER}:${process.env.QUEUE_PWD}@${process.env.QUEUE_HOST}`);

	amqp.connect(amqpConnString, function (error0, connection) {
		if (error0) {
			throw error0;
		}

		console.log(`Connected with AMQP service at ${process.env.QUEUE_HOST}`);
		connection.createChannel(function (error1, channel) {
			if (error1) {
				throw error1;
			}

			// channel.assertExchange(exchange, 'fanout', {
			// 	durable: true
			// });

			channel.publish(
				exchange,
				routingKey,
				Buffer.from(JSON.stringify(message)),
				{ persistent: true } // Marca a mensagem como persistente
			);

			console.log(" [x] Sent %s", JSON.stringify(message));
		});

	});

}
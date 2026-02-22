import amqp, {Channel, ChannelModel} from 'amqplib';

class RabbitMQClient {
	private connection: ChannelModel | null = null;
	private channel: Channel | null = null;

	async connect() {
		try {
			this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
			this.channel = await this.connection.createChannel();
			console.log('Connected to RabbitMQ');
		} catch (error) {
			console.error('Failed to connect to RabbitMQ:', error);
			throw error;
		}
	}

	async declareExchange(name: string, type: string = 'topic') {
		if (!this.channel) throw new Error('Channel not initialized');
		await this.channel.assertExchange(name, type, {durable: true});
	}

	async declareQueue(name: string) {
		if (!this.channel) throw new Error('Channel not initialized');
		await this.channel.assertQueue(name, {durable: true});
	}

	async bindQueue(queue: string, exchange: string, pattern: string) {
		if (!this.channel) throw new Error('Channel not initialized');
		await this.channel.bindQueue(queue, exchange, pattern);
	}

	async publish(exchange: string, routingKey: string, message: unknown) {
		if (!this.channel) throw new Error('Channel not initialized');
		this.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), {
			persistent: true,
		});
	}

	async consume(queue: string, callback: (msg: unknown) => Promise<void>) {
		if (!this.channel) throw new Error('Channel not initialized');
		await this.channel.consume(queue, async (msg) => {
			if (msg) {
				try {
					const content = JSON.parse(msg.content.toString());
					await callback(content);
					this.channel?.ack(msg);
				} catch (error) {
					console.error('Error processing message:', error);
					this.channel?.nack(msg, false, true);
				}
			}
		});
	}

	async disconnect() {
		await this.channel?.close();
		await this.connection?.close();
		console.log('Disconnected from RabbitMQ');
	}
}

export const rabbitMQ = new RabbitMQClient();

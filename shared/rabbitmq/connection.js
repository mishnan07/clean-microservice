const amqp = require('amqplib');

class RabbitMQConnection {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
      this.channel = await this.connection.createChannel();
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('RabbitMQ connection error:', error);
      throw error;
    }
  }

  async publish(queue, message) {
    if (!this.channel) await this.connect();
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  }

  async consume(queue, callback) {
    if (!this.channel) await this.connect();
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.consume(queue, (msg) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        callback(content);
        this.channel.ack(msg);
      }
    });
  }

  async close() {
    if (this.connection) {
      await this.connection.close();
    }
  }
}

module.exports = new RabbitMQConnection();
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import { envVars } from 'src/common/envs';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    const rabbitMqConnection = envVars.RABBITMQ_URI;
    try {
      this.connection = await amqp.connect(rabbitMqConnection);
      this.channel = await this.connection.createChannel();
    } catch (error) {
      console.error('Failed to connect to RabbitMQ', error);
    }
  }

  private async disconnect() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log('Disconnected from RabbitMQ');
    } catch (error) {
      console.error('Failed to disconnect from RabbitMQ', error);
    }
  }

  async sendToQueue(queue: string, message: any) {
    if (!this.channel) {
      console.error('RabbitMQ channel is not initialized');
      return;
    }
    const messageBuffer = Buffer.from(JSON.stringify(message));
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, messageBuffer);
    console.log(`Message sent to queue ${queue}:`, message);
  }

  async consume(queue: string, callback: (msg: amqp.Message) => void) {
    if (!this.channel) {
      console.error('RabbitMQ channel is not initialized');
      return;
    }
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.consume(queue, (msg) => {
      if (msg) {
        callback(msg);
        this.channel.ack(msg);
      }
    });
  }
}

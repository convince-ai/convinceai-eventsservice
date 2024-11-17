import * as dotenv from 'dotenv';

dotenv.config();

export type environmentTypes = 'prod' | 'hmlg' | 'dev';

export const envVars: {
  HOST: string;
  PORT: number;
  ENV: environmentTypes;
  QUEUE: string;
  RABBITMQ_USER: string;
  RABBITMQ_PASS: string;
  RABBITMQ_HOST: string;
  RABBITMQ_PORT: number;
} = {
  HOST: process.env.HOST,
  PORT: +process.env.PORT,
  ENV: process.env.ENV as environmentTypes,
  QUEUE: process.env.QUEUE,
  RABBITMQ_USER: process.env.RABBITMQ_DEFAULT_USER,
  RABBITMQ_PASS: process.env.RABBITMQ_DEFAULT_PASS,
  RABBITMQ_HOST: process.env.RABBITMQ_HOST,
  RABBITMQ_PORT: +process.env.RABBITMQ_PORT,
};

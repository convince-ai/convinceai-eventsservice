import * as dotenv from 'dotenv';

dotenv.config();

export type environmentTypes = 'prod' | 'hmlg' | 'dev';

export const envVars: {
  HOST: string;
  PORT: number;
  ENV: environmentTypes;
  QUEUE: string;
  RABBITMQ_URI: string;
} = {
  HOST: process.env.HOST,
  PORT: +process.env.PORT,
  ENV: process.env.ENV as environmentTypes,
  QUEUE: process.env.QUEUE,
  RABBITMQ_URI: process.env.RABBITMQ_URI,
};

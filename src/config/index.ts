import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  SERVER_PORT: parseInt(String(process.env.SERVER_PORT), 10) || 3333,
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_PORT: parseInt(String(process.env.DATABASE_PORT), 10) || 5432,
  DATABASE_USER: process.env.DATABASE_USER || 'postgres',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
};

export { config };

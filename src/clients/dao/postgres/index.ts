import { Client } from 'pg';
import { config } from '../../../config';

class PostgresDB {
  protected client: Client;

  public constructor() {
    this.client = new Client({
      port: config.DATABASE_PORT,
      host: config.DATABASE_HOST,
      password: config.DATABASE_PASSWORD,
      user: config.DATABASE_USER,
      database: config.DATABASE_NAME,
    });
  }
}

export { PostgresDB };

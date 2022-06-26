import { PostgresDB } from '.';
import { User } from '../../../models';

class UsersTable extends PostgresDB {
  public async insert(user: User): Promise<boolean> {
    try {
      this.client.connect();

      const insertUserQuery = `
        INSERT INTO users (
          id,
          name,
          email,
          birthdate,
          password,
          document
        ) VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
        ) RETURNING id
    `;

      const result = await this.client.query(insertUserQuery, [
        user.id,
        user.name,
        user.email,
        user.birthdate,
        user.password,
        user.document,
      ]);

      this.client.end();

      if (result.rows.length !== 0) {
        return true;
      }

      return false;
    } catch (error) {
      this.client.end();
      throw new Error('503: service temporarily unavailable');
    }
  }

  public async list(filters: Partial<UsersTable>): Promise<boolean> {
    try {
      this.client.connect();

      const insertUserQuery = `
        SELECT * FROM users
    `;

      const result = await this.client.query(insertUserQuery, [
        user.id,
        user.name,
        user.email,
        user.birthdate,
      ]);

      this.client.end();

      if (result.rows.length !== 0) {
        return true;
      }

      return false;
    } catch (error) {
      this.client.end();
      throw new Error('503: service temporarily unavailable');
    }
  }
}

export { UsersTable };

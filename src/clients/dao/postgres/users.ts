import { PostgresDB } from '.';
import { User } from '../../../models';

class UsersTable extends PostgresDB {
  public async insert(user: User): Promise<User> {
    try {
      this.client.connect();

      const insertUserQuery = `
        INSERT INTO users (
          id,
          name,
          email,
          birthdate,
          document
        ) VALUES (
          $1,
          $2,
          $3,
          $4,
          $5
        ) RETURNING *
    `;

      const result = await this.client.query(insertUserQuery, [
        user.id,
        user.name,
        user.email,
        user.birthdate,
        user.document
      ]);

      this.client.end();

      if (result.rows.length !== 0) {
        return result.rows[0];
      }

      throw new Error('503: service temporarily unavailable');
    } catch (error) {
      this.client.end();
      throw new Error('503: service temporarily unavailable');
    }
  }

  public async list(filters: Partial<User>): Promise<User[]> {
    try {
      this.client.connect();

      const keys = Object.entries(filters);
      const conditions = [];
      const values = [];

      for (let i = 0; i < keys.length; i += 1) {
        conditions.push(`${keys[i][0]}=$${i + 1}`);
        values.push(keys[i][1]);
      }

      const query = `SELECT * FROM users${conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : ''}`;
      let result;

      if (values.length > 0) {
        result = await this.client.query(query, values);
      } else {
        result = await this.client.query(query);
      }

      this.client.end();

      const users: User[] = [];

      for (let i = 0; i < result.rows.length; i += 1) {
        users.push({
          id: result.rows[i].id,
          document: result.rows[i].document,
          email: result.rows[i].email,
          name: result.rows[i].name,
          birthdate: result.rows[i].birthdate,
        });
      }

      return users;
    } catch (error) {
      this.client.end();
      throw new Error('503: service temporarily unavailable');
    }
  }
}

export { UsersTable };

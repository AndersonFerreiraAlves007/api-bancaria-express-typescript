import { PostgresDB } from '.';
import { Transaction } from '../../../models';

class TransactionsTable extends PostgresDB {
  public async insert(transaction: Transaction): Promise<boolean> {
    try {
      this.client.connect();

      const insertTransactionQuery = `
        INSERT INTO users (
          id,
          date,
          value,
          type,
          origin_account_id,
          destination_account_id
        ) VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6
        ) RETURNING id
    `;

      const result = await this.client.query(insertTransactionQuery, [
        transaction.id,
        transaction.date,
        transaction.value,
        transaction.type,
        transaction.originAccountId,
        transaction.destinationAccountId,
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

  public async list(user: User): Promise<boolean> {
    try {
      this.client.connect();

      const insertUserQuery = `
        INSERT INTO users (
          id,
          name,
          email,
          birthdate
        ) VALUES (
          $1,
          $2,
          $3,
          $4
        ) RETURNING id
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

export { TransactionsTable };

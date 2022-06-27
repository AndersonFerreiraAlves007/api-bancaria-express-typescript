import { PostgresDB } from '.';
import { Transaction } from '../../../models';

class TransactionsTable extends PostgresDB {
  public async insert(transaction: Transaction): Promise<Transaction> {
    try {
      this.client.connect();

      const insertTransactionQuery = `
        INSERT INTO transactions (
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
        transaction.origin_account_id,
        transaction.destination_account_id,
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

  public async list(filters: Partial<Transaction>): Promise<Transaction[]> {
    try {
      this.client.connect();

      const keys = Object.entries(filters);
      const conditions = [];
      const values = [];

      for (let i = 0; i < keys.length; i += 1) {
        conditions.push(`${keys[i][0]}=$${i + 1}`);
        values.push(keys[i][1]);
      }

      const query = `SELECT * FROM transactions${conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : ''}`;
      let result;

      if (values.length > 0) {
        result = await this.client.query(query, values);
      } else {
        result = await this.client.query(query);
      }

      this.client.end();

      const transactions: Transaction[] = [];

      for (let i = 0; i < result.rows.length; i += 1) {
        transactions.push({
          id: result.rows[i].id,
          date: result.rows[i].date,
          type: result.rows[i].type,
          value: result.rows[i].value,
          origin_account_id: result.rows[i].origin_account_id,
          destination_account_id: result.rows[i].destination_account_id,
        });
      }

      return transactions;
    } catch (error) {
      this.client.end();
      throw new Error('503: service temporarily unavailable');
    }
  }
}

export { TransactionsTable };

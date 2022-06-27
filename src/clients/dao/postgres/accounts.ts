import { PostgresDB } from '.';
import { Account } from '../../../models';

class AccountsTable extends PostgresDB {
  public async insert(account: Account): Promise<Account> {
    try {
      this.client.connect();

      const insertAccountQuery = `
        INSERT INTO accounts (
          id,
          agency_number,
          agency_verification_code,
          account_number,
          account_verification_code,
          balance,
          user_id
        ) VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7
        ) RETURNING *
      `;

      const result = await this.client.query(insertAccountQuery, [
        account.id,
        account.agency_number,
        account.agency_verification_code,
        account.account_number,
        account.account_verification_code,
        account.balance,
        account.user_id,
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

  public async update(body: Partial<Account>, id: string): Promise<Account> {
    try {
      this.client.connect();

      const keys = Object.entries(body);
      const fields = [];
      const values = [];
      for (let i = 0; i < keys.length; i += 1) {
        fields.push(`${keys[i][0]}=$${i + 1}`);
        values.push(keys[i][1]);
      }
      const query = `UPDATE accounts SET ${fields.join(',')} WHERE id=$${values.length + 1} RETURNING *`;
      values.push(id);
      
      const result = await this.client.query(query, values);

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

  public async list(filters: Partial<Account>): Promise<Account[]> {
    try {
      this.client.connect();

      const keys = Object.entries(filters);
      const conditions = [];
      const values = [];

      for (let i = 0; i < keys.length; i += 1) {
        conditions.push(`${keys[i][0]}=$${i + 1}`);
        values.push(keys[i][1]);
      }

      const query = `SELECT * FROM accounts${conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : ''}`;
      let result;

      if (values.length > 0) {
        result = await this.client.query(query, values);
      } else {
        result = await this.client.query(query);
      }

      this.client.end();

      const accounts: Account[] = [];

      for (let i = 0; i < result.rows.length; i += 1) {
        accounts.push({
          id: result.rows[i].id,
          account_number: result.rows[i].account_number,
          account_verification_code: result.rows[i].account_verification_code,
          agency_number: result.rows[i].agency_number,
          agency_verification_code: result.rows[i].agency_verification_code,
          balance: result.rows[i].balance,
          user_id: result.rows[i].user_id,
        });
      }

      return accounts;
    } catch (error) {
      this.client.end();
      throw new Error('503: service temporarily unavailable');
    }
  }
}

export { AccountsTable };

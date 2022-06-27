import { PostgresDB } from '.';
import { Account, FiltersAccount } from '../../../models';

class AccountsTable extends PostgresDB {
  public async insert(account: Account): Promise<any> {
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
        ) RETURNING id
      `;

      //console.log(insertAccountQuery)

      //console.log(account)

      const result = await this.client.query(insertAccountQuery, [
        account.id,
        account.agencyNumber,
        account.agencyVerificationCode,
        account.accountNumber,
        account.accountVerificationCode,
        account.balance,
        account.userId,
      ]);

      this.client.end();

      if (result.rows.length !== 0) {
        return result.rows[0];
      }

      return null;
    } catch (error) {
      //console.log(error)
      this.client.end();
      throw new Error('503: service temporarily unavailable');
    }
  }

  public async update(body: Partial<Account>, id: number): Promise<boolean> {
    try {
      this.client.connect();

      const keys = Object.entries(body);
      const fields = [];
      const values = [];
      for (let i = 0; i < keys.length; i += 1) {
        fields.push(`${keys[i][0]}=$${i + 1}`);
        values.push(keys[i][1]);
      }
      const query = `UPDATE accounts SET ${fields.join(',')}${keys.length > 0 ? ',' : ''} WHERE id=$${values.length + 1} RETURNING *`;
      values.push(id);
      const result = await this.client.query(query, values);

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

  public async list(filters: Partial<FiltersAccount>): Promise<Account[]> {
    try {
      this.client.connect();

      console.log(filters)

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
          accountNumber: result.rows[i].account_number,
          accountVerificationCode: result.rows[i].account_verification_code,
          agencyNumber: result.rows[i].agency_number,
          agencyVerificationCode: result.rows[i].agency_verification_code,
          balance: result.rows[i].balance,
          userId: result.rows[i].user_id,
        });
      }

      return accounts;
    } catch (error) {
      console.log(error)
      this.client.end();
      throw new Error('503: service temporarily unavailable');
    }
  }
}

export { AccountsTable };

import { PostgresDB } from '.';
import { Account } from '../../../models';

class AccountsTable extends PostgresDB {
  public async insert(account: Account): Promise<boolean> {
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
          $7,
        ) RETURNING id
      `;

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
        return true;
      }

      return false;
    } catch (error) {
      this.client.end();
      throw new Error('503: service temporarily unavailable');
    }
  }

  public async update(user: User): Promise<boolean> {
    try {
      this.client.connect();

      const insertUserQuery = `
        INSERT INTO accounts (
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

  public async list(user: User): Promise<boolean> {
    try {
      this.client.connect();

      const insertUserQuery = `
        INSERT INTO accounts (
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

export { AccountsTable };

import { v4 } from 'uuid';
import { APIResponse, FiltersExtract, Extract } from '../models';
import { ExceptionTreatment } from '../utils';
import { FiltersExtractValidator } from '../validators';
import { AccountsTable } from '../clients/dao/postgres/accounts';
import { TransactionsTable } from '../clients/dao/postgres/transactions';
import { UsersTable } from '../clients/dao/postgres/users';

class GetExtractService {
  private filtersExtractValidator = FiltersExtractValidator;

  private usersTable = UsersTable;

  private accountsTable = AccountsTable;

  private transactionsTable = TransactionsTable;

  public async execute(filters: FiltersExtract): Promise<APIResponse> {
    try {
      const validUserData = new this.filtersExtractValidator(filters);

      if (validUserData.errors) {
        throw new Error(`400: ${validUserData.errors}`);
      }

      const userList = await new this.usersTable().list(validUserData.user)

      if (userList.length < 0) {
        throw new Error(`Usuário não cadastrado!`);
      }

      const user = userList[0]

      const accountList = await new this.accountsTable().list(validUserData.account)

      if (accountList.length < 0) {
        throw new Error(`Conta não cadastrada!`);
      }

      const account = accountList[0]

      const transactionExtract = await new this.transactionsTable().extract({
        destination_account_id: account.id,
        origin_account_id: account.id
      })

      const transactions = []

      for(let i = 0; i < transactionExtract.length; i++) {
        transactions.push({
          transactionId: transactionExtract[i].id,
          date: transactionExtract[i].date,
          value: transactionExtract[i].value,
          type: transactionExtract[i].type,
        })
      }

      const responseData:Extract = {
        accountNumber: account.account_number,
        accountVerificationCode: account.account_verification_code,
        agencyNumber: account.agency_number,
        agencyVerificationCode: account.agency_verification_code,
        balance: account.balance,
        birthdate: user.birthdate,
        document: user.document,
        owner: user.name,
        transactions
      }

      return {
        data: responseData,
        messages: [],
      } as APIResponse;

    } catch (error) {
      throw new ExceptionTreatment(
        error as Error,
        500,
        'an error occurred while get extract!',
      );
    }
  }
}

export { GetExtractService };

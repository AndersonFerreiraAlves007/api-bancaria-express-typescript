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

      const transactionOrigin = await new this.transactionsTable().list({
        destination_account_id: account.id
      })

      const transactionDestination = await new this.transactionsTable().list({
        origin_account_id: account.id
      })

      const transactions = []

      for(let i = 0; i < transactionOrigin.length; i++) {
        transactions.push({
          transactionId: transactionOrigin[0].id,
          date: transactionOrigin[0].date,
          value: transactionOrigin[0].value,
          type: transactionOrigin[0].type,
        })
      }

      for(let i = 0; i < transactionDestination.length; i++) {
        transactions.push({
          transactionId: transactionDestination[0].id,
          date: transactionDestination[0].date,
          value: transactionDestination[0].value,
          type: transactionDestination[0].type,
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
        'an error occurred while inserting user on database',
      );
    }
  }
}

export { GetExtractService };

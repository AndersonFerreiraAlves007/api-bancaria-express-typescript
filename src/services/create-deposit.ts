import { v4 } from 'uuid';
import { APIResponse, DepositBody, DepositResponse } from '../models';
import { 
  ExceptionTreatment, 
  TYPE_TRANSACTION_DEPOSIT, 
  TYPE_TRANSACTION_DRAFIT,
  RATE_DEPOSIT,
  RATE_DRAFT,
  TYPE_TRANSACTION_DEPOSIT_RATE
} from '../utils';
import { DepositDataValidator } from '../validators';
import { AccountsTable } from '../clients/dao/postgres/accounts';
import { TransactionsTable } from '../clients/dao/postgres/transactions';
import { UsersTable } from '../clients/dao/postgres/users';

class CreateDepositService {
  private depositDataValidator = DepositDataValidator;

  private usersTable = UsersTable;

  private accountsTable = AccountsTable;

  private transactionsTable = TransactionsTable;

  public async execute(body: DepositBody): Promise<APIResponse> {
    try {
      const validUserData = new this.depositDataValidator(body);

      if (validUserData.errors) {
        throw new Error(`400: ${validUserData.errors}`);
      }

      const userList = await new this.usersTable().list(validUserData.user)

      if (userList.length < 0) {
        throw new Error(`400: Usuário não cadastrado!`);
      }

      const user = userList[0]

      const accountList = await new this.accountsTable().list(validUserData.account)

      if (accountList.length < 0) {
        throw new Error(`400: Conta não cadastrada!`);
      }

      const account = accountList[0]

      const deposit = await new this.transactionsTable().insert({
        date: new Date(),
        destination_account_id: account.id,
        origin_account_id: null,
        type: validUserData.transaction.type || '',
        value: Number(validUserData.transaction.value || 0) * (1 - RATE_DEPOSIT),
        id: v4()
      })

      await new this.transactionsTable().insert({
        date: new Date(),
        destination_account_id: account.id,
        origin_account_id: null,
        type: TYPE_TRANSACTION_DEPOSIT_RATE,
        value: Number((validUserData.transaction.value || 0) * RATE_DEPOSIT),
        id: v4()
      })

      await new this.accountsTable().update({
        balance: Number(Number(account.balance) +  (validUserData.transaction.value || 0))
      }, account.id)

      const responseData:DepositResponse = {
        account: {
          accountNumber: account.account_number,
          accountVerificationCode: account.account_verification_code,
          agencyNumber: account.agency_number,
          agencyVerificationCode: account.agency_verification_code,
          document: user.document,
          owner: user.name,
        },
        date: deposit.date,
        transactionId: deposit.id,
        type: deposit.type,
        value: deposit.value
      }

      return {
        data: responseData,
        messages: [],
      } as APIResponse;

    } catch (error) {
      throw new ExceptionTreatment(
        error as Error,
        500,
        'an error occurred while inserting deposit on database',
      );
    }
  }
}

export { CreateDepositService };

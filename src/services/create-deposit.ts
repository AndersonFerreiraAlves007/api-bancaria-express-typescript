import { v4 } from 'uuid';
import { APIResponse, Deposit, DepositResponse } from '../models';
import { ExceptionTreatment } from '../utils';
import { DepositDataValidator } from '../validators';
import { AccountsTable } from '../clients/dao/postgres/accounts';
import { TransactionsTable } from '../clients/dao/postgres/transactions';
import { UsersTable } from '../clients/dao/postgres/users';

class CreateDepositService {
  private depositDataValidator = DepositDataValidator;

  private usersTable = UsersTable;

  private accountsTable = AccountsTable;

  private transactionsTable = TransactionsTable;

  public async execute(deposit: Deposit): Promise<APIResponse> {
    try {
      const validUserData = new this.depositDataValidator(deposit);
      console.log('deposit')
      if (validUserData.errors) {
        throw new Error(`400: ${validUserData.errors}`);
      }
      console.log('deposit 1')
      const user = await new this.usersTable().list(validUserData.user)
      console.log('deposit 2')
      const account = await new this.accountsTable().list({
        account_number: validUserData.account.accountNumber,
        account_verification_code: validUserData.account.accountVerificationCode,
        agency_number: validUserData.account.agencyNumber,
        agency_verification_code: validUserData.account.agencyVerificationCode,
      })
      console.log('deposit 3')
      if (user.length > 0 && account.length > 0) {
        console.log('deposit 3.1')
        const deposit2 = await new this.transactionsTable().insert({
          date: new Date(),
          destinationAccountId: account[0].id,
          originAccountId: null,
          type: validUserData.transaction.type || '',
          value: validUserData.transaction.value || 0,
          id: v4()
        })
        console.log('deposit 6')
        if(deposit2) {

          const responseData:DepositResponse = {
            account: {
              accountNumber: account[0].accountNumber,
              accountVerificationCode: account[0].accountVerificationCode,
              agencyNumber: account[0].agencyNumber,
              agencyVerificationCode: account[0].agencyVerificationCode,
              document: user[0].document,
              owner: user[0].name,
            },
            date: deposit2.date,
            transactionId: deposit2.id,
            type: deposit2.type,
            value: deposit2.value
          }

          return {
            data: responseData,
            messages: [],
          } as APIResponse;
        }
       
      }

      return {
        data: {},
        messages: ['an error occurred while creating user'],
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

export { CreateDepositService };

import { v4 } from 'uuid';
import { APIResponse, FiltersExtract, Extract, TransactionItem } from '../models';
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

      console.log(filters)

      console.log('lalala')
      if (validUserData.errors) {
        throw new Error(`400: ${validUserData.errors}`);
      }
      console.log('lalala 2')
      const user = await new this.usersTable().list(validUserData.user)
      console.log('lalala 2.1')
      const account = await new this.accountsTable().list({
        account_number: validUserData.account.accountNumber,
        account_verification_code: validUserData.account.accountVerificationCode,
        agency_number: validUserData.account.agencyNumber,
        agency_verification_code: validUserData.account.agencyVerificationCode,
      })
      console.log('lalala 3')
      if (user.length > 0 && account.length > 0) {


        const transactionOrigin = await new this.transactionsTable().list({
          destination_account_id: account[0].id
        })
  
        const transactionDestination = await new this.transactionsTable().list({
          origin_account_id: account[0].id
        })

        const transactions: TransactionItem[] = []

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
          accountNumber: account[0].accountNumber,
          accountVerificationCode: account[0].accountVerificationCode,
          agencyNumber: account[0].agencyNumber,
          agencyVerificationCode: account[0].agencyVerificationCode,
          balance: account[0].balance,
          birthdate: user[0].birthdate,
          document: user[0].document,
          owner: user[0].name,
          transactions
        }

        return {
          data: responseData,
          messages: [],
        } as APIResponse;
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

export { GetExtractService };

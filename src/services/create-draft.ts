import { v4 } from 'uuid';
import { APIResponse, Draft, DraftResponse } from '../models';
import { ExceptionTreatment } from '../utils';
import { DrafitDataValidator } from '../validators';
import { AccountsTable } from '../clients/dao/postgres/accounts';
import { TransactionsTable } from '../clients/dao/postgres/transactions';
import { UsersTable } from '../clients/dao/postgres/users';

class CreateDraftService {
  private draftDataValidator = DrafitDataValidator;

  private usersTable = UsersTable;

  private accountsTable = AccountsTable;

  private transactionsTable = TransactionsTable;

  public async execute(draft: Draft): Promise<APIResponse> {
    try {
      const validUserData = new this.draftDataValidator(draft);
      console.log('lalala')
      if (validUserData.errors) {
        throw new Error(`400: ${validUserData.errors}`);
      }
      console.log('lalala 1')
      const user = await new this.usersTable().list({
        document: validUserData.user.document,
        password: validUserData.user.accountPassword
      })
      console.log('lalala 2')
      const account = await new this.accountsTable().list({
        account_number: validUserData.account.accountNumber,
        account_verification_code: validUserData.account.accountVerificationCode,
        agency_number: validUserData.account.agencyNumber,
        agency_verification_code: validUserData.account.agencyVerificationCode,
      })
      console.log('lalala 3')
      if (user.length > 0 && account.length > 0) {

        const draft2 = await new this.transactionsTable().insert({
          date: new Date(),
          destinationAccountId: null,
          originAccountId: account[0].id,
          type: validUserData.transaction.type || '',
          value: validUserData.transaction.value || 0,
          id: v4()
        })

        if(draft2) {

          const responseData:DraftResponse = {
            account: {
              accountNumber: account[0].accountNumber,
              accountVerificationCode: account[0].accountVerificationCode,
              agencyNumber: account[0].agencyNumber,
              agencyVerificationCode: account[0].agencyVerificationCode,
              document: user[0].document,
              owner: user[0].name,
            },
            date: draft2.date,
            transactionId: draft2.id,
            type: draft2.type,
            value: draft2.value
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

export { CreateDraftService };

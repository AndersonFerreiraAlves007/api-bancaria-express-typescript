import { v4 } from 'uuid';
import { APIResponse, Transfer, TransferResponse } from '../models';
import { ExceptionTreatment } from '../utils';
import { TransferDataValidator } from '../validators';
import { AccountsTable } from '../clients/dao/postgres/accounts';
import { TransactionsTable } from '../clients/dao/postgres/transactions';
import { UsersTable } from '../clients/dao/postgres/users';

class CreateTransferService {
  private transferDataValidator = TransferDataValidator;

  private usersTable = UsersTable;

  private accountsTable = AccountsTable;

  private transactionsTable = TransactionsTable;

  public async execute(transfer: Transfer): Promise<APIResponse> {
    try {
      const validUserData = new this.transferDataValidator(transfer);

      if (validUserData.errors) {
        throw new Error(`400: ${validUserData.errors}`);
      }

      const originUser = await new this.usersTable().list({
        document: validUserData.originUser.document,
        password: validUserData.originUser.accountPassword
      })

      const destinationUser = await new this.usersTable().list({
        document: validUserData.destinationUser.document,
      })

      const originAccount = await new this.accountsTable().list({
        account_number: validUserData.originAccount.accountNumber,
        account_verification_code: validUserData.originAccount.accountVerificationCode,
        agency_number: validUserData.originAccount.agencyNumber,
        agency_verification_code: validUserData.originAccount.agencyVerificationCode,
      })

      const destinationAccount = await new this.accountsTable().list({
        account_number: validUserData.destinationAccount.accountNumber,
        account_verification_code: validUserData.destinationAccount.accountVerificationCode,
        agency_number: validUserData.destinationAccount.agencyNumber,
        agency_verification_code: validUserData.destinationAccount.agencyVerificationCode,
      })

      if (
        originUser.length > 0 && 
        destinationUser.length > 0 && 
        originAccount.length > 0 && 
        destinationAccount.length > 0
        ) 
      {

        const draft2 = await new this.transactionsTable().insert({
          date: new Date(),
          destinationAccountId: destinationAccount[0].id,
          originAccountId: originAccount[0].id,
          type: validUserData.transaction.type || '',
          value: validUserData.transaction.value || 0,
          id: v4()
        })

        if(draft2) {

          const responseData:TransferResponse = {
            date: draft2.date,
            transactionId: draft2.id,
            type: draft2.type,
            value: draft2.value,
            destinationAccount: {
              accountNumber: destinationAccount[0].accountNumber,
              accountVerificationCode: destinationAccount[0].accountVerificationCode,
              agencyNumber: destinationAccount[0].agencyNumber,
              agencyVerificationCode: destinationAccount[0].agencyVerificationCode,
              document: destinationUser[0].document
            },
            originAccount: {
              accountNumber: originAccount[0].accountNumber,
              accountVerificationCode: originAccount[0].accountVerificationCode,
              agencyNumber: originAccount[0].agencyNumber,
              agencyVerificationCode: originAccount[0].agencyVerificationCode,
              document: originUser[0].document
            } 
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

export { CreateTransferService };

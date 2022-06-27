import { v4 } from 'uuid';
import { APIResponse, TransferBody, TransferResponse } from '../models';
import { ExceptionTreatment, TYPE_TRANSACTION_TRANSFER, RATE_TRANSFER, TYPE_TRANSACTION_DRAFIT } from '../utils';
import { TransferDataValidator } from '../validators';
import { AccountsTable } from '../clients/dao/postgres/accounts';
import { TransactionsTable } from '../clients/dao/postgres/transactions';
import { UsersTable } from '../clients/dao/postgres/users';

class CreateTransferService {
  private transferDataValidator = TransferDataValidator;

  private usersTable = UsersTable;

  private accountsTable = AccountsTable;

  private transactionsTable = TransactionsTable;

  public async execute(body: TransferBody): Promise<APIResponse> {
    try {
      const validUserData = new this.transferDataValidator(body);

      if (validUserData.errors) {
        throw new Error(`400: ${validUserData.errors}`);
      }

      const originUserList = await new this.usersTable().list(validUserData.originUser)

      if (originUserList.length < 0) {
        throw new Error(`Usuário não cadastrado!!`);
      }

      const originUser = originUserList[0]

      const destinationUserList = await new this.usersTable().list(validUserData.destinationUser)

      if (destinationUserList.length < 0) {
        throw new Error(`Usuário não cadastrado!!`);
      }

      const destinationUser = destinationUserList[0]

      const originAccountList = await new this.accountsTable().list(validUserData.originAccount)

      if (originAccountList.length < 0) {
        throw new Error(`Conta não cadastrada!`);
      }

      const originAccount = originAccountList[0]

      const destinationAccountList = await new this.accountsTable().list(validUserData.destinationAccount)

      if (destinationAccountList.length < 0) {
        throw new Error(`Conta não cadastrada!`);
      }

      const destinationAccount = destinationAccountList[0]

      if (Number(originAccount.balance) < (validUserData.transaction.value || 0) + RATE_TRANSFER) {
        throw new Error(`Saldo Insuficiente!`);
      }

      const transfer = await new this.transactionsTable().insert({
        date: new Date(),
        destination_account_id: destinationAccount.id,
        origin_account_id: originAccount.id,
        type: validUserData.transaction.type || '',
        value: Number(validUserData.transaction.value || 0),
        id: v4()
      })

      await new this.transactionsTable().insert({
        date: new Date(),
        destination_account_id: originAccount.id,
        origin_account_id: null,
        type: TYPE_TRANSACTION_DRAFIT,
        value: Number(RATE_TRANSFER),
        id: v4()
      })

      await new this.accountsTable().update({
        balance: Number(Number(originAccount.balance) - (validUserData.transaction.value || 0))
      }, originAccount.id)

      await new this.accountsTable().update({
        balance: Number(Number(destinationAccount.balance) + (validUserData.transaction.value || 0))
      }, destinationAccount.id)

      const responseData:TransferResponse = {
        date: transfer.date,
        transactionId: transfer.id,
        type: transfer.type,
        value: transfer.value,
        destinationAccount: {
          accountNumber: destinationAccount.account_number,
          accountVerificationCode: destinationAccount.account_verification_code,
          agencyNumber: destinationAccount.agency_number,
          agencyVerificationCode: destinationAccount.agency_verification_code,
          document: destinationUser.document
        },
        originAccount: {
          accountNumber: originAccount.account_number,
          accountVerificationCode: originAccount.account_verification_code,
          agencyNumber: originAccount.agency_number,
          agencyVerificationCode: originAccount.agency_verification_code,
          document: originUser.document
        } 
      }

      return {
        data: responseData,
        messages: [],
      } as APIResponse;

    } catch (error) {
      throw new ExceptionTreatment(
        error as Error,
        500,
        'an error occurred while inserting transfer on database',
      );
    }
  }
}

export { CreateTransferService };

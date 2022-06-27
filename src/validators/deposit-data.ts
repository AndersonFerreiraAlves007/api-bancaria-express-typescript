import {
  AgencyNumberValidator,
  AccountNumberValidator,
  DocumentValidator,
  VerificationCodeValidator,
  ValueValidator,
} from '.';
import {
  User, Account, Deposit, Transaction,
} from '../models';
import { TYPE_TRANSACTION_DEPOSIT } from '../utils';

class DepositDataValidator {
  public user: Partial<User> = {};

  public account: Partial<Account> = {};

  public transaction: Partial<Transaction> = {};

  public errors: string;

  private agencyNumberValidator = AgencyNumberValidator;

  private accountNumberValidator = AccountNumberValidator;

  private documentValidator = DocumentValidator;

  private verificationCodeValidator = VerificationCodeValidator;

  private valueValidator = ValueValidator;

  public constructor(deposit: Deposit) {
    this.errors = '';
    const { user, account, transaction } = this.validate(deposit);
    this.user = user;
    this.account = account;
    this.transaction = transaction;
  }

  private validate(deposit: Deposit): { user: Partial<User>, account: Partial<Account>, transaction: Partial<Transaction> } {
    const validAgencyNumber = new this.agencyNumberValidator(deposit.account.agencyNumber);
    const validAgencyVerificationCode = new this.verificationCodeValidator(deposit.account.agencyVerificationCode);
    const validAccountNumber = new this.accountNumberValidator(deposit.account.accountNumber);
    const validAccountVerificationCode = new this.verificationCodeValidator(deposit.account.accountVerificationCode);
    const validDocument = new this.documentValidator(deposit.account.document);
    const validValue = new this.valueValidator(deposit.value);

    this.errors = this.errors.concat(`${validAgencyNumber.errors}${validAgencyVerificationCode.errors}${validAccountNumber.errors}${validAccountVerificationCode.errors}${validDocument.errors}${validValue.errors}`);

    return {
      user: {
        document: validDocument.document,
      },
      account: {
        accountNumber: validAccountNumber.accountNumber,
        agencyNumber: validAgencyNumber.agencyNumber,
        accountVerificationCode: validAccountVerificationCode.verificationCode,
        agencyVerificationCode: validAgencyVerificationCode.verificationCode,
      },
      transaction: {
        date: new Date(),
        type: TYPE_TRANSACTION_DEPOSIT,
        value: validValue.value,
      },
    };
  }
}

export { DepositDataValidator };

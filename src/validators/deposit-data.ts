import {
  AgencyNumberValidator,
  AccountNumberValidator,
  DocumentValidator,
  VerificationCodeValidator,
  ValueValidator,
} from '.';
import {
  User, Account, DepositBody, Transaction,
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

  public constructor(body: DepositBody) {
    this.errors = '';
    const { user, account, transaction } = this.validate(body);
    this.user = user;
    this.account = account;
    this.transaction = transaction;
  }

  private validate(body: DepositBody): { user: Partial<User>, account: Partial<Account>, transaction: Partial<Transaction> } {
    const validAgencyNumber = new this.agencyNumberValidator(body.account.agencyNumber);
    const validAgencyVerificationCode = new this.verificationCodeValidator(body.account.agencyVerificationCode);
    const validAccountNumber = new this.accountNumberValidator(body.account.accountNumber);
    const validAccountVerificationCode = new this.verificationCodeValidator(body.account.accountVerificationCode);
    const validDocument = new this.documentValidator(body.account.document);
    const validValue = new this.valueValidator(body.value);

    this.errors = this.errors.concat(`${validAgencyNumber.errors}${validAgencyVerificationCode.errors}${validAccountNumber.errors}${validAccountVerificationCode.errors}${validDocument.errors}${validValue.errors}`);

    return {
      user: {
        document: validDocument.document,
      },
      account: {
        account_number: validAccountNumber.accountNumber,
        agency_number: validAgencyNumber.agencyNumber,
        account_verification_code: validAccountVerificationCode.verificationCode,
        agency_verification_code: validAgencyVerificationCode.verificationCode,
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

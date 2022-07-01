import {
  AgencyNumberValidator,
  AccountNumberValidator,
  DocumentValidator,
  VerificationCodeValidator,
  ValueValidator,
  PasswordValidator
} from '.';
import {
  User, Account, DraftBody, Transaction,
} from '../models';
import { TYPE_TRANSACTION_DRAFIT } from '../utils';

class DrafitDataValidator {
  public user: Partial<User> = {};

  public account: Partial<Account> = {};

  public transaction: Partial<Transaction> = {};

  public errors: string;

  private agencyNumberValidator = AgencyNumberValidator;

  private accountNumberValidator = AccountNumberValidator;

  private documentValidator = DocumentValidator;

  private verificationCodeValidator = VerificationCodeValidator;

  private valueValidator = ValueValidator;

  private passwordValidator = PasswordValidator;

  public constructor(body: DraftBody) {
    this.errors = '';
    const { user, account, transaction } = this.validate(body);
    this.user = user;
    this.account = account;
    this.transaction = transaction;
  }

  private validate(body: DraftBody): { user: Partial<User>, account: Partial<Account>, transaction: Partial<Transaction> } {
    const validAgencyNumber = new this.agencyNumberValidator(body.account.agencyNumber);
    const validAgencyVerificationCode = new this.verificationCodeValidator(body.account.agencyVerificationCode);
    const validAccountNumber = new this.accountNumberValidator(body.account.accountNumber);
    const validAccountVerificationCode = new this.verificationCodeValidator(body.account.accountVerificationCode);
    const validDocument = new this.documentValidator(body.account.document);
    const validPassword = new this.passwordValidator(body.account.accountPassword);
    const validValue = new this.valueValidator(body.value);

    this.errors = this.errors.concat(`${validAgencyNumber.errors}${validAgencyVerificationCode.errors}${validAccountNumber.errors}${validAccountVerificationCode.errors}${validDocument.errors}${validValue.errors}${validPassword.errors}`);

    return {
      user: {
        document: validDocument.document,
      },
      account: {
        account_number: validAccountNumber.accountNumber,
        agency_number: validAgencyNumber.agencyNumber,
        account_verification_code: validAccountVerificationCode.verificationCode,
        agency_verification_code: validAgencyVerificationCode.verificationCode,
        password: validPassword.password
      },
      transaction: {
        date: new Date(),
        type: TYPE_TRANSACTION_DRAFIT,
        value: validValue.value,
      },
    };
  }
}

export { DrafitDataValidator };

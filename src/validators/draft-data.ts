import {
  AgencyNumberValidator,
  AccountNumberValidator,
  DocumentValidator,
  VerificationCodeValidator,
  ValueValidator,
  PasswordValidator
} from '.';
import {
  User, Account, Draft, Transaction,
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

  public constructor(draft: Draft) {
    this.errors = '';
    const { user, account, transaction } = this.validate(draft);
    this.user = user;
    this.account = account;
    this.transaction = transaction;
  }

  private validate(draft: Draft): { user: Partial<User>, account: Partial<Account>, transaction: Partial<Transaction> } {
    const validAgencyNumber = new this.agencyNumberValidator(draft.account.agencyNumber);
    const validAgencyVerificationCode = new this.verificationCodeValidator(draft.account.agencyVerificationCode);
    const validAccountNumber = new this.accountNumberValidator(draft.account.accountNumber);
    const validAccountVerificationCode = new this.verificationCodeValidator(draft.account.accountVerificationCode);
    const validDocument = new this.documentValidator(draft.account.document);
    const validPassword = new this.passwordValidator(draft.account.accountPassword);
    const validValue = new this.valueValidator(draft.value);

    this.errors = this.errors.concat(`${validAgencyNumber.errors}${validAgencyVerificationCode.errors}${validAccountNumber.errors}${validAccountVerificationCode.errors}${validDocument.errors}${validValue.errors}${validPassword.errors}`);

    return {
      user: {
        document: validDocument.document,
        accountPassword: validPassword.password
      },
      account: {
        accountNumber: validAccountNumber.accountNumber,
        agencyNumber: validAgencyNumber.agencyNumber,
        accountVerificationCode: validAccountVerificationCode.verificationCode,
        agencyVerificationCode: validAgencyVerificationCode.verificationCode,
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

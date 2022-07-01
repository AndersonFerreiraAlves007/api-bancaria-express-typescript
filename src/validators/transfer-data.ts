import {
  AgencyNumberValidator,
  AccountNumberValidator,
  DocumentValidator,
  VerificationCodeValidator,
  ValueValidator,
  PasswordValidator
} from '.';
import {
  User, Account, TransferBody, Transaction,
} from '../models';
import { TYPE_TRANSACTION_TRANSFER } from '../utils';

class TransferDataValidator {
  public originUser: Partial<User> = {};

  public destinationUser: Partial<User> = {};

  public originAccount: Partial<Account> = {};

  public destinationAccount: Partial<Account> = {};

  public transaction: Partial<Transaction> = {};

  public errors: string;

  private agencyNumberValidator = AgencyNumberValidator;

  private accountNumberValidator = AccountNumberValidator;

  private documentValidator = DocumentValidator;

  private verificationCodeValidator = VerificationCodeValidator;

  private valueValidator = ValueValidator;

  private passwordValidator = PasswordValidator;

  public constructor(body: TransferBody) {
    this.errors = '';
    const { userOrigin, userDestination, originAccount, destinationAccount, transaction } = this.validate(body);
    this.originUser = userOrigin;
    this.destinationUser = userDestination;
    this.originAccount = originAccount;
    this.destinationAccount = destinationAccount;
    this.transaction = transaction;
  }

  private validate(body: TransferBody): { userOrigin: Partial<User>, userDestination: Partial<User>, originAccount: Partial<Account>, destinationAccount: Partial<Account>, transaction: Partial<Transaction> } {
    const validOriginAgencyNumber = new this.agencyNumberValidator(body.originAccount.agencyNumber);
    const validOriginAgencyVerificationCode = new this.verificationCodeValidator(body.originAccount.agencyVerificationCode);
    const validOriginAccountNumber = new this.accountNumberValidator(body.originAccount.accountNumber);
    const validOriginAccountVerificationCode = new this.verificationCodeValidator(body.originAccount.accountVerificationCode);

    const validDestinationAgencyNumber = new this.agencyNumberValidator(body.destinationAccount.agencyNumber);
    const validDestinationAgencyVerificationCode = new this.verificationCodeValidator(body.destinationAccount.agencyVerificationCode);
    const validDestinationAccountNumber = new this.accountNumberValidator(body.destinationAccount.accountNumber);
    const validDestinationAccountVerificationCode = new this.verificationCodeValidator(body.destinationAccount.accountVerificationCode);

    const validOriginDocument = new this.documentValidator(body.originAccount.document);
    const validPassword = new this.passwordValidator(body.originAccount.accountPassword);
    
    const validDestinationDocument = new this.documentValidator(body.destinationAccount.document);

    const validValue = new this.valueValidator(body.value);

    this.errors = this.errors.concat(`${validOriginAgencyNumber.errors}${validOriginAgencyVerificationCode.errors}${validOriginAccountNumber.errors}${validOriginAccountVerificationCode.errors}${validOriginDocument.errors}${validPassword.errors}${validDestinationAgencyNumber.errors}${validDestinationAgencyVerificationCode.errors}${validDestinationAccountNumber.errors}${validDestinationAccountVerificationCode.errors}${validDestinationDocument.errors}${validValue.errors}${validPassword.errors}`);

    return {
      userOrigin: {
        document: validOriginDocument.document,
      },
      userDestination: {
        document: validDestinationDocument.document,
      },
      originAccount: {
        account_number: validOriginAccountNumber.accountNumber,
        agency_number: validOriginAgencyNumber.agencyNumber,
        account_verification_code: validOriginAccountVerificationCode.verificationCode,
        agency_verification_code: validOriginAgencyVerificationCode.verificationCode,
        password: validPassword.password
      },
      destinationAccount: {
        account_number: validDestinationAccountNumber.accountNumber,
        agency_number: validDestinationAgencyNumber.agencyNumber,
        account_verification_code: validDestinationAccountVerificationCode.verificationCode,
        agency_verification_code: validDestinationAgencyVerificationCode.verificationCode,
      },
      transaction: {
        date: new Date(),
        type: TYPE_TRANSACTION_TRANSFER,
        value: validValue.value,
      },
    };
  }
}

export { TransferDataValidator };

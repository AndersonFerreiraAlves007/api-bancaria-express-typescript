import {
  AgencyNumberValidator,
  AccountNumberValidator,
  DocumentValidator,
  VerificationCodeValidator,
  ValueValidator,
  PasswordValidator
} from '.';
import {
  User, Account, Transfer, Transaction,
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

  public constructor(transfer: Transfer) {
    this.errors = '';
    const { userOrigin, userDestination, originAccount, destinationAccount, transaction } = this.validate(transfer);
    this.originUser = userOrigin;
    this.destinationUser = userDestination;
    this.originAccount = originAccount;
    this.destinationAccount = destinationAccount;
    this.transaction = transaction;
  }

  private validate(transfer: Transfer): { userOrigin: Partial<User>, userDestination: Partial<User>, originAccount: Partial<Account>, destinationAccount: Partial<Account>, transaction: Partial<Transaction> } {
    const validOriginAgencyNumber = new this.agencyNumberValidator(transfer.originAccount.agencyNumber);
    const validOriginAgencyVerificationCode = new this.verificationCodeValidator(transfer.originAccount.agencyVerificationCode);
    const validOriginAccountNumber = new this.accountNumberValidator(transfer.originAccount.accountNumber);
    const validOriginAccountVerificationCode = new this.verificationCodeValidator(transfer.originAccount.accountVerificationCode);

    const validDestinationAgencyNumber = new this.agencyNumberValidator(transfer.destinationAccount.agencyNumber);
    const validDestinationAgencyVerificationCode = new this.verificationCodeValidator(transfer.destinationAccount.agencyVerificationCode);
    const validDestinationAccountNumber = new this.accountNumberValidator(transfer.destinationAccount.accountNumber);
    const validDestinationAccountVerificationCode = new this.verificationCodeValidator(transfer.destinationAccount.accountVerificationCode);

    const validOriginDocument = new this.documentValidator(transfer.originAccount.document);
    const validPassword = new this.passwordValidator(transfer.originAccount.accountPassword);
    
    const validDestinationDocument = new this.documentValidator(transfer.destinationAccount.document);

    const validValue = new this.valueValidator(transfer.value);

    this.errors = this.errors.concat(`${validOriginAgencyNumber.errors}${validOriginAgencyVerificationCode.errors}${validOriginAccountNumber.errors}${validOriginAccountVerificationCode.errors}${validOriginDocument.errors}${validPassword.errors}${validDestinationAgencyNumber.errors}${validDestinationAgencyVerificationCode.errors}${validDestinationAccountNumber.errors}${validDestinationAccountVerificationCode.errors}${validDestinationDocument.errors}${validValue.errors}${validPassword.errors}`);

    return {
      userOrigin: {
        document: validOriginDocument.document,
        accountPassword: validPassword.password
      },
      userDestination: {
        document: validDestinationDocument.document,
      },
      originAccount: {
        accountNumber: validOriginAccountNumber.accountNumber,
        agencyNumber: validOriginAgencyNumber.agencyNumber,
        accountVerificationCode: validOriginAccountVerificationCode.verificationCode,
        agencyVerificationCode: validOriginAgencyVerificationCode.verificationCode,
      },
      destinationAccount: {
        accountNumber: validDestinationAccountNumber.accountNumber,
        agencyNumber: validDestinationAgencyNumber.agencyNumber,
        accountVerificationCode: validDestinationAccountVerificationCode.verificationCode,
        agencyVerificationCode: validDestinationAgencyVerificationCode.verificationCode,
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

import {
  AgencyNumberValidator,
  AccountNumberValidator,
  DocumentValidator,
  VerificationCodeValidator
} from '.';
import {
  User, Account, FiltersExtract
} from '../models';

class FiltersExtractValidator {
  public user: Partial<User> = {};

  public account: Partial<Account> = {};

  public errors: string;

  private agencyNumberValidator = AgencyNumberValidator;

  private accountNumberValidator = AccountNumberValidator;

  private documentValidator = DocumentValidator;

  private verificationCodeValidator = VerificationCodeValidator;

  public constructor(filters: FiltersExtract) {
    this.errors = '';
    const { user, account } = this.validate(filters);
    this.user = user;
    this.account = account;
  }

  private validate(filters: FiltersExtract): { user: Partial<User>, account: Partial<Account> } {
    const validAgencyNumber = new this.agencyNumberValidator(filters.agencyNumber);
    const validAgencyVerificationCode = new this.verificationCodeValidator(filters.agencyVerificationCode);
    const validAccountNumber = new this.accountNumberValidator(filters.accountNumber);
    const validAccountVerificationCode = new this.verificationCodeValidator(filters.accountVerificationCode);
    const validDocument = new this.documentValidator(filters.document);

    this.errors = this.errors.concat(`${validAgencyNumber.errors}${validAgencyVerificationCode.errors}${validAccountNumber.errors}${validAccountVerificationCode.errors}${validDocument.errors}`);

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
    };
  }
}

export { FiltersExtractValidator };

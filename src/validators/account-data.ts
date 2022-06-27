import {
  NameValidator,
  EmailValidator,
  DocumentValidator,
  DateValidator,
  PasswordValidator
} from '.';
import { AccountBody, User } from '../models';

class AccountDataValidator {
  public user: Partial<User>;

  public errors: string;

  private emailValidator = EmailValidator;

  private nameValidator = NameValidator;

  private dateValidator = DateValidator;

  private documentValidator = DocumentValidator;

  private passwordValidator = PasswordValidator;

  public constructor(body: AccountBody) {
    this.errors = '';
    this.user = this.validate(body);
  }

  private validate(body: AccountBody): Partial<User> {
    const validEmail = new this.emailValidator(body.email);
    const validName = new this.nameValidator(body.name);
    const validBirthdate = new this.dateValidator(body.birthdate);
    const validDocument = new this.documentValidator(body.document);
    const validPassword = new this.passwordValidator(body.accountPassword);

    this.errors = this.errors.concat(`${validEmail.errors}${validName.errors}${validBirthdate.errors}${validDocument.errors}${validPassword.errors}`);

    return {
      birthdate: validBirthdate.date,
      email: validEmail.email,
      name: validName.name,
      document: validDocument.document,
      password: validPassword.password
    };

  }
}

export { AccountDataValidator };

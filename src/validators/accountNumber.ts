class AccountNumberValidator {
  public accountNumber: string;

  public errors: string;

  public constructor(accountNumber: string) {
    this.errors = '';
    this.accountNumber = this.validate(accountNumber);
  }

  private validate(accountNumber: string): string {
    if (!accountNumber) {
      this.errors += 'accountNumber:accountNumber required';

      return '';
    }

    if (/\d{6}/.test(accountNumber)) {
      this.errors += 'accountNumber:invalid accountNumber|';

      return '';
    }

    return accountNumber.trim();
  }
}

export { AccountNumberValidator };

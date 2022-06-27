class VerificationCodeValidator {
  public verificationCode: string;

  public errors: string;

  public constructor(verificationCode: string) {
    this.errors = '';
    this.verificationCode = this.validate(verificationCode);
  }

  private validate(verificationCode: string): string {
    if (!verificationCode) {
      this.errors += 'verificationCode:verificationCode required';

      return '';
    }

    if (!/\d{1}/.test(verificationCode)) {
      this.errors += 'verificationCode:invalid verificationCode|';

      return '';
    }

    return verificationCode.trim();
  }
}

export { VerificationCodeValidator };

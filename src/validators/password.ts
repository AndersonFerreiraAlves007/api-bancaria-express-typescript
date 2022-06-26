class PasswordValidator {
  public password: string;

  public errors: string;

  public constructor(password: string) {
    this.errors = '';
    this.password = this.validate(password);
  }

  private validate(password: string): string {
    if (!password) {
      this.errors += 'password:password required';

      return '';
    }

    if (/\d{6}/.test(password)) {
      this.errors += 'password:invalid password|';

      return '';
    }

    return password.trim();
  }
}

export { PasswordValidator };

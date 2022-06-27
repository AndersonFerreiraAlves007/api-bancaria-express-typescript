class AgencyNumberValidator {
  public agencyNumber: string;

  public errors: string;

  public constructor(agencyNumber: string) {
    this.errors = '';
    this.agencyNumber = this.validate(agencyNumber);
  }

  private validate(agencyNumber: string): string {
    if (!agencyNumber) {
      this.errors += 'agencyNumber:agencyNumber required';

      return '';
    }

    if (!/\d{4}/.test(agencyNumber)) {
      this.errors += 'agencyNumber:invalid agencyNumber|';

      return '';
    }

    return agencyNumber.trim();
  }
}

export { AgencyNumberValidator };

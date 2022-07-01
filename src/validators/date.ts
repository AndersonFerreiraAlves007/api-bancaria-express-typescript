class DateValidator {
  public date: Date;

  public errors: string;

  public constructor(date: string) {
    this.errors = '';
    this.date = this.validate(date);
  }

  private validate(date: string): Date {
    if (!date) {
      this.errors += 'birthdate:birthdate required';

      return new Date();
    }

    if (!new Date(date).getTime()) {
      this.errors += 'birthdate:invalid date|';

      return new Date();
    }

    return new Date(date);
  }
}

export { DateValidator };

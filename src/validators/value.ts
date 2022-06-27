class ValueValidator {
  public value: number;

  public errors: string;

  public constructor(value: number) {
    this.errors = '';
    this.value = this.validate(value);
  }

  private validate(value: number): number {
    if (!value) {
      this.errors += 'value:value required';

      return 0;
    }

    if (value <= 0 || Number.isNaN(value)) {
      this.errors += 'value:invalid value|';

      return 0;
    }

    return value;
  }
}

export { ValueValidator };

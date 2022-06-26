class DocumentValidator {
  public document: string;

  public errors: string;

  public constructor(document: string) {
    this.errors = '';
    this.document = this.validate(document);
  }

  private validate(document: string): string {
    if (!document) {
      this.errors += 'document:document required';

      return '';
    }

    if (/\d{11}/.test(document)) {
      this.errors += 'document:invalid document|';

      return '';
    }

    return document.trim();
  }
}

export { DocumentValidator };

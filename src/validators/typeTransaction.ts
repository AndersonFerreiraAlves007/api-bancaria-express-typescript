import {
  TYPE_TRANSACTION_DEPOSIT,
  TYPE_TRANSACTION_DRAFIT,
  TYPE_TRANSACTION_TRANSFER,
} from '../utils';

class TypeTransactionValidator {
  public typeTransaction: string;

  public errors: string;

  public constructor(typeTransaction: string) {
    this.errors = '';
    this.typeTransaction = this.validate(typeTransaction);
  }

  private validate(typeTransaction: string): string {
    if (!typeTransaction) {
      this.errors += 'typeTransaction:typeTransaction required';

      return '';
    }

    if (
      typeTransaction !== TYPE_TRANSACTION_DEPOSIT
      && typeTransaction !== TYPE_TRANSACTION_DRAFIT
      && typeTransaction !== TYPE_TRANSACTION_TRANSFER
    ) {
      this.errors += 'typeTransaction:invalid typeTransaction|';

      return '';
    }

    return typeTransaction.trim();
  }
}

export { TypeTransactionValidator };

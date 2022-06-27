import { Account } from '../models'

function createAgencyAccount(quantity: number): string {
  const numbers = [];
  for (let i = 0; i < quantity; i += 1) {
    numbers.push(Math.floor(Math.random() * 10));
  }
  return numbers.join('');
}

function makeAccountNumber(): string {
  return createAgencyAccount(6);
}

function makeAccountVerificationCode(): string {
  return createAgencyAccount(1);
}

function makeAgencyNumber(): string {
  return createAgencyAccount(4);
}

function makeAgencyVerificationCode(): string {
  return createAgencyAccount(1);
}

function generateAccount(): Partial<Account> {
  return {
    accountNumber: makeAccountNumber(),
    accountVerificationCode: makeAccountVerificationCode(),
    agencyNumber: makeAgencyNumber(),
    agencyVerificationCode: makeAgencyVerificationCode(),
    balance: 0
  }
}

export {
  generateAccount
};

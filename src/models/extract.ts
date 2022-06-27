interface TransactionItem {
  transactionId: string
  date: Date
  value: number
  type: string
}

interface Extract
{
  agencyNumber: string
  agencyVerificationCode: string
  accountNumber: string
  accountVerificationCode: string
  owner: string
  document: string
  birthdate: string
  balance: number
  transactions: TransactionItem[]
}

export { Extract, TransactionItem };

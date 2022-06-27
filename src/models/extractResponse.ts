interface Extract
{
  agencyNumber: string
  agencyVerificationCode: string
  accountNumber: string
  accountVerificationCode: string
  owner: string
  document: string
  birthdate: Date
  balance: number
  transactions: ({
    transactionId: string
    date: Date
    value: number
    type: string
  })[]
}

export { Extract };

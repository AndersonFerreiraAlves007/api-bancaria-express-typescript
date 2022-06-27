interface DraftResponse
{
  transactionId: string
  type: string
  value: number
  date: Date
  account: {
    agencyNumber: string
    agencyVerificationCode: string
    accountNumber: string
    accountVerificationCode: string
    owner: string
    document: string
  }
}

export { DraftResponse };

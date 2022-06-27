interface TransferResponse
{
  transactionId: string
  type: string
  value: number
  date: Date
  originAccount: {
    agencyNumber: string
    agencyVerificationCode: string
    accountNumber: string
    accountVerificationCode: string
    document: string
  }
  destinationAccount: {
    agencyNumber: string
    agencyVerificationCode: string
    accountNumber: string
    accountVerificationCode: string
    document: string
  }
}

export { TransferResponse };

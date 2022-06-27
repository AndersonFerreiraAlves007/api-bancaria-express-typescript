interface Transfer
{
  originAccount: {
    agencyNumber: string
    agencyVerificationCode: string
    accountNumber: string
    accountVerificationCode: string
    document: string
    accountPassword: string
  }
  destinationAccount: {
    agencyNumber: string
    agencyVerificationCode: string
    accountNumber: string
    accountVerificationCode: string
    document: string
  }
  value: number
}

export { Transfer };

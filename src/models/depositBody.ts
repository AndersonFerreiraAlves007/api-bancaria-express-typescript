interface DepositBody
{
  account: {
    agencyNumber: string
    agencyVerificationCode: string
    accountNumber: string
    accountVerificationCode: string
    accountPassword: string
    document: string
  }
  value: number
}

export { DepositBody };

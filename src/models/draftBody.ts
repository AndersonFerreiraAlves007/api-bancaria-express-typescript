interface DraftBody
{
  account: {
    agencyNumber: string
    agencyVerificationCode: string
    accountNumber: string
    accountVerificationCode: string
    document: string
    accountPassword: string
  }
  value: number
}

export { DraftBody };

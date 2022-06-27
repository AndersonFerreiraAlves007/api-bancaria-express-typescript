interface AccountResponse
{
  agencyNumber: string
  agencyVerificationCode: string
  accountNumber: string
  accountVerificationCode: string
  owner: string
  document: string
  birthdate: Date
}

export { AccountResponse };

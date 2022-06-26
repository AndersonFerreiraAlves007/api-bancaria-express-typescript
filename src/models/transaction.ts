interface Transaction
{
  id: string,
  originAccountId: string
  destinationAccountId: string
  date: Date
  value: string
  type: string
}

export { Transaction };

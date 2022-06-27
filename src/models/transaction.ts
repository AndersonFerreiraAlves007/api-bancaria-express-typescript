interface Transaction
{
  id: string
  originAccountId: string | null
  destinationAccountId: string | null
  date: Date
  value: number
  type: string
}

export { Transaction };

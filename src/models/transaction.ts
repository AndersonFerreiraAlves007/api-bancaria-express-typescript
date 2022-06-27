interface Transaction
{
  id: string
  origin_account_id: string | null
  destination_account_id: string | null
  date: Date
  value: number
  type: string
}

export { Transaction };

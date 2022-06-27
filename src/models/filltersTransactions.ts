interface FiltersTransaction
{
  id: string
  origin_account_id: string
  destination_account_id: string
  date: Date
  value: number
  type: string
}

export { FiltersTransaction };

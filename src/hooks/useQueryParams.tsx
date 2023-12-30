import { useSearchParams } from 'react-router-dom'
import { queryParamsSchema } from '../schema'

export function useQueryParams() {
  const [searchParams] = useSearchParams()
  const searchParamsObject = Object.fromEntries(searchParams)
  return queryParamsSchema.safeParse(searchParamsObject)
}

import { useQuery } from '@tanstack/react-query'
import { searchApi } from '@/api'

export const useSearch = (query?: string) => {
    return useQuery({
        queryKey: ['search', query],
        queryFn: () => searchApi.search(query as string),
        enabled: !!query && query.length > 0,
    })
}
import { useQuery } from '@tanstack/react-query'

export const useResources = () => {
    return useQuery({
        queryKey: ['resources'],
        queryFn: () => Promise.resolve([]),
    })
}
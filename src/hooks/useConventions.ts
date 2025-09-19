import { useQuery } from '@tanstack/react-query'

export const useConventions = () => {
    return useQuery({
        queryKey: ['conventions'],
        queryFn: () => Promise.resolve([]),
    })
}
import { useQuery } from '@tanstack/react-query'

export const usePolls = () => {
    return useQuery({
        queryKey: ['polls'],
        queryFn: () => Promise.resolve([]),
    })
}
import { useQuery } from '@tanstack/react-query'

export const useGroups = () => {
    return useQuery({
        queryKey: ['groups'],
        queryFn: () => Promise.resolve([]),
    })
}
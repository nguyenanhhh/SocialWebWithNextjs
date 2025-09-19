import { useQuery } from '@tanstack/react-query'

export const useFriends = () => {
    return useQuery({
        queryKey: ['friends'],
        queryFn: () => Promise.resolve([]),
    })
}
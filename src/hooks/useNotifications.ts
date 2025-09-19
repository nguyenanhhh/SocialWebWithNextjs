import { useQuery } from '@tanstack/react-query'

export const useNotifications = () => {
    return useQuery({
        queryKey: ['notifications'],
        queryFn: () => Promise.resolve([]),
    })
}
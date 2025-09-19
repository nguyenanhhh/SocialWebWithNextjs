import { useQuery } from '@tanstack/react-query'

export const useRoot = () => {
    return useQuery({
        queryKey: ['root'],
        queryFn: () => Promise.resolve({ state: 'success' }),
    })
}
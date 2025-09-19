import { useMutation } from '@tanstack/react-query'

export const useCreateReaction = () => {
    return useMutation({
        mutationFn: (data: any) => Promise.resolve(data),
    })
}
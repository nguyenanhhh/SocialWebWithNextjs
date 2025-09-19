import { useMutation } from '@tanstack/react-query'

export const useCreatePostView = () => {
    return useMutation({
        mutationFn: (data: any) => Promise.resolve(data),
    })
}
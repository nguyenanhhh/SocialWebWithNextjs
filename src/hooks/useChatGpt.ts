import { useMutation } from '@tanstack/react-query'

export const useChatGpt = () => {
    return useMutation({
        mutationFn: (data: any) => Promise.resolve(data),
    })
}
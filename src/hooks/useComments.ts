import { useMutation, useQuery } from '@tanstack/react-query'
import { commentsApi } from '@/api'

export const useComments = (postId?: string) => {
    return useQuery({
        queryKey: ['comments', postId],
        queryFn: () => commentsApi.getByPostId(postId as string),
        enabled: !!postId,
    })
}

export const useCreateComment = () => {
    return useMutation({
        mutationFn: commentsApi.create,
    })
}

export const useEditComment = () => {
    return useMutation({
        mutationFn: (params: { id: string; payload: any }) => commentsApi.edit(params.id, params.payload),
    })
}

export const useDeleteComment = () => {
    return useMutation({
        mutationFn: (id: string) => commentsApi.delete(id),
    })
}
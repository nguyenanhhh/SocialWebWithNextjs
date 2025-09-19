import { useMutation, useQuery } from '@tanstack/react-query'
import { postsApi } from '@/api'

export const useNewfeedPosts = (userID?: string) => {
    return useQuery({
        queryKey: ['posts', 'newfeed', userID],
        queryFn: () => postsApi.getNewfeed(userID as string),
        enabled: !!userID,
    })
}

export const usePost = (id?: string) => {
    return useQuery({
        queryKey: ['post', id],
        queryFn: () => postsApi.getById(id as string),
        enabled: !!id,
    })
}

export const useCreatePost = () => {
    return useMutation({
        mutationFn: postsApi.create,
    })
}

export const useEditPost = () => {
    return useMutation({
        mutationFn: (params: { id: string; payload: any }) => postsApi.edit(params.id, params.payload),
    })
}

export const useDeletePosts = () => {
    return useMutation({
        mutationFn: (ids: string[]) => postsApi.deleteMany(ids),
    })
}

export const useTrashPost = () => {
    return useMutation({
        mutationFn: (id: string) => postsApi.moveToTrash(id),
    })
}



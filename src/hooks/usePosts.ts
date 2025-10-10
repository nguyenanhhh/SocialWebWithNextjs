import { useMutation, useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { postsApi } from '@/api'

export const useNewfeedPosts = (userID?: string) => {
    return useQuery({
        queryKey: ['posts', 'newfeed', userID],
        queryFn: () => postsApi.getNewfeed(userID as string),
        enabled: !!userID,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: 5 * 60 * 1000,
    })
}

export const useInfiniteNewfeed = (userID?: string) => {
    return useInfiniteQuery({
        queryKey: ['posts', 'newfeed-infinite', userID],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await postsApi.getNewfeed(userID as string, { page: pageParam, limit: 10 });
            return Array.isArray(res) ? { data: res, total: res.length, page: 1, limit: 10 } : res;
        },
        enabled: !!userID,
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            const data = Array.isArray(lastPage?.data) ? lastPage.data : [];
            return data.length === 10 ? pages.length + 1 : undefined;
        },
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
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



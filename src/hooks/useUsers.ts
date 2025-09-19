import { useMutation, useQuery } from '@tanstack/react-query'
import { usersApi } from '@/api'

export const useUser = (id?: string) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => usersApi.getById(id as string),
        enabled: !!id,
    })
}

export const useAllUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => usersApi.getAll(),
    })
}

export const useUpdateUser = () => {
    return useMutation({
        mutationFn: (params: { id: string; payload: any }) => usersApi.updateBio(params.id, params.payload),
    })
}
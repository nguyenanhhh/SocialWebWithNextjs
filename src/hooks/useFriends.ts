import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { friendsApi } from '@/lib/api/friends'
import { userApi } from '@/lib/api/user'
import { User } from '@/types'

export const useFriends = (userId: string | undefined) => {
    return useQuery<User[]>({
        queryKey: ['friends', userId],
        queryFn: async () => {
            if (!userId) return []
            try {
                const response = await friendsApi.getFriends(userId)
                return Array.isArray(response.data.data) ? response.data.data : []
            } catch (error) {
                console.error('Failed to fetch friends:', error)
                return []
            }
        },
        enabled: !!userId,
    })
}

export const useFriendSuggestions = (userId: string | undefined) => {
    return useQuery<User[]>({
        queryKey: ['friend-suggestions', userId],
        queryFn: async () => {
            if (!userId) return []
            try {
                const [allUsersResponse, friendsResponse, pendingResponse, requestsResponse] = await Promise.all([
                    userApi.getAllUsers(),
                    friendsApi.getFriends(userId),
                    friendsApi.getPendingRequests(userId),
                    friendsApi.getFriendRequests(userId)
                ])


                const allUsers = Array.isArray(allUsersResponse.data) ? allUsersResponse.data : []
                const friends = Array.isArray(friendsResponse.data.data) ? friendsResponse.data.data : []
                const pending = Array.isArray(pendingResponse.data.data) ? pendingResponse.data.data : []
                const requests = Array.isArray(requestsResponse.data.data) ? requestsResponse.data.data : []

                const excludeIds = new Set([
                    ...friends.map(f => f._id),
                    ...pending.map(p => p._id),
                    ...requests.map(r => r._id)
                ])

                return allUsers.filter(user => user._id !== userId && !excludeIds.has(user._id))
            } catch (error) {
                console.error('Failed to fetch suggestions:', error)
                return []
            }
        },
        enabled: !!userId,
    })
}

export const useFriendRequests = (userId: string | undefined) => {
    return useQuery<User[]>({
        queryKey: ['friend-requests', userId],
        queryFn: async () => {
            if (!userId) return []
            try {
                const response = await friendsApi.getFriendRequests(userId)
                return Array.isArray(response.data.data) ? response.data.data : []
            } catch (error) {
                console.error('Failed to fetch friend requests:', error)
                return []
            }
        },
        enabled: !!userId,
    })
}

export const usePendingRequests = (userId: string | undefined) => {
    return useQuery<User[]>({
        queryKey: ['pending-requests', userId],
        queryFn: async () => {
            if (!userId) return []
            try {
                const response = await friendsApi.getPendingRequests(userId)
                return Array.isArray(response.data.data) ? response.data.data : []
            } catch (error) {
                console.error('Failed to fetch pending requests:', error)
                return []
            }
        },
        enabled: !!userId,
    })
}

export const useFriendStatus = (userID: string | undefined, friendID: string | undefined) => {
    return useQuery<string>({
        queryKey: ['friend-status', userID, friendID],
        queryFn: async () => {
            if (!userID || !friendID) return 'NONE'
            const response = await friendsApi.getFriendStatus({ userID, friendID })
            return response.data.data.status
        },
        enabled: !!userID && !!friendID,
    })
}

export const useSendFriendRequest = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ ownerID, userID }: { ownerID: string; userID: string }) =>
            friendsApi.sendFriendRequest(ownerID, userID),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['friend-suggestions', variables.ownerID] })
            queryClient.invalidateQueries({ queryKey: ['friend-suggestions', variables.userID] })
            queryClient.invalidateQueries({ queryKey: ['pending-requests', variables.ownerID] })
            queryClient.invalidateQueries({ queryKey: ['friend-status', variables.ownerID, variables.userID] })
        },
    })
}

export const useAcceptFriendRequest = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ ownerID, userID }: { ownerID: string; userID: string }) =>
            friendsApi.acceptFriendRequest(ownerID, userID),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['friends', variables.ownerID] })
            queryClient.invalidateQueries({ queryKey: ['friends', variables.userID] })
            queryClient.invalidateQueries({ queryKey: ['friend-requests', variables.ownerID] })
            queryClient.invalidateQueries({ queryKey: ['friend-suggestions', variables.ownerID] })
            queryClient.invalidateQueries({ queryKey: ['friend-suggestions', variables.userID] })
            queryClient.invalidateQueries({ queryKey: ['friend-status', variables.ownerID, variables.userID] })
        },
    })
}

export const useRejectFriendRequest = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ ownerID, userID }: { ownerID: string; userID: string }) =>
            friendsApi.rejectFriendRequest(ownerID, userID),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['friend-requests', variables.ownerID] })
            queryClient.invalidateQueries({ queryKey: ['friend-suggestions', variables.ownerID] })
            queryClient.invalidateQueries({ queryKey: ['friend-status', variables.ownerID, variables.userID] })
        },
    })
}

export const useRemoveSuggest = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ ownerID, userID }: { ownerID: string; userID: string }) =>
            friendsApi.removeSuggestFriend(ownerID, userID),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['friend-suggestions', variables.ownerID] })
        },
    })
}
export const useCancelFriendRequest = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ ownerID, userID }: { ownerID: string; userID: string }) =>
            friendsApi.cancelFriendRequest(ownerID, userID),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['pending-requests', variables.ownerID] })
            queryClient.invalidateQueries({ queryKey: ['friend-suggestions', variables.ownerID] })
            queryClient.invalidateQueries({ queryKey: ['friend-status', variables.ownerID, variables.userID] })
        },
    })
}

export const useUnfriend = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ ownerID, userID }: { ownerID: string; userID: string }) =>
            friendsApi.unfriend(ownerID, userID),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['friends', variables.ownerID] })
            queryClient.invalidateQueries({ queryKey: ['friends', variables.userID] })
            queryClient.invalidateQueries({ queryKey: ['friend-suggestions', variables.ownerID] })
            queryClient.invalidateQueries({ queryKey: ['friend-suggestions', variables.userID] })
            queryClient.invalidateQueries({ queryKey: ['friend-status', variables.ownerID, variables.userID] })
        },
    })
}

export const useBlockUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ ownerID, userID }: { ownerID: string; userID: string }) =>
            friendsApi.blockUser(ownerID, userID),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['friends', variables.ownerID] })
            queryClient.invalidateQueries({ queryKey: ['friend-requests', variables.ownerID] })
            queryClient.invalidateQueries({ queryKey: ['friend-suggestions', variables.ownerID] })
            queryClient.invalidateQueries({ queryKey: ['friend-status', variables.ownerID, variables.userID] })
        },
    })
}

export const useUnblockUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ ownerID, userID }: { ownerID: string; userID: string }) =>
            friendsApi.unblockUser(ownerID, userID),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['friend-suggestions', variables.ownerID] })
            queryClient.invalidateQueries({ queryKey: ['friend-status', variables.ownerID, variables.userID] })
        },
    })
}
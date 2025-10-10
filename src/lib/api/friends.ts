import { api } from './client'
import type { Friend, User, ApiResponse } from '@/types'

export const friendsApi = {
    getFriends: (userId: string) =>
        api.get<User[]>(`/friend/list/${userId}`),

    getFriendStatus: (params: { userID: string; friendID: string }) =>
        api.get<{ status: string }>('/friend/status', { params }),

    getSuggestions: (userId: string) =>
        api.get<User[]>(`/friend/suggest/${userId}`),

    getFriendRequests: (userId: string) =>
        api.get<User[]>(`/friend/accepting/${userId}`),

    getPendingRequests: (userId: string) =>
        api.get<User[]>(`/friend/pending/${userId}`),

    sendFriendRequest: (ownerID: string, userID: string) =>
        api.post<ApiResponse<any>>('/friend/status/update', { ownerID, userID, status: 'PENDING' }),

    acceptFriendRequest: (ownerID: string, userID: string) =>
        api.post<ApiResponse<any>>('/friend/status/update', { ownerID, userID, status: 'ACCEPTING' }),

    rejectFriendRequest: (ownerID: string, userID: string) =>
        api.post<ApiResponse<any>>('/friend/status/update', { ownerID, userID, status: 'REFUSING' }),

    cancelFriendRequest: (ownerID: string, userID: string) =>
        api.post<ApiResponse<any>>('/friend/status/update', { ownerID, userID, status: 'CANCELING' }),

    unfriend: (ownerID: string, userID: string) =>
        api.post<ApiResponse<any>>('/friend/status/update', { ownerID, userID, status: 'CANCELING' }),

    blockUser: (ownerID: string, userID: string) =>
        api.post<ApiResponse<any>>('/friend/status/update', { ownerID, userID, status: 'BLOCKING' }),

    unblockUser: (ownerID: string, userID: string) =>
        api.post<ApiResponse<any>>('/friend/status/update', { ownerID, userID, status: 'NONE' }),

    removeSuggestFriend: (ownerID: string, userID: string) =>
        api.post<ApiResponse<any>>(`/friend/suggest/${ownerID}/remove/${userID}`)
}

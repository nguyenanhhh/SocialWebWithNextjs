import http from './http'
import { ApiResponse, Friend, User } from '@/types'

export const friendsApi = {
    list(id: string) {
        return http.get<ApiResponse<User[]>>(`/friend/list/${id}`)
    },
    status(params: { userID: string; friendID: string }) {
        return http.get<ApiResponse<{ status: string }>>(`/friend/status`, { params })
    },
    suggest(userID: string) {
        return http.get<ApiResponse<User[]>>(`/friend/suggest/${userID}`)
    },
    accepting(userID: string) {
        return http.get<ApiResponse<User[]>>(`/friend/accepting/${userID}`)
    },
    pending(userID: string) {
        return http.get<ApiResponse<User[]>>(`/friend/pending/${userID}`)
    },
    removeSuggest(ownerID: string, userID: string) {
        return http.post<ApiResponse<boolean>>(`/friend/suggest/${ownerID}/remove/${userID}`)
    },
    updateStatus(payload: Partial<Friend> & { friendID?: string; action: string }) {
        return http.post<ApiResponse<Friend>>(`/friend/status/update`, payload)
    },
}

export type { Friend }



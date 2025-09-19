import http from './http'
import { ApiResponse, Convention } from '@/types'

export const conventionsApi = {
    getConventionID() {
        return http.get<ApiResponse<{ id: string }>>('/convention/conventionID')
    },
    updateMessage(conventionID: string, messageID: string, payload: any) {
        return http.post(`/convention/${conventionID}/message/${messageID}`, payload)
    },
    getConventionIDs() {
        return http.get<ApiResponse<string[]>>('/convention/conventionIDs')
    },
    getByOwner(id: string) {
        return http.get<ApiResponse<Convention[]>>(`/convention/owner/${id}`)
    },
    getById(id: string) {
        return http.get<ApiResponse<Convention>>(`/convention/${id}`)
    },
    store(payload: Partial<Convention>) {
        return http.post<ApiResponse<Convention>>('/convention/store', payload)
    },
    storeGroup(payload: Partial<Convention>) {
        return http.post<ApiResponse<Convention>>('/convention/group/store', payload)
    },
    addMember(conventionID: string, payload: { userID: string }) {
        return http.post<ApiResponse<Convention>>(`/convention/group/${conventionID}/add`, payload)
    },
    logoutGroup(conventionID: string, userID: string) {
        return http.post<ApiResponse<Convention>>(`/convention/group/${conventionID}/logout/${userID}`)
    },
    updateNotifySettings(conventionID: string, payload: { notify: 'ALLOW' | 'NOT_ALLOW' | 'CUSTOM' }) {
        return http.post<ApiResponse<Convention>>(`/convention/${conventionID}/notify`, payload)
    },
    storeMessage(id: string, payload: { senderID: string; type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'NOTIFY' | 'POLL'; message: string | string[]; customMessage?: string; notify?: any }) {
        return http.post(`/convention/${id}`, payload)
    },
}



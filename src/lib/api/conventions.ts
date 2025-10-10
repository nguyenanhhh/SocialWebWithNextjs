import { api } from './client'
import type { Convention, ApiResponse } from '@/types'

interface Message {
    _id: string;
    content: string;
    senderID: string;
    type: string;
    createdAt: string;
}

export const conventionsApi = {
    getConventions: (userId: string) =>
        api.get<Convention[]>(`/convention/owner/${userId}`),

    getConventionById: (conventionId: string) =>
        api.get<Convention>(`/convention/${conventionId}`),

    createConvention: (data: Partial<Convention>) =>
        api.post<Convention>('/convention/store', data),

    createGroupConvention: (data: Partial<Convention>) =>
        api.post<Convention>('/convention/group/store', data),

    addMemberToGroup: (conventionId: string, userID: string) =>
        api.post<ApiResponse<any>>(`/convention/group/${conventionId}/add`, { userID }),

    removeMemberFromGroup: (conventionId: string, userID: string) =>
        api.post<ApiResponse<any>>(`/convention/group/${conventionId}/logout/${userID}`),

    sendMessage: (conventionId: string, data: Partial<Message>) =>
        api.post<Message>(`/convention/${conventionId}`, data),

    updateMessage: (conventionId: string, messageId: string, data: Partial<Message>) =>
        api.post<Message>(`/convention/${conventionId}/message/${messageId}`, data),

    updateNotifySettings: (conventionId: string, settings: any) =>
        api.post<ApiResponse<any>>(`/convention/${conventionId}/notify`, settings),

    getConventionID: () =>
        api.get<{ conventionID: string }>('/convention/conventionID'),

    getConventionIDs: () =>
        api.get<string[]>('/convention/conventionIDs')
}
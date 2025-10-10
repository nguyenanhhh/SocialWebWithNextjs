import { api } from './client'
import type { Group, ApiResponse } from '@/types'

export const groupsApi = {
    getAllGroups: () =>
        api.get<Group[]>('/group/all'),

    getUserGroups: (userID: string) =>
        api.get<Group[]>(`/group/user/${userID}`),

    getGroupById: (groupId: string) =>
        api.get<Group>(`/group/${groupId}`),

    createGroup: (data: Partial<Group>) =>
        api.post<Group>('/group/store', data),

    updateGroup: (groupId: string, data: Partial<Group>) =>
        api.put<Group>(`/group/${groupId}`, data),

    deleteGroup: (groupId: string) =>
        api.delete<ApiResponse<any>>(`/group/${groupId}`),

    addMember: (groupId: string, userID: string) =>
        api.post<ApiResponse<any>>(`/group/${groupId}/add`, { userID }),

    removeMember: (groupId: string, userID: string) =>
        api.delete<ApiResponse<any>>(`/group/${groupId}/member/${userID}`),

    leaveGroup: (groupId: string, userID: string) =>
        api.post<ApiResponse<any>>(`/group/${groupId}/leave`, { userID })
}

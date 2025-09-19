import http from './http'
import { ApiResponse, Group, Post, User } from '@/types'

export const groupsApi = {
    getAll() {
        return http.get<ApiResponse<Group[]>>('/group/all')
    },
    getByUser(userID: string) {
        return http.get<ApiResponse<Group[]>>(`/group/user/${userID}`)
    },
    getGroupPostsOfUser(groupID: string, userID: string) {
        return http.get<ApiResponse<Post[]>>(`/group/${groupID}/post/member/${userID}`)
    },
    getGroupPosts(groupID: string) {
        return http.get<ApiResponse<Post[]>>(`/group/${groupID}/post`)
    },
    getPendingMembers(groupID: string) {
        return http.get<ApiResponse<User[]>>(`/group/${groupID}/member/pending`)
    },
    getBlockingMembers(groupID: string) {
        return http.get<ApiResponse<User[]>>(`/group/${groupID}/member/blocking`)
    },
    getMemberByUser(groupID: string, userID: string) {
        return http.get<ApiResponse<User>>(`/group/${groupID}/member/${userID}`)
    },
    getMembers(groupID: string) {
        return http.get<ApiResponse<User[]>>(`/group/${groupID}/member`)
    },
    getById(groupID: string) {
        return http.get<ApiResponse<Group>>(`/group/${groupID}`)
    },
    requestJoin(groupID: string, userID: string) {
        return http.post<ApiResponse<any>>(`/group/${groupID}/member/${userID}/join`)
    },
    cancelJoin(groupID: string, userID: string) {
        return http.post<ApiResponse<any>>(`/group/${groupID}/member/${userID}/cancel`)
    },
    acceptMember(groupID: string, userID: string) {
        return http.post<ApiResponse<any>>(`/group/${groupID}/member/${userID}/accept`)
    },
    blockMember(groupID: string, userID: string) {
        return http.post<ApiResponse<any>>(`/group/${groupID}/member/${userID}/block`)
    },
    unblockMember(groupID: string, userID: string) {
        return http.post<ApiResponse<any>>(`/group/${groupID}/member/${userID}/unblock`)
    },
    exit(groupID: string, userID: string) {
        return http.delete<ApiResponse<any>>(`/group/${groupID}/member/${userID}/exit`)
    },
    deleteMember(groupID: string, userID: string) {
        return http.delete<ApiResponse<any>>(`/group/${groupID}/member/${userID}/delete`)
    },
    create(payload: { name: string; description?: string; avatar?: string }) {
        return http.post<ApiResponse<Group>>(`/group/create`, payload)
    },
    updateName(groupID: string, name: string) {
        return http.put<ApiResponse<Group>>(`/group/${groupID}/update/name`, { name })
    },
    updateAvatar(groupID: string, avatar: string) {
        return http.put<ApiResponse<Group>>(`/group/${groupID}/update/avatar`, { avatar })
    },
    updateBio(groupID: string, bio: string) {
        return http.put<ApiResponse<Group>>(`/group/${groupID}/update/bio`, { bio })
    },
}

export type { Group }



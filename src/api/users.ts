import http from './http'
import { ApiResponse, User } from '@/types'

export const usersApi = {
    create(payload: Partial<User>) {
        return http.post<User>('/user/create', payload)
    },
    activate(id: string) {
        return http.put<User>(`/user/active/${id}`)
    },
    inactivate(id: string) {
        return http.put<User>(`/user/inactive/${id}`)
    },
    updateBio(id: string, bio: string) {
        return http.put<User>(`/user/${id}/bio/update`, { value: bio })
    },
    updateUserName(id: string, userName: string) {
        return http.put<User>(`/user/${id}/username/update`, { value: userName })
    },
    updateAvatar(id: string, avatar: string) {
        return http.put<User>(`/user/${id}/avatar/update`, { avatar })
    },
    updateBackground(id: string, background: string) {
        return http.put<User>(`/user/${id}/background/update`, { background })
    },
    getAll() {
        return http.get<User[]>('/user/all')
    },
    getById(id: string) {
        return http.get<User>(`/user/${id}`)
    },
    conventionUserFriend(id: string) {
        return http.get<any>(`/user/conventionUserFriend/${id}`)
    },
}

export type { User }



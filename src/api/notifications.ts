import http from './http'
import { ApiResponse, Notification } from '@/types'

export const notificationsApi = {
    listByUser(userID: string) {
        return http.get<ApiResponse<Notification[]>>(`/notification/${userID}`)
    },
}

export type { Notification }



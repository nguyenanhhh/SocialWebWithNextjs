import http from './http'
import { ApiResponse } from '@/types'

export const postViewsApi = {
    add(userID: string, postID: string) {
        return http.post<ApiResponse<boolean>>(`/postview/add/${userID}/${postID}`)
    },
    remove(userID: string, postID: string) {
        return http.delete<ApiResponse<boolean>>(`/postview/remove/${userID}/${postID}`)
    },
}



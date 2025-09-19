import http from './http'
import { ApiResponse, Reaction } from '@/types'

export const reactionsApi = {
    list(targetID: string) {
        return http.get<ApiResponse<Reaction[]>>(`/reaction/post/${targetID}`)
    },
    getOfUser(targetID: string, userID: string) {
        return http.get<ApiResponse<Reaction>>(`/reaction/${targetID}/${userID}`)
    },
    update(payload: { targetID: string; userID: string; emoji?: string }) {
        return http.post<ApiResponse<Reaction>>(`/reaction/update`, payload)
    },
}

export type { Reaction }



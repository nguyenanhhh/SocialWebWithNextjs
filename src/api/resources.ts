import http from './http'
import { ApiResponse } from '@/types'

export const resourcesApi = {
    conventionFiles(id: string) {
        return http.get<ApiResponse<any[]>>(`/resource/convention/${id}`)
    },
    groupFiles(groupID: string, type: 'image' | 'video' | 'file') {
        return http.get<ApiResponse<any[]>>(`/resource/group/${groupID}/${type}`)
    },
}



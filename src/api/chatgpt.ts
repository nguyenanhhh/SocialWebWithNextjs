import http from './http'
import { ApiResponse } from '@/types'

export interface ChatGptSession { _id: string; userID: string; messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>; createdAt: string }

export const chatgptApi = {
    getByUser(userID: string) {
        return http.get<ApiResponse<ChatGptSession[]>>(`/chatgpt/${userID}`)
    },
    create(userID: string, payload: { content: string }) {
        return http.post<ApiResponse<ChatGptSession>>(`/chatgpt/${userID}`, payload)
    },
}


import http from './http'
import { ApiResponse } from '@/types'

export interface PollOption { _id: string; content: string; count: number }
export interface Poll { _id: string; question: string; options: PollOption[]; closed: boolean }

export const pollsApi = {
    get(pollID: string) {
        return http.get<ApiResponse<Poll>>(`/poll/${pollID}`)
    },
    create(payload: { question: string; options: string[] }) {
        return http.post<ApiResponse<Poll>>(`/poll/create`, payload)
    },
    close(pollID: string) {
        return http.post<ApiResponse<Poll>>(`/poll/${pollID}/close`)
    },
    addOption(pollID: string, content: string) {
        return http.post<ApiResponse<Poll>>(`/poll/${pollID}/option/add`, { content })
    },
    addPolling(pollID: string, optionID: string, userID: string) {
        return http.post<ApiResponse<Poll>>(`/poll/${pollID}/polling/add`, { optionID, userID })
    },
    updatePolling(pollID: string, optionID: string, userID: string) {
        return http.post<ApiResponse<Poll>>(`/poll/${pollID}/polling/update`, { optionID, userID })
    },
}




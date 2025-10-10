import http from './http'
import { Comment } from '@/types'

export const commentsApi = {
    getByPostId(postId: string) {
        return http.get<Comment[]>(`/comment/post/${postId}`)
    },
    create(payload: Partial<Comment>) {
        return http.post<Comment>(`/comment/store`, payload)
    },
    edit(id: string, payload: Partial<Comment>) {
        return http.put<Comment>(`/comment/${id}/update`, payload)
    },
    delete(id: string) {
        return http.delete<Comment>(`/comment/${id}/delete`)
    },
    react(id: string, userID: string) {
        return http.put<{ status: string; data: boolean }>(`/comment/${id}/react`, { userID })
    },
}

export type { Comment }
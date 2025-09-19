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
        return http.put<Comment>(`/comment/${id}/edit`, payload)
    },
    delete(id: string) {
        return http.delete<Comment>(`/comment/${id}/delete`)
    },
}

export type { Comment }
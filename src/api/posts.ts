import http from './http'
import { ApiResponse, PaginatedResponse, Post, CreatePostForm } from '@/types'

export interface GetUserPostsParams {
    userId?: string
    page?: number
    limit?: number
}

export const postsApi = {
    getNewfeed(userID: string, params?: { page?: number; limit?: number }) {
        return http.get<PaginatedResponse<Post>>(`/post/newfeed/${userID}`, { params })
    },
    getUserPosts(params?: GetUserPostsParams) {
        return http.get<PaginatedResponse<Post>>(`/post/user`, { params })
    },
    getTrash(userId: string) {
        return http.get<Post[]>(`/post/trash/${userId}`)
    },
    getById(id: string) {
        return http.get<Post>(`/post/${id}/`)
    },
    deleteMany(ids: string[]) {
        return http.put<{ deleted: number }>(`/post/delete`, { ids })
    },
    edit(id: string, payload: Partial<Post>) {
        return http.put<Post>(`/post/${id}/edit`, payload)
    },
    moveToTrash(id: string) {
        return http.put<Post>(`/post/${id}/trash`)
    },
    share(id: string, payload: { content?: string }) {
        return http.post<Post>(`/post/${id}/share`, payload)
    },
    create(payload: Partial<Post>) {
        return http.post<Post>(`/post/store`, payload)
    },
    createPost(payload: CreatePostForm) {
        const formData = new FormData()
        formData.append('content', payload.content)
        formData.append('scope', payload.scope)

        if (payload.groupID) {
            formData.append('groupID', payload.groupID)
        }

        if (payload.attachments) {
            payload.attachments.forEach((file) => {
                formData.append('attachments', file)
            })
        }

        return http.post<Post>('/post/store', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    },
}

export type { Post }



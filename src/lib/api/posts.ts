import { api } from './client'
import type { Post, Comment, Reaction, CreatePostForm, ApiResponse } from '@/types'

export const postsApi = {
    // Posts CRUD
    getNewfeed: (userID: string) =>
        api.get<Post[]>(`/post/newfeed/${userID}`),

    getUserPosts: (params?: { userId?: string; page?: number; limit?: number }) =>
        api.get<Post[]>('/post/user', { params }),

    getTrash: (userId: string) =>
        api.get<Post[]>(`/post/trash/${userId}`),

    getById: (id: string) =>
        api.get<Post>(`/post/${id}/`),

    create: (data: Partial<Post>) =>
        api.post<Post>('/post/store', data),

    createPost: (data: CreatePostForm) => {
        const formData = new FormData()
        formData.append('content', data.content)
        formData.append('scope', data.scope)

        if (data.groupID) {
            formData.append('groupID', data.groupID)
        }

        if (data.attachments) {
            data.attachments.forEach((file) => {
                formData.append('attachments', file)
            })
        }

        return api.post<Post>('/post/store', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    },

    edit: (id: string, data: Partial<Post>) =>
        api.put<Post>(`/post/${id}/edit`, data),

    deleteMany: (ids: string[]) =>
        api.put<{ deleted: number }>('/post/delete', { ids }),

    moveToTrash: (id: string) =>
        api.put<Post>(`/post/${id}/trash`),

    share: (id: string, data: { content?: string }) =>
        api.post<Post>(`/post/${id}/share`, data),
}

export const commentsApi = {
    getPostComments: (postID: string) =>
        api.get<Comment[]>(`/comment/${postID}`),

    createComment: (data: { postID: string; content: string; parentID?: string }) =>
        api.post<Comment>('/comment/store', data),

    editComment: (id: string, content: string) =>
        api.put<Comment>(`/comment/${id}/edit`, { content }),

    deleteComment: (id: string) =>
        api.delete<{ success: boolean }>(`/comment/${id}`),
}

export const reactionsApi = {
    createReaction: (data: { targetID: string; type: 'POST' | 'COMMENT'; emoji: string }) =>
        api.post<Reaction>('/reaction/store', data),

    deleteReaction: (targetID: string, type: 'POST' | 'COMMENT') =>
        api.delete<{ success: boolean }>(`/reaction/${targetID}/${type}`),

    getPostReactions: (postID: string) =>
        api.get<Reaction[]>(`/reaction/post/${postID}`),

    getCommentReactions: (commentID: string) =>
        api.get<Reaction[]>(`/reaction/comment/${commentID}`),
}
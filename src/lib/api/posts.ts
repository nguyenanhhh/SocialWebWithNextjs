import apiClient from './client'
import type { PostItem } from '@/redux/slices/postsSlice'

export interface CreatePostPayload {
	content: string
	attachments?: Array<{ url: string; type?: string; name?: string }>
	privacy?: 'public' | 'friends' | 'private'
}

export const PostsAPI = {
	async list(params?: { page?: number; limit?: number }) {
		const { data } = await apiClient.get<PostItem[]>('/posts', { params })
		return data
	},
	async create(payload: CreatePostPayload) {
		const { data } = await apiClient.post<PostItem>('/posts', payload)
		return data
	},
	async detail(postId: string) {
		const { data } = await apiClient.get<PostItem>(`/posts/${postId}`)
		return data
	},
	async remove(postId: string) {
		const { data } = await apiClient.delete<{ success: boolean }>(`/posts/${postId}`)
		return data
	},
}

export default PostsAPI

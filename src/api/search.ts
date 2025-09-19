import http from './http'
import { User, Post } from '@/types'

export const searchApi = {
    search(query: string) {
        return http.get<{ users: User[]; posts: Post[] }>(`/search?q=${encodeURIComponent(query)}`)
    },
}
import { api } from './client'
import type { Post, User, ApiResponse } from '@/types'

export const searchApi = {
    searchPosts: (userID: string, query: string) =>
        api.get<Post[]>(`/search/post/${userID}/${encodeURIComponent(query)}`),

    searchUsers: (userID: string, query: string) =>
        api.get<User[]>(`/search/user/${userID}/${encodeURIComponent(query)}`),

    searchGroups: (userID: string, query: string) =>
        api.get<any[]>(`/search/group/${userID}/${encodeURIComponent(query)}`),

    searchImages: (userID: string, query: string) =>
        api.get<Post[]>(`/search/image/${userID}/${encodeURIComponent(query)}`),

    searchVideos: (userID: string, query: string) =>
        api.get<Post[]>(`/search/video/${userID}/${encodeURIComponent(query)}`),

    getSearchHistory: (userID: string) =>
        api.get<any[]>(`/search/history/${userID}`),

    addSearchHistory: (userID: string, type: string, search: string) =>
        api.post<ApiResponse<any>>(`/search/history/add/${userID}/${type}/${encodeURIComponent(search)}`),

    removeAllSearchHistory: (userID: string) =>
        api.delete<ApiResponse<any>>(`/search/history/remove/all/${userID}`),

    removeSearchHistory: (searchID: string) =>
        api.delete<ApiResponse<any>>(`/search/history/remove/${searchID}`),

    search: (params: { query: string; type?: string; userID: string }) => {
        const { query, type = 'all', userID } = params;

        if (type === 'posts') {
            return searchApi.searchPosts(userID, query);
        } else if (type === 'users') {
            return searchApi.searchUsers(userID, query);
        } else if (type === 'groups') {
            return searchApi.searchGroups(userID, query);
        } else if (type === 'images') {
            return searchApi.searchImages(userID, query);
        } else if (type === 'videos') {
            return searchApi.searchVideos(userID, query);
        } else {
            return Promise.all([
                searchApi.searchPosts(userID, query),
                searchApi.searchUsers(userID, query),
                searchApi.searchGroups(userID, query)
            ]).then(([posts, users, groups]) => ({
                data: { posts, users, groups, hashtags: [] }
            }));
        }
    }
}

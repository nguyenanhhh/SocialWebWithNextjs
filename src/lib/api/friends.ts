import { api } from './client'
import type { Friend, User, ApiResponse } from '@/types'

export const friendsApi = {
    // Friend requests
    sendFriendRequest: (data: { userID: string; friendID: string }) => 
        api.post<Friend>('/friend/request', data),
    
    acceptFriendRequest: (friendID: string) => 
        api.put<Friend>(`/friend/accept/${friendID}`),
    
    declineFriendRequest: (friendID: string) => 
        api.put<Friend>(`/friend/decline/${friendID}`),
    
    cancelFriendRequest: (friendID: string) => 
        api.put<Friend>(`/friend/cancel/${friendID}`),
    
    // Friend management
    getFriends: (userID: string) => 
        api.get<Friend[]>(`/friend/${userID}`),
    
    getFriendRequests: (userID: string) => 
        api.get<Friend[]>(`/friend/requests/${userID}`),
    
    getFriendSuggestions: (userID: string) => 
        api.get<User[]>(`/friend/suggest/${userID}`),
    
    unfriend: (friendID: string) => 
        api.delete<{ success: boolean }>(`/friend/${friendID}`),
    
    // Friend status
    getFriendStatus: (userID: string, friendID: string) => 
        api.get<{ status: string }>(`/friend/status/${userID}/${friendID}`),
}

import { api } from './client'
import type { Convention, ChatMessage, ApiResponse } from '@/types'

export const conventionsApi = {
    // Convention CRUD
    getConvention: (id: string) => 
        api.get<Convention>(`/convention/${id}`),
    
    getConventions: (userID: string) => 
        api.get<Convention[]>(`/convention/owner/${userID}`),
    
    getConventionIDs: (userID: string) => 
        api.get<string[]>(`/convention/conventionIDs`, { userID }),
    
    createConvention: (data: { uids: string[]; type?: 'private' | 'group' }) => 
        api.post<Convention>('/convention/store', data),
    
    createGroupConvention: (data: { 
        name: string; 
        uids: string[]; 
        avatar?: string; 
    }) => 
        api.post<Convention>('/convention/group/store', data),
    
    // Messages
    sendMessage: (conventionID: string, data: {
        senderID: string;
        senderName: string;
        senderAvatar?: string;
        type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'NOTIFY' | 'POLL';
        content: string;
        attachments?: any[];
        pollID?: string;
    }) => 
        api.post<ChatMessage>(`/convention/${conventionID}`, data),
    
    updateMessage: (conventionID: string, messageID: string, data: {
        content?: string;
        action?: 'EDIT' | 'REMOVE' | 'DELETE';
    }) => 
        api.post<ChatMessage>(`/convention/${conventionID}/message/${messageID}`, data),
    
    // Group management
    addMemberToGroup: (conventionID: string, data: { userID: string }) => 
        api.post<Convention>(`/convention/group/${conventionID}/add`, data),
    
    removeMemberFromGroup: (conventionID: string, userID: string) => 
        api.post<Convention>(`/convention/group/${conventionID}/logout/${userID}`),
    
    // Settings
    updateNotifySettings: (conventionID: string, data: { 
        notify: 'ALLOW' | 'NOT_ALLOW' | 'CUSTOM' 
    }) => 
        api.post<Convention>(`/convention/${conventionID}/notify`, data),
}

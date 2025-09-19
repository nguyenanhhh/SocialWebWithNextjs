import { api } from './client'
import type { Notification, ApiResponse } from '@/types'

export const notificationsApi = {
    // Notifications CRUD
    getNotifications: (userID: string, params?: { page?: number; limit?: number }) => 
        api.get<Notification[]>(`/notification/${userID}`, params),
    
    markAsRead: (notificationID: string) => 
        api.put<Notification>(`/notification/${notificationID}/read`),
    
    markAllAsRead: (userID: string) => 
        api.put<{ success: boolean }>(`/notification/${userID}/read-all`),
    
    deleteNotification: (notificationID: string) => 
        api.delete<{ success: boolean }>(`/notification/${notificationID}`),
    
    deleteAllNotifications: (userID: string) => 
        api.delete<{ success: boolean }>(`/notification/${userID}/all`),
}

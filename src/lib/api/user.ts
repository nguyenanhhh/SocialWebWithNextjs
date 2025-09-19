import { api } from './client'
import type { User, ApiResponse, LoginForm, RegisterForm, UpdateProfileForm } from '@/types'

export const userApi = {
    // Authentication
    login: (data: LoginForm) => 
        api.post<User>('/user/login', data),
    
    register: (data: RegisterForm) => 
        api.post<User>('/user/create', data),
    
    // User CRUD
    getUser: (id: string) => 
        api.get<User>(`/user/${id}`),
    
    getAllUsers: () => 
        api.get<User[]>('/user/all'),
    
    updateBio: (id: string, bio: string) => 
        api.put<User>(`/user/${id}/bio/update`, { bio }),
    
    updateUserName: (id: string, userName: string) => 
        api.put<User>(`/user/${id}/username/update`, { userName }),
    
    updateAvatar: (id: string, formData: FormData) => 
        api.upload<User>(`/user/${id}/avatar/update`, formData),
    
    updateBackground: (id: string, formData: FormData) => 
        api.upload<User>(`/user/${id}/background/update`, formData),
    
    // User status
    activeUser: (id: string) => 
        api.put<User>(`/user/active/${id}`),
    
    inactiveUser: (id: string) => 
        api.put<User>(`/user/inactive/${id}`),
    
    // Friend information for conventions
    getConventionUserInfo: (id: string) => 
        api.get<User[]>(`/user/conventionUserFriend/${id}`),
}

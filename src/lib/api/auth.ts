import apiClient from './client'

export interface LoginPayload { email: string; password: string }
export interface RegisterPayload { email: string; password: string; userName: string }

export const AuthAPI = {
    async login(payload: LoginPayload) {
        const { data } = await apiClient.post('/auth/login', payload)
        return data
    },
    async register(payload: RegisterPayload) {
        const { data } = await apiClient.post('/auth/register', payload)
        return data
    },
    async me() {
        const { data } = await apiClient.get('/auth/me')
        return data
    },
    async logout() {
        const { data } = await apiClient.post('/auth/logout')
        return data
    },
}

export default AuthAPI

import axios, { AxiosResponse } from 'axios'
import { config } from '@/lib/config'
import type { ApiResponse } from '@/types'

export const apiClient = axios.create({
    baseURL: config.apiBaseUrl,
    withCredentials: false,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
})

apiClient.interceptors.request.use((requestConfig) => {
    const token = localStorage.getItem('authToken')
    if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`
    }
    return requestConfig
})
apiClient.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<any>>) => {
        if (response.data.state === 'ERROR') {
            throw new Error(response.data.message || 'API Error')
        }
        return response
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken')
            window.location.href = '/auth/login'
        }
        return Promise.reject(error)
    }
)
export const api = {
    get: <T>(url: string, params?: any) =>
        apiClient.get<ApiResponse<T>>(url, { params }),

    post: <T>(url: string, data?: any) =>
        apiClient.post<ApiResponse<T>>(url, data),

    put: <T>(url: string, data?: any) =>
        apiClient.put<ApiResponse<T>>(url, data),

    delete: <T>(url: string) =>
        apiClient.delete<ApiResponse<T>>(url),

    upload: <T>(url: string, formData: FormData) =>
        apiClient.post<ApiResponse<T>>(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
}

export default apiClient

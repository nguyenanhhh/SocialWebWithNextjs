import axios from 'axios'
import { config } from '@/lib/config'
import { getToken, setToken } from '@/lib/token'

export const apiClient = axios.create({
    baseURL: config.apiBaseUrl,
    withCredentials: true,
    timeout: 15000,
})

apiClient.interceptors.request.use((requestConfig) => {
    const token = getToken()
    if (token) {
        // Ensure headers exists and then assign Authorization to avoid AxiosHeaders typing issues
        requestConfig.headers = requestConfig.headers ?? {}
            ; (requestConfig.headers as any).Authorization = `Bearer ${token}`
    }
    return requestConfig
})

apiClient.interceptors.response.use(
    (res) => res,
    (error) => {
        const status = error?.response?.status
        if (status === 401) {
            try { setToken(null) } catch { }
        }
        return Promise.reject(error)
    }
)

export default apiClient

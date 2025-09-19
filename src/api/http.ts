import axios, { AxiosError, AxiosResponse } from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://172.18.23.6:8080'

export const http = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

http.interceptors.response.use(
    (response: AxiosResponse) => {
        return response.data
    },
    (error: AxiosError) => {
        const status = error.response?.status
        const url = (error.config as any)?.url
        console.error('HTTP Error', { status, url, message: error.message })
        return Promise.reject(error)
    }
)

export default http



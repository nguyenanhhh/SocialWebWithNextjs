import http from './http'

export const rootApi = {
    health() {
        return http.get<{ state: string }>(`/`)
    },
    home() {
        return http.get<string>(`/home`)
    },
}



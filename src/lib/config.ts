export const config = {
	apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
	// socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8080',
}

export type AppConfig = typeof config

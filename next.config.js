/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_API_BASE_URL: 'http://172.18.23.6:8080',
        NEXT_PUBLIC_SOCKET_URL: 'http://172.18.23.6:8080',
    },
    experimental: {
        appDir: true
    },
    typescript: {
        ignoreBuildErrors: false
    },
    eslint: {
        ignoreDuringBuilds: false
    }
}

module.exports = nextConfig

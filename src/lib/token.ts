const TOKEN_KEY = 'access_token'

export function getToken(): string | null {
    if (typeof window === 'undefined') return null
    try {
        return window.localStorage.getItem(TOKEN_KEY)
    } catch {
        return null
    }
}

export function removeToken() {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.removeItem(TOKEN_KEY)
    } catch {}
  }
  
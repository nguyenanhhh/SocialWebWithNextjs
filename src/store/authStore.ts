import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { connectSocket, disconnectSocket } from '@/socket/client'

export interface AuthStoreState {
    isAuthenticated: boolean
    user: User | null
    token: string | null
    setUser: (user: User | null) => void
    setToken: (token: string | null) => void
    login: (user: User, token: string) => void
    logout: () => void
    updateUser: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthStoreState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            user: null,
            token: null,

            setUser: (user) => {
                set(() => ({
                    user,
                    isAuthenticated: Boolean(user)
                }));
            },

            setToken: (token) => set(() => ({
                token,
                isAuthenticated: Boolean(token)
            })),

            login: (user, token) => {
                localStorage.setItem('authToken', token)

                if (user && user._id) {
                    connectSocket(user._id)
                }

                set(() => ({
                    user,
                    token,
                    isAuthenticated: true
                }))
            },

            logout: () => set(() => {
                localStorage.removeItem('authToken')
                disconnectSocket()

                return {
                    user: null,
                    token: null,
                    isAuthenticated: false
                }
            }),

            updateUser: (updates) => set((state) => ({
                user: state.user ? { ...state.user, ...updates } : null
            })),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
)

export default useAuthStore



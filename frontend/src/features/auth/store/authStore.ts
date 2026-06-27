import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
    accessToken: string | null,
    isAuthenticated: boolean,
    setAuth: (acessToken: string) => void,
    clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            isAuthenticated: false,
            setAuth: (accessToken) => set({ accessToken, isAuthenticated: true }),

            clearAuth: () => set({ accessToken: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
        }
    )
);

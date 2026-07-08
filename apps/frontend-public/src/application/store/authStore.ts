import { create } from 'zustand'
import { api } from '@/infrastructure/api/httpClient'

export interface User {
  id: string
  email: string
  rol: 'asesor' | 'admin'
  asesor?: {
    id: string
    nombre: string
    telefono: string
    foto?: string
  } | null
}

interface AuthState {
  token: string | null
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true })
    try {
      const res = await api.post<{ token: string; user: User }>('/auth/login', { email, password })
      localStorage.setItem('token', res.token)
      set({ token: res.token, user: res.user, loading: false })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null })
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const user = await api.get<User>('/auth/me')
      set({ token, user })
    } catch {
      localStorage.removeItem('token')
      set({ token: null, user: null })
    }
  },
}))

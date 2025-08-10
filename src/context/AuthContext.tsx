import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { AuthData, User } from '../types'
import { get, post } from '../api'

// Key to persist auth in localStorage
const AUTH_KEY = 'jobtracker:auth'

type AuthContextValue = {
    auth: AuthData | null
    login: (username: string, password: string) => Promise<void>
    register: (username: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [auth, setAuth] = useState<AuthData | null>(null)

    useEffect(() => {
        // Restore session on refresh
        const raw = localStorage.getItem(AUTH_KEY)
        if (raw) {
            try { setAuth(JSON.parse(raw)) } catch { localStorage.removeItem(AUTH_KEY) }
        }
    }, [])

    const persist = (data: AuthData | null) => {
        setAuth(data)
        if (data) localStorage.setItem(AUTH_KEY, JSON.stringify(data))
        else localStorage.removeItem(AUTH_KEY)
    }

    const login = async (username: string, password: string) => {
        // MVP auth: query JSON Server users by username/password
        const users = await get<User[]>(`/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
        if (users.length === 0) throw new Error('Invalid credentials')
        const user = users[0]
        // Fake token for demonstration
        persist({ token: `fake-token-${user.id}-${Date.now()}`, user })
    }

    const register = async (username: string, password: string) => {
        // Prevent duplicate usernames
        const existing = await get<User[]>(`/users?username=${encodeURIComponent(username)}`)
        if (existing.length) throw new Error('Username already taken')
        const created = await post<User>('/users', { username, password })
        persist({ token: `fake-token-${created.id}-${Date.now()}`, user: created })
    }

    const logout = () => persist(null)

    const value = useMemo(() => ({ auth, login, register, logout }), [auth])
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}

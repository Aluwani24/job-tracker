// Simple API layer for JSON Server.
// Note: JSON Server runs at http://localhost:3001
const BASE_URL = 'http://localhost:3001'

export async function get<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, init)
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
    return res.json()
}

export async function post<T>(path: string, data: unknown, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
        body: JSON.stringify(data),
        ...init
    })
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`)
    return res.json()
}

export async function patch<T>(path: string, data: unknown, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
        body: JSON.stringify(data),
        ...init
    })
    if (!res.ok) throw new Error(`PATCH ${path} failed: ${res.status}`)
    return res.json()
}

export async function del(path: string, init?: RequestInit): Promise<void> {
    const res = await fetch(`${BASE_URL}${path}`, { method: 'DELETE', ...init })
    if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`)
}

import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
    const { login } = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const nav = useNavigate()
    const loc = useLocation()
    const redirect = new URLSearchParams(loc.search).get('redirect') || '/home'

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await login(username, password)
            nav(redirect, { replace: true })
        } catch (err: any) {
            setError(err.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: 480, margin: '24px auto' }}>
                <h2>Welcome back</h2>
                <form className="form" onSubmit={onSubmit}>
                    <div>
                        <label>Username</label>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus required />
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <button disabled={loading} type="submit">{loading ? 'Signing in...' : 'Login'}</button>
                </form>
                <div className="hr" />
                <div className="helper">
                    No account? <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    )
}
export default Login

import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

const Register: React.FC = () => {
    const { register } = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const nav = useNavigate()

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true); setError(null)
        try {
            await register(username, password)
            nav('/home', { replace: true })
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Registration failed')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: 480, margin: '24px auto' }}>
                <h2>Create your account</h2>
                <form className="form" onSubmit={onSubmit}>
                    <div>
                        <label>Username</label>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus required />
                        <div className="helper">Use a unique username</div>
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <button disabled={loading} type="submit">{loading ? 'Creating...' : 'Register'}</button>
                </form>
                <div className="hr" />
                <div className="helper">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    )
}
export default Register

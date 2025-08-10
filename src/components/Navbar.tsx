import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar: React.FC = () => {
    const { auth, logout } = useAuth()
    return (
        <nav className="nav">
            <div className="row">
                <Link className="brand" to="/">JobTracker</Link>
                <NavLink to="/home">Home</NavLink>
                <NavLink to="/landing">About</NavLink>
            </div>
            <div className="row">
                {auth ? (
                    <>
                        <span className="helper">Hi, {auth.user.username}</span>
                        <button className="ghost" onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login"><button className="ghost">Login</button></NavLink>
                        <NavLink to="/register"><button>Register</button></NavLink>
                    </>
                )}
            </div>
        </nav>
    )
}
export default Navbar

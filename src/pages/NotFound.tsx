import React from 'react'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => {
    return (
        <div className="container">
            <div className="card">
                <h2>404 — Page not found</h2>
                <p className="helper">The path you tried doesn’t exist.</p>
                <Link to="/"><button>Go home</button></Link>
            </div>
        </div>
    )
}
export default NotFound

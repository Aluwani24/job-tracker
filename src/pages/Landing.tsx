import React from 'react'
import { Link } from 'react-router-dom'

const Landing: React.FC = () => {
    return (
        <div className="container">
            <section className="card" style={{ marginTop: 16 }}>
                <h1>Track your job hunt with clarity</h1>
                <p className="helper">
                    Add applications, monitor status, and keep interview notes handy. Filter, sort, and search—all synced to the URL.
                </p>
                <div className="row">
                    <Link to="/register"><button>Get started</button></Link>
                    <Link to="/login"><button className="ghost">I already have an account</button></Link>
                </div>
            </section>

            <section className="card" style={{ marginTop: 16 }}>
                <h3>Why this helps</h3>
                <ul>
                    <li>See how many applications are Applied, Interviewed, and Rejected</li>
                    <li>Quickly search by company or role</li>
                    <li>Sort by date to spot momentum in your pipeline</li>
                    <li>Open a job page for detailed interview prep</li>
                </ul>
            </section>
        </div>
    )
}
export default Landing

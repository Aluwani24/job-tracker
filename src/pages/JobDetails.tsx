import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { type Job } from '../types'
import StatusBadge from '../components/StatusBadge'
import { get } from '../api'

// Dynamic route uses URL param :jobId
const JobDetails: React.FC = () => {
    const { jobId } = useParams()
    const [job, setJob] = useState<Job | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        (async () => {
            try {
                const data = await get<Job>(`/jobs/${jobId}`)
                setJob(data)
            } catch (err: unknown) {
                if (
                    err &&
                    typeof err === 'object' &&
                    err !== null &&
                    'message' in (err as object) &&
                    typeof (err as { message?: unknown }).message === 'string'
                ) {
                    setError((err as { message: string }).message)
                } else {
                    setError('Failed to load job')
                }
            }
        })()
    }, [jobId])

    if (error) return <div className="container"><div className="card error">{error}</div></div>
    if (!job) return <div className="container"><div className="card">Loading...</div></div>

    return (
        <div className="container">
            <div className="card">
                <div className="row" style={{ justifyContent: 'space-between' }}>
                    <h2 style={{ margin: 0 }}>{job.company}</h2>
                    <StatusBadge status={job.status} />
                </div>
                <div className="helper">{job.role}</div>
                <div className="helper">Applied: {job.dateApplied}</div>
                <div className="hr" />
                <h3>Details</h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>
                    {job.details || 'No extra details provided.'}
                </p>

                <div className="hr" />
                <h3>Company info (example fields)</h3>
                <ul>
                    <li>Address: Optional — let applicants store location for travel plans</li>
                    <li>Contacts: Hiring manager’s name or email</li>
                    <li>Requirements: Skills to highlight in interviews</li>
                    <li>Duties: What the role focuses on</li>
                </ul>
            </div>
        </div>
    )
}

export default JobDetails

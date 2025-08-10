import React from 'react'
import { Link } from 'react-router-dom'
import type { Job } from '../types'
import StatusBadge from './StatusBadge'

type Props = {
    job: Job
    onEdit: (job: Job) => void
    onDelete: (job: Job) => void
}
const JobCard: React.FC<Props> = ({ job, onEdit, onDelete }) => {
    return (
        <div className="card">
            <div className="row" style={{ justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0 }}>{job.company}</h3>
                <StatusBadge status={job.status} />
            </div>
            <div className="helper" style={{ marginTop: 4 }}>{job.role}</div>
            <div className="helper">Applied: {job.dateApplied}</div>
            <div className="hr" />
            <div className="row" style={{ justifyContent: 'space-between' }}>
                <Link to={`/jobs/${job.id}`}>More details</Link>
                <div className="row">
                    <button className="ghost" onClick={() => onEdit(job)}>Edit</button>
                    <button onClick={() => onDelete(job)} style={{ background: 'var(--danger)', color: 'white' }}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}
export default JobCard

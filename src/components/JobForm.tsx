import React, { useEffect, useState } from 'react'
import type { Job, JobStatus } from '../types'

// Reusable form for Create + Update
type Props = {
    initial?: Partial<Job>
    onSubmit: (data: Omit<Job, 'id'>) => Promise<void> | void
    onCancel?: () => void
    userId: number
}

const JobForm: React.FC<Props> = ({ initial, onSubmit, onCancel, userId }) => {
    const [company, setCompany] = useState(initial?.company ?? '')
    const [role, setRole] = useState(initial?.role ?? '')
    const [status, setStatus] = useState<JobStatus>((initial?.status as JobStatus) ?? 'Applied')
    const [dateApplied, setDateApplied] = useState(initial?.dateApplied ?? '')
    const [details, setDetails] = useState(initial?.details ?? '')
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        // Prefill when editing
        setCompany(initial?.company ?? '')
        setRole(initial?.role ?? '')
        setStatus((initial?.status as JobStatus) ?? 'Applied')
        setDateApplied(initial?.dateApplied ?? '')
        setDetails(initial?.details ?? '')
    }, [initial])

    const validate = () => {
        if (!company.trim()) return 'Company is required'
        if (!role.trim()) return 'Role is required'
        if (!dateApplied) return 'Date applied is required'
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const v = validate()
        if (v) { setError(v); return }
        setError(null)
        setSubmitting(true)
        try {
            await onSubmit({ userId, company: company.trim(), role: role.trim(), status, dateApplied, details: details.trim() })
            // Clear only when creating new
            if (!initial?.id) {
                setCompany(''); setRole(''); setStatus('Applied'); setDateApplied(''); setDetails('')
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Something went wrong')
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="form-row two">
                <div>
                    <label>Company</label>
                    <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g., Acme Corp" required />
                </div>
                <div>
                    <label>Role</label>
                    <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g., Frontend Developer" required />
                </div>
            </div>

            <div className="form-row two">
                <div>
                    <label>Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value as JobStatus)}>
                        <option>Applied</option>
                        <option>Interviewed</option>
                        <option>Rejected</option>
                    </select>
                    <div className="helper">Color-coded: Yellow=Applied, Green=Interviewed, Red=Rejected</div>
                </div>
                <div>
                    <label>Date applied</label>
                    <input type="date" value={dateApplied} onChange={(e) => setDateApplied(e.target.value)} required />
                </div>
            </div>

            <div>
                <label>Details (duties, requirements, contacts, address)</label>
                <textarea rows={4} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Optional notes..." />
            </div>

            {error && <div className="error">{error}</div>}

            <div className="row" style={{ justifyContent: 'flex-end' }}>
                {onCancel && <button type="button" className="ghost" onClick={onCancel}>Cancel</button>}
                <button type="submit" disabled={submitting}>{initial?.id ? 'Update' : 'Add'} Job</button>
            </div>
        </form>
    )
}

export default JobForm

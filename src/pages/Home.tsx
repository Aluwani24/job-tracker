import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { del, get, patch, post } from '../api'
import type { Job, SortParam, StatusFilter } from '../types'
import { useAuth } from '../context/AuthContext'
import JobCard from '../components/JobCard'
import JobForm from '../components/JobForm'

// Persist user's last query/filter/sort to localStorage (link details)
const QUERY_KEY = 'jobtracker:query'

function useQueryState() {
    const [sp, setSp] = useSearchParams()

    // Read values from the URL
    const q = sp.get('q') ?? ''
    const status = (sp.get('status') as StatusFilter) || 'All'
    const sort = (sp.get('sort') as SortParam) || 'date_desc'

    // Mirror to localStorage so returning users keep their last "link details"
    useEffect(() => {
        const data = { q, status, sort }
        localStorage.setItem(QUERY_KEY, JSON.stringify(data))
    }, [q, status, sort])

    // If no params in URL but we have persisted values, load them once
    useEffect(() => {
        if (!sp.toString()) {
            const raw = localStorage.getItem(QUERY_KEY)
            if (raw) {
                try {
                    const data = JSON.parse(raw)
                    setSp({ q: data.q ?? '', status: data.status ?? 'All', sort: data.sort ?? 'date_desc' }, { replace: true })
                } catch { }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const update = (patchObj: Partial<{ q: string; status: StatusFilter; sort: SortParam }>) => {
        const next = new URLSearchParams(sp)
        if (patchObj.q !== undefined) next.set('q', patchObj.q)
        if (patchObj.status !== undefined) next.set('status', patchObj.status)
        if (patchObj.sort !== undefined) next.set('sort', patchObj.sort!)
        setSp(next, { replace: false })
    }
    return { q, status, sort, update }
}

const Home: React.FC = () => {
    const { auth } = useAuth()
    const userId = auth!.user.id

    const { q, status, sort, update } = useQueryState()
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [editing, setEditing] = useState<Job | null>(null)
    const [showForm, setShowForm] = useState(false)

    // Build server query for JSON Server: filter by userId
    const fetchJobs = useCallback(async () => {
        setLoading(true); setError(null)
        try {
            const params = new URLSearchParams()
            params.set('userId', String(userId))

            // Search across fields using ?q= (JSON Server does simple full-text)
            if (q) params.set('q', q)

            // Filter by status when not 'All'
            if (status !== 'All') params.set('status', status)

            // Sort by dateApplied using _sort/_order
            if (sort) {
                params.set('_sort', 'dateApplied')
                params.set('_order', sort === 'date_asc' ? 'asc' : 'desc')
            }

            const data = await get<Job[]>(`/jobs?${params.toString()}`)
            setJobs(data)
        } catch (err: any) {
            setError(err.message || 'Failed to load jobs')
        } finally {
            setLoading(false)
        }
    }, [q, sort, status, userId])

    useEffect(() => { fetchJobs() }, [fetchJobs])

    const onCreate = async (payload: Omit<Job, 'id'>) => {
        await post<Job>('/jobs', payload)
        setShowForm(false)
        await fetchJobs()
    }

    const onUpdate = async (payload: Omit<Job, 'id'>) => {
        if (!editing?.id) return
        await patch<Job>(`/jobs/${editing.id}`, payload)
        setEditing(null); setShowForm(false)
        await fetchJobs()
    }

    const onDelete = async (job: Job) => {
        if (!confirm(`Delete ${job.company} • ${job.role}?`)) return
        await del(`/jobs/${job.id}`)
        await fetchJobs()
    }

    const toolbar = (
        <div className="toolbar card">
            <input
                value={q}
                onChange={(e) => update({ q: e.target.value })}
                placeholder="Search by company or role (syncs to URL param ?q=)"
            />
            <select value={status} onChange={(e) => update({ status: e.target.value as StatusFilter })}>
                <option value="All">All statuses</option>
                <option value="Applied">Applied</option>
                <option value="Interviewed">Interviewed</option>
                <option value="Rejected">Rejected</option>
            </select>
            <select value={sort ?? 'date_desc'} onChange={(e) => update({ sort: e.target.value as any })}>
                <option value="date_desc">Date: Newest first</option>
                <option value="date_asc">Date: Oldest first</option>
            </select>
            <div className="row" style={{ justifyContent: 'flex-end' }}>
                <button onClick={() => { setEditing(null); setShowForm(true) }}>+ Add Job</button>
            </div>
        </div>
    )

    const counts = useMemo(() => {
        return {
            applied: jobs.filter(j => j.status === 'Applied').length,
            interviewed: jobs.filter(j => j.status === 'Interviewed').length,
            rejected: jobs.filter(j => j.status === 'Rejected').length
        }
    }, [jobs])

    return (
        <div className="container">
            {toolbar}

            <div className="card">
                <div className="row" style={{ gap: 16 }}>
                    <div className="badge applied">Applied: {counts.applied}</div>
                    <div className="badge interviewed">Interviewed: {counts.interviewed}</div>
                    <div className="badge rejected">Rejected: {counts.rejected}</div>
                </div>
            </div>

            <div style={{ height: 10 }} />

            {loading && <div className="card">Loading...</div>}
            {error && <div className="card error">{error}</div>}

            {!loading && !jobs.length && (
                <div className="empty">No jobs match your criteria. Try adjusting search/filter.</div>
            )}

            <div className="grid">
                {jobs.map(job => (
                    <JobCard
                        key={job.id}
                        job={job}
                        onEdit={(j) => { setEditing(j); setShowForm(true) }}
                        onDelete={onDelete}
                    />
                ))}
            </div>

            {showForm && (
                <div className="card" style={{ marginTop: 16 }}>
                    <h3>{editing ? 'Edit Job' : 'Add Job'}</h3>
                    <JobForm
                        initial={editing ?? undefined}
                        userId={userId}
                        onSubmit={editing ? onUpdate : onCreate}
                        onCancel={() => { setEditing(null); setShowForm(false) }}
                    />
                </div>
            )}
        </div>
    )
}
export default Home

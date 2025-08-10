import React from 'react'
import type { JobStatus } from '../types'

// Color-coded status label
const StatusBadge: React.FC<{ status: JobStatus }> = ({ status }) => {
    const cls =
        status === 'Applied' ? 'badge applied' :
            status === 'Interviewed' ? 'badge interviewed' :
                'badge rejected'
    return <span className={cls}>{status}</span>
}
export default StatusBadge

export type JobStatus = 'Applied' | 'Interviewed' | 'Rejected'

export interface Job {
  id?: number
  userId: number
  company: string
  role: string
  status: JobStatus
  dateApplied: string // YYYY-MM-DD
  details?: string
}

export interface User {
  id: number
  username: string
}

export interface AuthData {
  token: string
  user: User
}

export type SortParam = 'date_asc' | 'date_desc' | null
export type StatusFilter = JobStatus | 'All'

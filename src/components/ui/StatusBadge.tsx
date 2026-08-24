import { Badge } from './Badge'

const STATUS_MAP: Record<string, { label: string; tone: 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent' }> = {
  ACTIVE: { label: 'Active', tone: 'success' },
  ON_LEAVE: { label: 'On Leave', tone: 'info' },
  SUSPENDED: { label: 'Suspended', tone: 'warning' },
  TERMINATED: { label: 'Terminated', tone: 'danger' },
  INACTIVE: { label: 'Inactive', tone: 'neutral' },
  PRESENT: { label: 'Present', tone: 'success' },
  ABSENT: { label: 'Absent', tone: 'danger' },
  LATE: { label: 'Late', tone: 'warning' },
  EARLY_DEPARTURE: { label: 'Early Departure', tone: 'warning' },
  HALF_DAY: { label: 'Half Day', tone: 'info' },
  WEEKEND: { label: 'Weekend', tone: 'neutral' },
  EXCUSED: { label: 'Excused', tone: 'info' },
  REMOTE: { label: 'Remote', tone: 'accent' },
  PENDING: { label: 'Pending', tone: 'warning' },
  APPROVED: { label: 'Approved', tone: 'success' },
  REJECTED: { label: 'Rejected', tone: 'danger' },
  CANCELLED: { label: 'Cancelled', tone: 'neutral' },
  OPEN: { label: 'Open', tone: 'success' },
  CLOSED: { label: 'Closed', tone: 'neutral' },
  DRAFT: { label: 'Draft', tone: 'neutral' },
  APPLIED: { label: 'Applied', tone: 'neutral' },
  SCREENING: { label: 'Screening', tone: 'info' },
  SHORTLISTED: { label: 'Shortlisted', tone: 'brand' },
  INTERVIEW: { label: 'Interview', tone: 'accent' },
  OFFER: { label: 'Offer', tone: 'warning' },
  HIRED: { label: 'Hired', tone: 'success' },
  SENT: { label: 'Sent', tone: 'info' },
  ACCEPTED: { label: 'Accepted', tone: 'success' },
  DECLINED: { label: 'Declined', tone: 'danger' },
  EXPIRED: { label: 'Expired', tone: 'danger' },
  COMPLETED: { label: 'Completed', tone: 'success' },
  IN_PROGRESS: { label: 'In Progress', tone: 'info' },
  ENROLLED: { label: 'Enrolled', tone: 'neutral' },
  DROPPED: { label: 'Dropped', tone: 'danger' },
  VALID: { label: 'Valid', tone: 'success' },
  EXPIRING: { label: 'Expiring Soon', tone: 'warning' },
  SUCCESS: { label: 'Success', tone: 'success' },
  FAILURE: { label: 'Failure', tone: 'danger' },
  SCHEDULED: { label: 'Scheduled', tone: 'info' },
}

export function StatusBadge({ status }: { status: string }) {
  const entry = STATUS_MAP[status] ?? { label: status, tone: 'neutral' as const }
  return <Badge tone={entry.tone}>{entry.label}</Badge>
}

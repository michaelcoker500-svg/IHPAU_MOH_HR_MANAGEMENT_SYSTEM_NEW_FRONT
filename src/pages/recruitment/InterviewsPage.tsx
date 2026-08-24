import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { interviews, candidates, jobOpenings, employees } from '@/data/seed'
import { formatDate } from '@/lib/utils'
import type { Interview } from '@/types'

export default function InterviewsPage() {
  const columns: Column<Interview>[] = [
    { key: 'candidate', header: 'Candidate', render: (i) => { const c = candidates.find((c) => c.id === i.candidateId); return c ? `${c.firstName} ${c.lastName}` : '—' } },
    { key: 'job', header: 'Position', render: (i) => jobOpenings.find((j) => j.id === i.jobId)?.title },
    { key: 'interviewer', header: 'Interviewer', render: (i) => { const e = employees.find((e) => e.id === i.interviewer); return e ? `${e.firstName} ${e.lastName}` : '—' } },
    { key: 'when', header: 'Date & Time', sortValue: (i) => i.date, render: (i) => `${formatDate(i.date)} · ${i.time}` },
    { key: 'location', header: 'Location', render: (i) => i.location, hideOnMobile: true },
    { key: 'status', header: 'Status', render: (i) => <StatusBadge status={i.status} /> },
  ]
  return (
    <Card>
      <DataTable columns={columns} rows={interviews} keyField={(i) => i.id} searchable={false} emptyTitle="No interviews scheduled" />
    </Card>
  )
}

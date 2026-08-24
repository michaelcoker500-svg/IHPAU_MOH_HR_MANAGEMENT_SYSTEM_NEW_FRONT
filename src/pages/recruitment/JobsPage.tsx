import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { PermissionGate } from '@/components/shared/PermissionGate'
import { jobOpenings, departments, locations, applications } from '@/data/seed'
import { formatDate } from '@/lib/utils'
import type { JobOpening } from '@/types'

export default function JobsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const columns: Column<JobOpening>[] = [
    { key: 'title', header: 'Job Title', sortValue: (j) => j.title, render: (j) => <span className="font-medium text-ink-900">{j.title}</span> },
    { key: 'dept', header: 'Department', render: (j) => departments.find((d) => d.id === j.departmentId)?.name },
    { key: 'location', header: 'Location', render: (j) => locations.find((l) => l.id === j.locationId)?.name, hideOnMobile: true },
    { key: 'applicants', header: 'Applicants', render: (j) => applications.filter((a) => a.jobId === j.id).length },
    { key: 'closing', header: 'Closing Date', sortValue: (j) => j.closingDate, render: (j) => formatDate(j.closingDate), hideOnMobile: true },
    { key: 'status', header: 'Status', render: (j) => <StatusBadge status={j.status} /> },
  ]

  return (
    <div>
      <Card>
        <DataTable
          columns={columns}
          rows={jobOpenings}
          keyField={(j) => j.id}
          searchPlaceholder="Search job openings..."
          searchFn={(j, q) => j.title.toLowerCase().includes(q)}
          toolbar={
            <PermissionGate permission="recruitment.manage">
              <Button size="sm" onClick={() => setModalOpen(true)}><PlusCircle size={15} /> Create Job Opening</Button>
            </PermissionGate>
          }
        />
      </Card>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Job Opening" footer={<Button onClick={() => setModalOpen(false)}>Coming Soon</Button>}>
        <p className="text-sm text-ink-500">Job creation requires backend integration for posting workflows, approvals, and publishing. This is coming soon.</p>
      </Modal>
    </div>
  )
}

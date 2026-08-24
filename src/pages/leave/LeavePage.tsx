import { useMemo, useState } from 'react'
import { Check, X } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Select } from '@/components/ui/Select'
import { FilterBar } from '@/components/ui/FilterBar'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { PermissionGate } from '@/components/shared/PermissionGate'
import { leaveRequests as seedRequests, leaveTypes } from '@/data/seed'
import { useLookups } from '@/hooks/useLookup'
import { useAuth } from '@/app/auth-context'
import { useToast } from '@/app/toast-context'
import { formatDate } from '@/lib/utils'
import type { LeaveRequest } from '@/types'

export default function LeavePage() {
  const { empById } = useLookups()
  const { user } = useAuth()
  const { toast } = useToast()
  const [requests, setRequests] = useState<LeaveRequest[]>(seedRequests)
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; decision: 'APPROVED' | 'REJECTED' } | null>(null)
  const [busy, setBusy] = useState(false)

  const filtered = useMemo(
    () => requests.filter((r) => (!statusFilter || r.status === statusFilter) && (!typeFilter || r.leaveTypeId === typeFilter)),
    [requests, statusFilter, typeFilter],
  )

  async function handleDecision() {
    if (!confirmTarget) return
    setBusy(true)
    await new Promise((r) => setTimeout(r, 500))
    setRequests((prev) => prev.map((r) => (r.id === confirmTarget.id ? { ...r, status: confirmTarget.decision, decidedAt: new Date().toISOString(), decidedBy: user?.id ?? null } : r)))
    setBusy(false)
    toast({ title: confirmTarget.decision === 'APPROVED' ? 'Leave request approved' : 'Leave request rejected', variant: confirmTarget.decision === 'APPROVED' ? 'success' : 'warning' })
    setConfirmTarget(null)
  }

  const columns: Column<LeaveRequest>[] = [
    { key: 'employee', header: 'Employee', render: (r) => { const e = empById[r.employeeId]; return e ? `${e.firstName} ${e.lastName}` : '—' } },
    { key: 'type', header: 'Type', render: (r) => leaveTypes.find((t) => t.id === r.leaveTypeId)?.name },
    { key: 'dates', header: 'Dates', sortValue: (r) => r.startDate, render: (r) => `${formatDate(r.startDate)} – ${formatDate(r.endDate)}` },
    { key: 'days', header: 'Days', render: (r) => r.days, hideOnMobile: true },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <div>
      <PageHeader title="Leave Management" subtitle="Review and manage employee leave requests" />
      <Card>
        <DataTable
          columns={columns}
          rows={filtered}
          keyField={(r) => r.id}
          searchPlaceholder="Search by employee..."
          searchFn={(r, q) => { const e = empById[r.employeeId]; return e ? `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) : false }}
          toolbar={
            <FilterBar activeCount={(statusFilter ? 1 : 0) + (typeFilter ? 1 : 0)} onClear={() => { setStatusFilter(''); setTypeFilter('') }}>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status" className="sm:w-40">
                <option value="">All Statuses</option>
                {['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
              <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="Filter by type" className="sm:w-40">
                <option value="">All Types</option>
                {leaveTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </Select>
            </FilterBar>
          }
          rowActions={(r) =>
            r.status === 'PENDING' ? (
              <PermissionGate permission="leave.approve">
                <div className="flex justify-end gap-1.5">
                  <Button size="sm" variant="outline" onClick={() => setConfirmTarget({ id: r.id, decision: 'APPROVED' })} aria-label="Approve"><Check size={14} /></Button>
                  <Button size="sm" variant="outline" onClick={() => setConfirmTarget({ id: r.id, decision: 'REJECTED' })} aria-label="Reject"><X size={14} /></Button>
                </div>
              </PermissionGate>
            ) : null
          }
        />
      </Card>

      <ConfirmDialog
        open={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        onConfirm={handleDecision}
        title={confirmTarget?.decision === 'APPROVED' ? 'Approve leave request?' : 'Reject leave request?'}
        description="This will update the employee's leave balance and notify them of the decision."
        confirmLabel={confirmTarget?.decision === 'APPROVED' ? 'Approve' : 'Reject'}
        variant={confirmTarget?.decision === 'APPROVED' ? 'primary' : 'danger'}
        loading={busy}
      />
    </div>
  )
}

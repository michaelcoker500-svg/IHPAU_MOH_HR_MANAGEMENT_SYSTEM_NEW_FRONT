import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardBody } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { PermissionGate } from '@/components/shared/PermissionGate'
import { useToast } from '@/app/toast-context'
import { workflowRequests as seedWorkflows } from '@/data/seed'
import { employeeName } from '@/hooks/useLookup'
import { formatDate } from '@/lib/utils'
import type { WorkflowRequest } from '@/types'

export default function ApprovalsPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<WorkflowRequest[]>(seedWorkflows)
  const [tab, setTab] = useState('pending')
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; decision: 'APPROVED' | 'REJECTED' } | null>(null)

  const pending = items.filter((w) => w.status === 'PENDING')
  const completed = items.filter((w) => w.status !== 'PENDING')
  const shown = tab === 'pending' ? pending : completed

  function handleDecision() {
    if (!confirmTarget) return
    setItems((prev) => prev.map((w) => (w.id === confirmTarget.id ? { ...w, status: confirmTarget.decision } : w)))
    toast({ title: confirmTarget.decision === 'APPROVED' ? 'Request approved' : 'Request rejected', variant: confirmTarget.decision === 'APPROVED' ? 'success' : 'warning' })
    setConfirmTarget(null)
  }

  return (
    <div>
      <PageHeader title="Approvals" subtitle="Requests awaiting your action" />
      <Card>
        <div className="px-2 pt-2 sm:px-3">
          <Tabs tabs={[{ key: 'pending', label: 'Pending', count: pending.length }, { key: 'completed', label: 'Completed', count: completed.length }]} active={tab} onChange={setTab} />
        </div>
        <CardBody className="p-0">
          {shown.length === 0 ? (
            <EmptyState title={tab === 'pending' ? 'No pending approvals' : 'No completed requests'} />
          ) : (
            <div className="divide-y divide-ink-100">
              {shown.map((w) => (
                <div key={w.id} className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-800">{w.type.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-ink-500">{employeeName(w.requesterId)} · {w.currentStep} · Submitted {formatDate(w.submittedAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={w.status} />
                    {w.status === 'PENDING' && (
                      <PermissionGate permission="workflow.approve">
                        <div className="flex gap-1.5">
                          <Button size="sm" variant="outline" onClick={() => setConfirmTarget({ id: w.id, decision: 'APPROVED' })}><Check size={14} /></Button>
                          <Button size="sm" variant="outline" onClick={() => setConfirmTarget({ id: w.id, decision: 'REJECTED' })}><X size={14} /></Button>
                        </div>
                      </PermissionGate>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <ConfirmDialog
        open={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        onConfirm={handleDecision}
        title={confirmTarget?.decision === 'APPROVED' ? 'Approve request?' : 'Reject request?'}
        confirmLabel={confirmTarget?.decision === 'APPROVED' ? 'Approve' : 'Reject'}
        variant={confirmTarget?.decision === 'APPROVED' ? 'primary' : 'danger'}
      />
    </div>
  )
}

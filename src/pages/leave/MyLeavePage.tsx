import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CalendarPlus } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/app/auth-context'
import { useToast } from '@/app/toast-context'
import { leaveService } from '@/services'
import { leaveTypes } from '@/data/seed'
import type { LeaveBalance, LeaveRequest } from '@/types'
import { formatDate } from '@/lib/utils'

export default function MyLeavePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const [balances, setBalances] = useState<LeaveBalance[]>([])
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(searchParams.get('new') === '1')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ leaveTypeId: leaveTypes[0].id, startDate: '', endDate: '', reason: '' })

  useEffect(() => {
    if (!user?.employeeId) { setLoading(false); return }
    Promise.all([leaveService.balances(user.employeeId), leaveService.requestsForEmployee(user.employeeId)]).then(([b, r]) => {
      setBalances(b)
      setRequests(r)
      setLoading(false)
    })
  }, [user])

  async function handleSubmit() {
    if (!user?.employeeId) return
    if (!form.startDate || !form.endDate) {
      toast({ title: 'Please select start and end dates', variant: 'error' })
      return
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      toast({ title: 'End date must be after start date', variant: 'error' })
      return
    }
    setSubmitting(true)
    const days = Math.max(1, Math.round((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000) + 1)
    const created = await leaveService.create({ employeeId: user.employeeId, leaveTypeId: form.leaveTypeId, startDate: form.startDate, endDate: form.endDate, days, reason: form.reason })
    setRequests((prev) => [created, ...prev])
    setSubmitting(false)
    setModalOpen(false)
    setSearchParams({})
    setForm({ leaveTypeId: leaveTypes[0].id, startDate: '', endDate: '', reason: '' })
    toast({ title: 'Leave request submitted successfully', variant: 'success' })
  }

  return (
    <div>
      <PageHeader title="My Leave" subtitle="View your balances and manage leave requests" actions={<Button onClick={() => setModalOpen(true)}><CalendarPlus size={16} /> Request Leave</Button>} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {balances.map((b) => {
          const type = leaveTypes.find((t) => t.id === b.leaveTypeId)!
          const remaining = b.entitled - b.used - b.pending
          return (
            <Card key={b.id} className="p-3.5">
              <p className="truncate text-xs font-medium text-ink-500">{type.name}</p>
              <p className="mt-1 text-lg font-semibold text-ink-900">{remaining}</p>
              <p className="text-[11px] text-ink-400">of {b.entitled} days</p>
            </Card>
          )
        })}
      </div>

      <Card className="mt-4">
        <CardHeader title="My Requests" />
        <CardBody className="p-0">
          {loading ? (
            <p className="p-5 text-sm text-ink-400">Loading...</p>
          ) : requests.length === 0 ? (
            <EmptyState title="No leave requests yet" description="You haven't submitted any leave requests." actionLabel="Request Leave" onAction={() => setModalOpen(true)} />
          ) : (
            <div className="divide-y divide-ink-100">
              {requests.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-800">{leaveTypes.find((t) => t.id === r.leaveTypeId)?.name}</p>
                    <p className="text-xs text-ink-500">{formatDate(r.startDate)} – {formatDate(r.endDate)} · {r.days} day(s)</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSearchParams({}) }}
        title="Request Leave"
        footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit} loading={submitting}>Submit Request</Button></>}
      >
        <div className="space-y-4">
          <Select label="Leave Type" required value={form.leaveTypeId} onChange={(e) => setForm({ ...form, leaveTypeId: e.target.value })}>
            {leaveTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date" type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            <Input label="End Date" type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>
          <Textarea label="Reason" rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Briefly describe the reason for your leave request" />
        </div>
      </Modal>
    </div>
  )
}

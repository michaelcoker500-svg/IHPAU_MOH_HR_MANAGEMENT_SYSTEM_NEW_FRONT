import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Mail, Phone, Calendar, MapPin, Edit3, FileText, MoreHorizontal } from 'lucide-react'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { Avatar } from '@/components/ui/Avatar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import {
  employees, attendanceRecords, leaveRequests, leaveTypes, goals, enrollments, courses,
  employeeDocuments, auditEvents, departments, positions, locations,
} from '@/data/seed'
import { useLookups, employeeName } from '@/hooks/useLookup'
import { formatDate, formatDateTime, initials } from '@/lib/utils'
import { useAuth } from '@/app/auth-context'
import { useToast } from '@/app/toast-context'
import { PermissionGate } from '@/components/shared/PermissionGate'
import type { Employee } from '@/types'

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'personal', label: 'Personal' },
  { key: 'employment', label: 'Employment' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'leave', label: 'Leave' },
  { key: 'performance', label: 'Performance' },
  { key: 'training', label: 'Training' },
  { key: 'documents', label: 'Documents' },
  { key: 'activity', label: 'Activity' },
]

export default function EmployeeProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { can } = useAuth()
  const { toast } = useToast()
  const { deptById, posById, locById } = useLookups()
  const [tab, setTab] = useState('overview')
  const [editOpen, setEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const employeeRecord = employees.find((e) => e.id === id)
  const [employee, setEmployee] = useState<Employee | undefined>(employeeRecord)
  const [form, setForm] = useState(() => ({
    firstName: employeeRecord?.firstName ?? '', lastName: employeeRecord?.lastName ?? '',
    email: employeeRecord?.email ?? '', phone: employeeRecord?.phone ?? '',
    departmentId: employeeRecord?.departmentId ?? '', positionId: employeeRecord?.positionId ?? '',
    locationId: employeeRecord?.locationId ?? '', employmentStatus: employeeRecord?.employmentStatus ?? 'ACTIVE',
  }))

  if (!employee) {
    return <EmptyState title="Employee not found" description="This employee record does not exist or you may not have access." />
  }

  function openEdit() {
    setForm({
      firstName: employee!.firstName, lastName: employee!.lastName, email: employee!.email, phone: employee!.phone,
      departmentId: employee!.departmentId, positionId: employee!.positionId, locationId: employee!.locationId,
      employmentStatus: employee!.employmentStatus,
    })
    setEditOpen(true)
  }

  async function saveEdit() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    const updated: Employee = { ...employee!, ...form }
    const idx = employees.findIndex((e) => e.id === employee!.id)
    if (idx >= 0) employees[idx] = updated
    setEmployee(updated)
    setSaving(false)
    setEditOpen(false)
    toast({ title: 'Employee updated successfully', variant: 'success' })
  }

  const empAttendance = attendanceRecords.filter((a) => a.employeeId === employee.id).slice(0, 30)
  const empLeave = leaveRequests.filter((l) => l.employeeId === employee.id)
  const empGoals = goals.filter((g) => g.employeeId === employee.id)
  const empEnrollments = enrollments.filter((e) => e.employeeId === employee.id)
  const empDocs = employeeDocuments.filter((d) => d.employeeId === employee.id)
  const presentDays = empAttendance.filter((a) => a.status === 'PRESENT').length

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Employees', href: '/employees' }, { label: `${employee.firstName} ${employee.lastName}` }]} />

      <Card className="mb-4">
        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar name={initials(employee.firstName, employee.lastName)} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold text-ink-900">{employee.firstName} {employee.lastName}</h1>
              <StatusBadge status={employee.employmentStatus} />
            </div>
            <p className="mt-0.5 text-sm text-ink-500">{posById[employee.positionId]?.title} · {deptById[employee.departmentId]?.name}</p>
            <p className="mt-0.5 text-xs text-ink-400">{employee.employeeCode}</p>
          </div>
          <div className="flex gap-2">
            <PermissionGate permission="employee.update">
              <Button variant="outline" size="sm" onClick={openEdit}><Edit3 size={14} /> Edit</Button>
            </PermissionGate>
            <PermissionGate permission="document.view">
              <Button variant="outline" size="sm" onClick={() => setTab('documents')}><FileText size={14} /> Documents</Button>
            </PermissionGate>
            <Dropdown trigger={<Button variant="outline" size="icon"><MoreHorizontal size={16} /></Button>} items={[{ label: 'Create Request' }, { label: 'View Audit Trail', onClick: () => setTab('activity') }]} />
          </div>
        </CardBody>
      </Card>

      <Card>
        <div className="px-2 pt-2 sm:px-3">
          <Tabs tabs={TABS} active={tab} onChange={setTab} />
        </div>
        <CardBody>
          {tab === 'overview' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow icon={Mail} label="Email" value={employee.email} />
              <InfoRow icon={Phone} label="Phone" value={employee.phone} />
              <InfoRow icon={MapPin} label="Location" value={locById[employee.locationId]?.name ?? '—'} />
              <InfoRow icon={Calendar} label="Join Date" value={formatDate(employee.joinDate)} />
              <InfoRow icon={Calendar} label="Manager" value={employeeName(employee.managerId)} />
              <InfoRow icon={Calendar} label="Employment Type" value={employee.employmentType.replace('_', ' ')} />
            </div>
          )}

          {tab === 'personal' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow icon={Calendar} label="Date of Birth" value={formatDate(employee.dateOfBirth)} />
              <InfoRow icon={Calendar} label="Gender" value={employee.gender} />
              <InfoRow icon={Mail} label="Email" value={employee.email} />
              <InfoRow icon={Phone} label="Phone" value={employee.phone} />
            </div>
          )}

          {tab === 'employment' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow icon={Calendar} label="Department" value={deptById[employee.departmentId]?.name ?? '—'} />
              <InfoRow icon={Calendar} label="Position" value={posById[employee.positionId]?.title ?? '—'} />
              <InfoRow icon={Calendar} label="Manager" value={employeeName(employee.managerId)} />
              <InfoRow icon={Calendar} label="Status" value={employee.employmentStatus.replace('_', ' ')} />
              <InfoRow icon={Calendar} label="Type" value={employee.employmentType.replace('_', ' ')} />
              <InfoRow icon={Calendar} label="Join Date" value={formatDate(employee.joinDate)} />
            </div>
          )}

          {tab === 'attendance' && (
            <div>
              <p className="mb-3 text-sm text-ink-500">{presentDays} present days in the last 30 days.</p>
              <div className="divide-y divide-ink-100">
                {empAttendance.slice(0, 10).map((a) => (
                  <div key={a.id} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="text-ink-600">{formatDate(a.date)}</span>
                    <span className="text-ink-500">{a.checkIn ?? '—'} → {a.checkOut ?? '—'}</span>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => navigate('/attendance')}>View full attendance</Button>
            </div>
          )}

          {tab === 'leave' && (
            <div className="divide-y divide-ink-100">
              {empLeave.length === 0 && <p className="py-6 text-sm text-ink-400">No leave requests on record.</p>}
              {empLeave.map((l) => (
                <div key={l.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="text-ink-800">{leaveTypes.find((t) => t.id === l.leaveTypeId)?.name}</p>
                    <p className="text-xs text-ink-500">{formatDate(l.startDate)} – {formatDate(l.endDate)} ({l.days} days)</p>
                  </div>
                  <StatusBadge status={l.status} />
                </div>
              ))}
            </div>
          )}

          {tab === 'performance' && (
            <div className="space-y-3">
              {empGoals.length === 0 && <p className="text-sm text-ink-400">No goals assigned yet.</p>}
              {empGoals.map((g) => (
                <div key={g.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-700">{g.title}</span>
                    <StatusBadge status={g.status} />
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                    <div className="h-full rounded-full bg-brand-600" style={{ width: `${Math.min(100, (g.current / g.target) * 100)}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-ink-500">{g.current}/{g.target}{g.unit === '%' ? '%' : ` ${g.unit}`} · Due {formatDate(g.dueDate)}</p>
                </div>
              ))}
            </div>
          )}

          {tab === 'training' && (
            <div className="divide-y divide-ink-100">
              {empEnrollments.length === 0 && <p className="py-6 text-sm text-ink-400">No training enrollments.</p>}
              {empEnrollments.map((e) => (
                <div key={e.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="text-ink-800">{courses.find((c) => c.id === (e as any).sessionId)?.title ?? 'Course'}</span>
                  <StatusBadge status={e.status} />
                </div>
              ))}
            </div>
          )}

          {tab === 'documents' && (
            <PermissionGate permission="document.view" fallback={<p className="text-sm text-ink-400">You don't have permission to view documents.</p>}>
              <div className="divide-y divide-ink-100">
                {empDocs.length === 0 && <p className="py-6 text-sm text-ink-400">No documents uploaded.</p>}
                {empDocs.map((d) => (
                  <div key={d.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <div className="min-w-0">
                      <p className="truncate text-ink-800">{d.category}</p>
                      <p className="text-xs text-ink-500">Uploaded {formatDate(d.uploadedAt)}</p>
                    </div>
                    <StatusBadge status={d.status} />
                  </div>
                ))}
              </div>
            </PermissionGate>
          )}

          {tab === 'activity' && (
            <PermissionGate permission="audit.view" fallback={<p className="text-sm text-ink-400">You don't have permission to view the activity log.</p>}>
              <div className="divide-y divide-ink-100">
                {auditEvents.filter((a) => a.actor === `${employee.firstName} ${employee.lastName}`).slice(0, 10).map((a) => (
                  <div key={a.id} className="py-2.5 text-sm">
                    <p className="text-ink-800">{a.action}</p>
                    <p className="text-xs text-ink-500">{formatDateTime(a.timestamp)}</p>
                  </div>
                ))}
              </div>
            </PermissionGate>
          )}
        </CardBody>
      </Card>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Employee"
        description={`${employee.firstName} ${employee.lastName} · ${employee.employeeCode}`}
        footer={<><Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button><Button onClick={saveEdit} loading={saving}>Save Changes</Button></>}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="First Name" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          <Input label="Last Name" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Select label="Department" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value, positionId: positions.find((p) => p.departmentId === e.target.value)?.id ?? form.positionId })}>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
          <Select label="Position" value={form.positionId} onChange={(e) => setForm({ ...form, positionId: e.target.value })}>
            {positions.filter((p) => p.departmentId === form.departmentId).map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </Select>
          <Select label="Location" value={form.locationId} onChange={(e) => setForm({ ...form, locationId: e.target.value })}>
            {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </Select>
          <Select label="Employment Status" value={form.employmentStatus} onChange={(e) => setForm({ ...form, employmentStatus: e.target.value as Employee['employmentStatus'] })}>
            {['ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED'].map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </Select>
        </div>
      </Modal>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-ink-100 p-3">
      <Icon size={16} className="mt-0.5 shrink-0 text-ink-400" />
      <div className="min-w-0">
        <p className="text-xs text-ink-500">{label}</p>
        <p className="truncate text-sm font-medium text-ink-800">{value}</p>
      </div>
    </div>
  )
}

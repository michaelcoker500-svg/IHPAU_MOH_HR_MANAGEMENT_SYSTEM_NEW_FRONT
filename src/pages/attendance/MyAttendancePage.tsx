import { useEffect, useState } from 'react'
import { Clock, LogIn, LogOut } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuth } from '@/app/auth-context'
import { useToast } from '@/app/toast-context'
import { attendanceService } from '@/services'
import type { AttendanceRecord } from '@/types'
import { formatDate } from '@/lib/utils'

export default function MyAttendancePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [actionState, setActionState] = useState<'idle' | 'checking-in' | 'checking-out'>('idle')

  const today = new Date().toISOString().slice(0, 10)
  const todayRecord = records.find((r) => r.date === today) ?? records.find((r) => r.date === '2026-08-17')

  useEffect(() => {
    if (!user?.employeeId) { setLoading(false); return }
    attendanceService.forEmployee(user.employeeId).then((r) => { setRecords(r); setLoading(false) })
  }, [user])

  async function handleCheckIn() {
    if (!user?.employeeId) return
    setActionState('checking-in')
    const record = await attendanceService.checkIn(user.employeeId)
    setRecords((prev) => [record, ...prev.filter((r) => r.id !== record.id)])
    setActionState('idle')
    toast({ title: `Checked in at ${record.checkIn}`, variant: 'success' })
  }

  async function handleCheckOut() {
    if (!user?.employeeId) return
    setActionState('checking-out')
    const record = await attendanceService.checkOut(user.employeeId)
    if (record) setRecords((prev) => prev.map((r) => (r.id === record.id ? record : r)))
    setActionState('idle')
    toast({ title: `Checked out at ${record?.checkOut}`, variant: 'success' })
  }

  const presentCount = records.filter((r) => r.status === 'PRESENT' && r.date.startsWith('2026-08')).length

  return (
    <div>
      <PageHeader title="My Attendance" subtitle="Check in, check out, and review your attendance history" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader title="Today" subtitle={formatDate(new Date().toISOString())} />
          <CardBody className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <Clock size={28} />
            </div>
            {todayRecord?.checkIn ? (
              <div>
                <p className="text-sm text-ink-500">Checked in at</p>
                <p className="text-lg font-semibold text-ink-900">{todayRecord.checkIn}</p>
                {todayRecord.checkOut && <p className="mt-1 text-xs text-ink-500">Checked out at {todayRecord.checkOut}</p>}
              </div>
            ) : (
              <p className="text-sm text-ink-500">You haven't checked in yet today.</p>
            )}
            <div className="flex w-full gap-2">
              <Button className="flex-1" onClick={handleCheckIn} loading={actionState === 'checking-in'} disabled={!!todayRecord?.checkIn}>
                <LogIn size={15} /> Check In
              </Button>
              <Button className="flex-1" variant="outline" onClick={handleCheckOut} loading={actionState === 'checking-out'} disabled={!todayRecord?.checkIn || !!todayRecord?.checkOut}>
                <LogOut size={15} /> Check Out
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Recent Attendance" subtitle={`${presentCount} present days this month`} />
          <CardBody className="p-0">
            {loading ? (
              <p className="p-5 text-sm text-ink-400">Loading...</p>
            ) : (
              <div className="scrollbar-thin max-h-96 divide-y divide-ink-100 overflow-y-auto">
                {records.slice(0, 20).map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-3 px-5 py-2.5 text-sm">
                    <span className="text-ink-600">{formatDate(r.date)}</span>
                    <span className="text-ink-500">{r.checkIn ?? '—'} → {r.checkOut ?? '—'}</span>
                    <StatusBadge status={r.status} />
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

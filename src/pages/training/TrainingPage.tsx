import { useState } from 'react'
import { GraduationCap, Clock, Users as UsersIcon } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardBody } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { Badge } from '@/components/ui/Badge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/app/auth-context'
import { useToast } from '@/app/toast-context'
import { courses, trainingSessions, enrollments as seedEnrollments } from '@/data/seed'
import type { Enrollment } from '@/types'

export default function TrainingPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [tab, setTab] = useState('courses')
  const [enrollments, setEnrollments] = useState<Enrollment[]>(seedEnrollments)

  const myEnrollments = enrollments.filter((e) => e.employeeId === user?.employeeId)

  function enroll(sessionId: string) {
    if (!user?.employeeId) return
    const already = enrollments.some((e) => e.employeeId === user.employeeId && e.sessionId === sessionId)
    if (already) {
      toast({ title: 'You are already enrolled in this session', variant: 'info' })
      return
    }
    const created: Enrollment = { id: `ENR-LIVE-${Date.now()}`, employeeId: user.employeeId, sessionId, status: 'ENROLLED', progress: 0, certificateIssued: false }
    setEnrollments((prev) => [...prev, created])
    toast({ title: 'Enrolled successfully', variant: 'success' })
  }

  return (
    <div>
      <PageHeader title="Training & Development" subtitle="Browse courses and manage enrollments" />
      <Tabs tabs={[{ key: 'courses', label: 'Courses', count: courses.length }, { key: 'my', label: 'My Enrollments', count: myEnrollments.length }]} active={tab} onChange={setTab} />

      {tab === 'courses' && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const session = trainingSessions.find((s) => s.courseId === course.id)
            return (
              <Card key={course.id}>
                <CardBody>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <GraduationCap size={18} />
                  </div>
                  <p className="text-sm font-semibold text-ink-900">{course.title}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge tone="neutral">{course.category}</Badge>
                    <Badge tone="info">{course.delivery.replace('_', ' ')}</Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-500">
                    <Clock size={13} /> {course.durationHours} hours
                  </div>
                  {session && (
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-ink-500">
                      <UsersIcon size={13} /> Capacity {session.capacity}
                    </div>
                  )}
                  <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => session && enroll(session.id)} disabled={!session}>
                    {session ? 'Enroll' : 'No session scheduled'}
                  </Button>
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}

      {tab === 'my' && (
        <Card className="mt-4">
          <CardBody className="p-0">
            {myEnrollments.length === 0 ? (
              <p className="p-8 text-center text-sm text-ink-400">You have no training enrollments yet.</p>
            ) : (
              <div className="divide-y divide-ink-100">
                {myEnrollments.map((e) => {
                  const session = trainingSessions.find((s) => s.id === e.sessionId)
                  const course = courses.find((c) => c.id === session?.courseId)
                  return (
                    <div key={e.id} className="flex items-center justify-between gap-3 px-5 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink-800">{course?.title ?? 'Course'}</p>
                        <p className="text-xs text-ink-500">Progress: {e.progress}%{e.certificateIssued ? ' · Certificate issued' : ''}</p>
                      </div>
                      <StatusBadge status={e.status} />
                    </div>
                  )
                })}
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  )
}

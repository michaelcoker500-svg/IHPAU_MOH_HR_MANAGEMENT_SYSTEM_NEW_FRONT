import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Clock, CalendarDays, UserSearch, Target, GraduationCap, CheckSquare, TrendingUp, Briefcase } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts'
import { useAuth } from '@/app/auth-context'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import {
  employees, departments, leaveRequests, jobOpenings, applications, goals, enrollments,
  attendanceRecords, workflowRequests, courses,
} from '@/data/seed'
import { employeeName } from '@/hooks/useLookup'
import { formatDate } from '@/lib/utils'

const CHART_COLORS = ['#34766a', '#c79c3c', '#2f7ec2', '#d99a1b', '#d24b3f', '#5b6466']

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  if (!user) return null

  const today = '2026-08-17'
  const activeEmployees = employees.filter((e) => e.employmentStatus === 'ACTIVE')
  const todayAttendance = attendanceRecords.filter((a) => a.date === today)
  const presentToday = todayAttendance.filter((a) => ['PRESENT', 'LATE', 'REMOTE'].includes(a.status)).length
  const pendingLeave = leaveRequests.filter((l) => l.status === 'PENDING')
  const openJobs = jobOpenings.filter((j) => j.status === 'OPEN')
  const myGoals = goals.filter((g) => g.employeeId === user.employeeId)
  const myLeave = leaveRequests.filter((l) => l.employeeId === user.employeeId)
  const myEnrollments = enrollments.filter((e) => e.employeeId === user.employeeId)
  const teamMembers = employees.filter((e) => e.managerId === user.employeeId)
  const pendingWorkflows = workflowRequests.filter((w) => w.status === 'PENDING')

  const deptDistribution = useMemo(
    () => departments.map((d) => ({ name: d.code, count: employees.filter((e) => e.departmentId === d.id).length })),
    [],
  )

  const attendanceByStatus = useMemo(() => {
    const map: Record<string, number> = {}
    for (const a of todayAttendance) map[a.status] = (map[a.status] ?? 0) + 1
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [todayAttendance])

  const pipelineByStage = useMemo(() => {
    const stages = ['APPLIED', 'SCREENING', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'HIRED']
    return stages.map((s) => ({ name: s, count: applications.filter((a) => a.stage === s).length }))
  }, [])

  return (
    <div>
      <PageHeader
        title={`Good day, ${user.name.split(' ')[0]}`}
        subtitle={`${user.roleLabel} · IHPAU HR Cloud · ${formatDate(new Date().toISOString())}`}
      />

      {/* ===== Role: HR / Super Admin / HR Officer ===== */}
      {['SUPER_ADMIN', 'HR_ADMIN', 'HR_OFFICER'].includes(user.role) && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard label="Total Employees" value={employees.length} icon={Users} tone="brand" onClick={() => navigate('/employees')} trend={{ value: `${activeEmployees.length} active`, direction: 'up' }} />
            <StatCard label="Present Today" value={`${presentToday}/${activeEmployees.length}`} icon={Clock} tone="success" onClick={() => navigate('/attendance')} />
            <StatCard label="Pending Leave Requests" value={pendingLeave.length} icon={CalendarDays} tone="warning" onClick={() => navigate('/leave')} />
            <StatCard label="Open Positions" value={openJobs.length} icon={UserSearch} tone="info" onClick={() => navigate('/recruitment/jobs')} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader title="Headcount by Department" subtitle="Active and inactive employees" />
              <CardBody>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={deptDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef0f0" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#757f81' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#757f81' }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #dde1e1' }} />
                    <Bar dataKey="count" fill="#34766a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Today's Attendance" subtitle={formatDate(new Date().toISOString())} />
              <CardBody>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={attendanceByStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                      {attendanceByStatus.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #dde1e1' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
                  {attendanceByStatus.map((s, i) => (
                    <span key={s.name} className="inline-flex items-center gap-1.5 text-xs text-ink-600">
                      <span className="h-2 w-2 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                      {s.name.replace('_', ' ')} ({s.value})
                    </span>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader title="Pending Approvals" subtitle={`${pendingWorkflows.length} awaiting action`} action={<Button variant="ghost" size="sm" onClick={() => navigate('/approvals')}>View all</Button>} />
              <CardBody className="p-0">
                {pendingWorkflows.slice(0, 5).map((w) => (
                  <div key={w.id} className="flex items-center justify-between gap-3 border-b border-ink-50 px-5 py-3 last:border-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-800">{w.type.replace(/_/g, ' ')}</p>
                      <p className="truncate text-xs text-ink-500">{employeeName(w.requesterId)} · {w.currentStep}</p>
                    </div>
                    <StatusBadge status={w.status} />
                  </div>
                ))}
                {pendingWorkflows.length === 0 && <p className="px-5 py-8 text-center text-sm text-ink-400">No pending approvals.</p>}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Quick Actions" />
              <CardBody className="grid grid-cols-2 gap-2.5">
                <Button variant="outline" onClick={() => navigate('/employees?new=1')} className="justify-start"><Users size={15} /> Add Employee</Button>
                <Button variant="outline" onClick={() => navigate('/leave')} className="justify-start"><CalendarDays size={15} /> Leave Requests</Button>
                <Button variant="outline" onClick={() => navigate('/approvals')} className="justify-start"><CheckSquare size={15} /> Open Approvals</Button>
                <Button variant="outline" onClick={() => navigate('/recruitment/jobs?new=1')} className="justify-start"><Briefcase size={15} /> Create Job Opening</Button>
              </CardBody>
            </Card>
          </div>
        </>
      )}

      {/* ===== Role: Manager ===== */}
      {user.role === 'MANAGER' && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard label="Team Members" value={teamMembers.length} icon={Users} tone="brand" onClick={() => navigate('/employees')} />
            <StatCard label="Team Present Today" value={teamMembers.filter((t) => attendanceRecords.find((a) => a.employeeId === t.id && a.date === today && ['PRESENT', 'LATE', 'REMOTE'].includes(a.status))).length} icon={Clock} tone="success" onClick={() => navigate('/attendance')} />
            <StatCard label="Pending Team Leave" value={leaveRequests.filter((l) => teamMembers.some((t) => t.id === l.employeeId) && l.status === 'PENDING').length} icon={CalendarDays} tone="warning" onClick={() => navigate('/leave')} />
            <StatCard label="Approvals Awaiting You" value={pendingWorkflows.length} icon={CheckSquare} tone="info" onClick={() => navigate('/approvals')} />
          </div>
          <Card className="mt-4">
            <CardHeader title="My Team" subtitle={`${teamMembers.length} direct reports`} action={<Button variant="ghost" size="sm" onClick={() => navigate('/employees')}>View all</Button>} />
            <CardBody className="p-0">
              {teamMembers.slice(0, 6).map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-3 border-b border-ink-50 px-5 py-3 last:border-0">
                  <button onClick={() => navigate(`/employees/${m.id}`)} className="min-w-0 text-left hover:underline">
                    <p className="truncate text-sm font-medium text-ink-800">{m.firstName} {m.lastName}</p>
                    <p className="truncate text-xs text-ink-500">{m.employeeCode}</p>
                  </button>
                  <StatusBadge status={m.employmentStatus} />
                </div>
              ))}
            </CardBody>
          </Card>
        </>
      )}

      {/* ===== Role: Employee ===== */}
      {user.role === 'EMPLOYEE' && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard label="Leave Requests" value={myLeave.length} icon={CalendarDays} tone="brand" onClick={() => navigate('/my-leave')} />
            <StatCard label="Active Goals" value={myGoals.filter((g) => g.status === 'ACTIVE').length} icon={Target} tone="success" onClick={() => navigate('/performance')} />
            <StatCard label="Training Enrollments" value={myEnrollments.length} icon={GraduationCap} tone="info" onClick={() => navigate('/training')} />
            <StatCard label="This Month Attendance" value={`${attendanceRecords.filter((a) => a.employeeId === user.employeeId && a.date.startsWith('2026-08') && a.status === 'PRESENT').length} days`} icon={Clock} tone="warning" onClick={() => navigate('/my-attendance')} />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader title="My Goals" action={<Button variant="ghost" size="sm" onClick={() => navigate('/performance')}>View all</Button>} />
              <CardBody className="space-y-3">
                {myGoals.length === 0 && <p className="text-sm text-ink-400">No goals assigned yet.</p>}
                {myGoals.slice(0, 4).map((g) => (
                  <div key={g.id}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink-700">{g.title}</span>
                      <span className="text-xs text-ink-500">{g.current}/{g.target}{g.unit === '%' ? '%' : ` ${g.unit}`}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                      <div className="h-full rounded-full bg-brand-600" style={{ width: `${Math.min(100, (g.current / g.target) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
            <Card>
              <CardHeader title="Quick Actions" />
              <CardBody className="grid grid-cols-2 gap-2.5">
                <Button variant="outline" onClick={() => navigate('/my-attendance')} className="justify-start"><Clock size={15} /> Check In / Out</Button>
                <Button variant="outline" onClick={() => navigate('/my-leave?new=1')} className="justify-start"><CalendarDays size={15} /> Request Leave</Button>
                <Button variant="outline" onClick={() => navigate('/documents')} className="justify-start"><Users size={15} /> View Documents</Button>
                <Button variant="outline" onClick={() => navigate('/performance')} className="justify-start"><Target size={15} /> View Goals</Button>
              </CardBody>
            </Card>
          </div>
        </>
      )}

      {/* ===== Role: Recruiter ===== */}
      {user.role === 'RECRUITER' && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard label="Open Positions" value={openJobs.length} icon={Briefcase} tone="brand" onClick={() => navigate('/recruitment/jobs')} />
            <StatCard label="Candidates" value={applications.length} icon={Users} tone="info" onClick={() => navigate('/recruitment/candidates')} />
            <StatCard label="Interviews Scheduled" value={applications.filter((a) => a.stage === 'INTERVIEW').length} icon={CalendarDays} tone="warning" onClick={() => navigate('/recruitment/interviews')} />
            <StatCard label="Offers Extended" value={applications.filter((a) => a.stage === 'OFFER').length} icon={TrendingUp} tone="success" onClick={() => navigate('/recruitment/offers')} />
          </div>
          <Card className="mt-4">
            <CardHeader title="Recruitment Funnel" />
            <CardBody>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={pipelineByStage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#757f81' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#757f81' }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #dde1e1' }} />
                  <Bar dataKey="count" fill="#c79c3c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </>
      )}

      {/* ===== Role: Training Manager ===== */}
      {user.role === 'TRAINING_MANAGER' && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard label="Active Courses" value={courses.filter((c) => c.status === 'ACTIVE').length} icon={GraduationCap} tone="brand" onClick={() => navigate('/training/courses')} />
          <StatCard label="Enrollments" value={enrollments.length} icon={Users} tone="info" onClick={() => navigate('/training')} />
          <StatCard label="Completion Rate" value={`${Math.round((enrollments.filter((e) => e.status === 'COMPLETED').length / Math.max(1, enrollments.length)) * 100)}%`} icon={TrendingUp} tone="success" />
          <StatCard label="Certificates Issued" value={enrollments.filter((e) => e.certificateIssued).length} icon={CheckSquare} tone="warning" />
        </div>
      )}

      {/* ===== Role: Performance Manager ===== */}
      {user.role === 'PERFORMANCE_MANAGER' && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard label="Active Goals" value={goals.filter((g) => g.status === 'ACTIVE').length} icon={Target} tone="brand" onClick={() => navigate('/performance/goals')} />
          <StatCard label="Completed Goals" value={goals.filter((g) => g.status === 'COMPLETED').length} icon={CheckSquare} tone="success" />
          <StatCard label="Reviews Completed" value={`${Math.round((goals.filter(g=>g.status==='COMPLETED').length/Math.max(1,goals.length))*100)}%`} icon={TrendingUp} tone="info" />
          <StatCard label="Active Cycle" value="2026 H2" icon={CalendarDays} tone="warning" onClick={() => navigate('/performance/cycles')} />
        </div>
      )}

      {/* ===== Role: Finance ===== */}
      {user.role === 'FINANCE' && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard label="Total Employees" value={employees.length} icon={Users} tone="brand" onClick={() => navigate('/employees')} />
          <StatCard label="Full-Time Staff" value={employees.filter((e) => e.employmentType === 'FULL_TIME').length} icon={Briefcase} tone="info" />
          <StatCard label="Departments" value={departments.length} icon={Users} tone="success" onClick={() => navigate('/departments')} />
          <StatCard label="Payroll Module" value="Coming Soon" icon={TrendingUp} tone="warning" />
        </div>
      )}
    </div>
  )
}

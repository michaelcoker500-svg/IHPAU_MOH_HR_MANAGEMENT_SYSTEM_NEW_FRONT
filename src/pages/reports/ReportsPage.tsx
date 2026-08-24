import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import {
  departments, employees, attendanceRecords, leaveRequests, leaveTypes,
  applications, enrollments, courses, goals,
} from '@/data/seed'

const COLORS = ['#34766a', '#c79c3c', '#2f7ec2', '#d99a1b', '#d24b3f', '#5b6466', '#22a35c', '#82b6a8']

export default function ReportsPage() {
  const [tab, setTab] = useState('workforce')

  const headcountByDept = departments.map((d) => ({ name: d.code, count: employees.filter((e) => e.departmentId === d.id).length }))
  const statusDist = ['ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED'].map((s) => ({ name: s.replace('_', ' '), value: employees.filter((e) => e.employmentStatus === s).length }))

  const attendanceTrend = (() => {
    const byDate: Record<string, number> = {}
    for (const a of attendanceRecords) {
      if (a.status !== 'PRESENT') continue
      byDate[a.date] = (byDate[a.date] ?? 0) + 1
    }
    return Object.entries(byDate).sort(([a], [b]) => (a > b ? 1 : -1)).slice(-14).map(([date, count]) => ({ date: date.slice(5), count }))
  })()

  const leaveUsage = leaveTypes.map((t) => ({ name: t.name, days: leaveRequests.filter((l) => l.leaveTypeId === t.id && l.status === 'APPROVED').reduce((sum, l) => sum + l.days, 0) }))

  const funnel = ['APPLIED', 'SCREENING', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'HIRED'].map((s) => ({ name: s, count: applications.filter((a) => a.stage === s).length }))

  const trainingCompletion = courses.slice(0, 6).map((c) => ({
    name: c.title.length > 14 ? c.title.slice(0, 14) + '…' : c.title,
    enrolled: enrollments.filter((e) => e.sessionId && courses.find((cc) => cc.id === c.id)).length,
  }))

  const goalCompletion = [
    { name: 'Completed', value: goals.filter((g) => g.status === 'COMPLETED').length },
    { name: 'Active', value: goals.filter((g) => g.status === 'ACTIVE').length },
  ]

  return (
    <div>
      <PageHeader title="Reports" subtitle="Workforce insights derived from live application data" />
      <Tabs
        tabs={[
          { key: 'workforce', label: 'Workforce' },
          { key: 'attendance', label: 'Attendance' },
          { key: 'leave', label: 'Leave' },
          { key: 'recruitment', label: 'Recruitment' },
          { key: 'training', label: 'Training' },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {tab === 'workforce' && (
          <>
            <Card>
              <CardHeader title="Headcount by Department" />
              <CardBody>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={headcountByDept}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef0f0" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="count" fill="#34766a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
            <Card>
              <CardHeader title="Employee Status Distribution" />
              <CardBody>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={statusDist} dataKey="value" nameKey="name" outerRadius={90} label>
                      {statusDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </>
        )}

        {tab === 'attendance' && (
          <Card className="lg:col-span-2">
            <CardHeader title="Present Employees — Last 14 Days" />
            <CardBody>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef0f0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="count" stroke="#34766a" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        )}

        {tab === 'leave' && (
          <Card className="lg:col-span-2">
            <CardHeader title="Approved Leave Days by Type" />
            <CardBody>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={leaveUsage} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef0f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="days" fill="#c79c3c" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        )}

        {tab === 'recruitment' && (
          <Card className="lg:col-span-2">
            <CardHeader title="Recruitment Funnel" />
            <CardBody>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={funnel}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" fill="#2f7ec2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        )}

        {tab === 'training' && (
          <>
            <Card>
              <CardHeader title="Enrollments by Course" />
              <CardBody>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={trainingCompletion}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef0f0" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="enrolled" fill="#22a35c" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
            <Card>
              <CardHeader title="Goal Completion" />
              <CardBody>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={goalCompletion} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                      {goalCompletion.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

import * as seed from '@/data/seed'
import { delay } from '@/lib/query'
import type { LeaveRequest, AttendanceRecord } from '@/types'

// A real API layer would replace the bodies of these functions with fetch()
// calls to /api/v1/... while keeping the exact same function signatures, so
// pages/hooks never need to change. See README "Backend Integration" section.

export const employeeService = {
  list: () => delay([...seed.employees]),
  get: (id: string) => delay(seed.employees.find((e) => e.id === id) ?? null),
}

export const departmentService = {
  list: () => delay([...seed.departments]),
  get: (id: string) => delay(seed.departments.find((d) => d.id === id) ?? null),
}

export const positionService = {
  list: () => delay([...seed.positions]),
}

export const locationService = {
  list: () => delay([...seed.locations]),
}

export const attendanceService = {
  list: () => delay([...seed.attendanceRecords]),
  forEmployee: (employeeId: string) => delay(seed.attendanceRecords.filter((a) => a.employeeId === employeeId)),
  checkIn: (employeeId: string) => {
    const today = new Date().toISOString().slice(0, 10)
    const time = new Date().toTimeString().slice(0, 5)
    let record = seed.attendanceRecords.find((a) => a.employeeId === employeeId && a.date === today)
    if (!record) {
      record = { id: `ATT-LIVE-${Date.now()}`, employeeId, date: today, status: 'PRESENT', checkIn: time, checkOut: null, hoursWorked: null }
      seed.attendanceRecords.unshift(record)
    } else {
      record.checkIn = time
      record.status = 'PRESENT'
    }
    return delay({ ...record }, 600)
  },
  checkOut: (employeeId: string) => {
    const today = new Date().toISOString().slice(0, 10)
    const time = new Date().toTimeString().slice(0, 5)
    const record = seed.attendanceRecords.find((a) => a.employeeId === employeeId && a.date === today)
    if (record) {
      record.checkOut = time
      record.hoursWorked = 8
    }
    return delay(record ? { ...record } : null, 600)
  },
}

export const leaveService = {
  types: () => delay([...seed.leaveTypes]),
  balances: (employeeId: string) => delay(seed.leaveBalances.filter((b) => b.employeeId === employeeId)),
  requests: () => delay([...seed.leaveRequests]),
  requestsForEmployee: (employeeId: string) => delay(seed.leaveRequests.filter((r) => r.employeeId === employeeId)),
  create: (req: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt' | 'decidedAt' | 'decidedBy'>) => {
    const created: LeaveRequest = {
      ...req,
      id: `LR-LIVE-${Date.now()}`,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
      decidedAt: null,
      decidedBy: null,
    }
    seed.leaveRequests.unshift(created)
    return delay({ ...created }, 600)
  },
  decide: (id: string, decision: 'APPROVED' | 'REJECTED', decidedBy: string) => {
    const req = seed.leaveRequests.find((r) => r.id === id)
    if (req) {
      req.status = decision
      req.decidedAt = new Date().toISOString()
      req.decidedBy = decidedBy
    }
    return delay(req ? { ...req } : null, 600)
  },
}

export const recruitmentService = {
  jobs: () => delay([...seed.jobOpenings]),
  candidates: () => delay([...seed.candidates]),
  applications: () => delay([...seed.applications]),
  interviews: () => delay([...seed.interviews]),
  offers: () => delay([...seed.offers]),
  moveStage: (applicationId: string, stage: string) => {
    const app = seed.applications.find((a) => a.id === applicationId)
    if (app) app.stage = stage as any
    return delay(app ? { ...app } : null, 500)
  },
}

export const performanceService = {
  cycles: () => delay([...seed.performanceCycles]),
  goals: () => delay([...seed.goals]),
  goalsForEmployee: (employeeId: string) => delay(seed.goals.filter((g) => g.employeeId === employeeId)),
  reviews: () => delay([...seed.reviews]),
  updateGoalProgress: (goalId: string, current: number) => {
    const goal = seed.goals.find((g) => g.id === goalId)
    if (goal) {
      goal.current = current
      if (current >= goal.target) goal.status = 'COMPLETED'
    }
    return delay(goal ? { ...goal } : null, 500)
  },
}

export const trainingService = {
  courses: () => delay([...seed.courses]),
  sessions: () => delay([...seed.trainingSessions]),
  enrollments: () => delay([...seed.enrollments]),
  enrollmentsForEmployee: (employeeId: string) => delay(seed.enrollments.filter((e) => e.employeeId === employeeId)),
  enroll: (employeeId: string, sessionId: string) => {
    const created = { id: `ENR-LIVE-${Date.now()}`, employeeId, sessionId, status: 'ENROLLED' as const, progress: 0, certificateIssued: false }
    seed.enrollments.push(created)
    return delay({ ...created }, 500)
  },
}

export const documentService = {
  list: () => delay([...seed.employeeDocuments]),
  forEmployee: (employeeId: string) => delay(seed.employeeDocuments.filter((d) => d.employeeId === employeeId)),
}

export const workflowService = {
  list: () => delay([...seed.workflowRequests]),
  decide: (id: string, decision: 'APPROVED' | 'REJECTED') => {
    const wf = seed.workflowRequests.find((w) => w.id === id)
    if (wf) wf.status = decision === 'APPROVED' ? 'APPROVED' : 'REJECTED'
    return delay(wf ? { ...wf } : null, 500)
  },
}

export const notificationService = {
  forEmployee: (employeeId: string) => delay(seed.buildNotificationsFor(employeeId)),
}

export const auditService = {
  list: () => delay([...seed.auditEvents]),
}

export type { AttendanceRecord }

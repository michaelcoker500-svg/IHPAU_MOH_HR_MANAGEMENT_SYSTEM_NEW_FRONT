import type {
  Department, Position, Location, Employee, AttendanceRecord, WorkSchedule,
  LeaveType, LeaveBalance, LeaveRequest, JobOpening, Candidate, Application,
  Interview, Offer, PerformanceCycle, Goal, Review, Course, TrainingSession,
  Enrollment, EmployeeDocument, WorkflowRequest, AppNotification, AuditEvent,
} from '@/types'

// ---------- deterministic PRNG so data is stable across a session ----------
let seedValue = 42
function rand(): number {
  seedValue = (seedValue * 1103515245 + 12345) & 0x7fffffff
  return seedValue / 0x7fffffff
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)]
}
function randInt(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min
}
function uid(prefix: string, n: number): string {
  return `${prefix}-${String(n).padStart(4, '0')}`
}

const FIRST_NAMES_M = ['David', 'Mohamed', 'Ibrahim', 'Abdul', 'Samuel', 'Joseph', 'Alhaji', 'Foday', 'Momoh', 'Sorie', 'Alusine', 'Osman', 'Ishmael', 'Lamin', 'Kelfa']
const FIRST_NAMES_F = ['Sarah', 'Aminata', 'Fatmata', 'Isata', 'Mariama', 'Adama', 'Kadiatu', 'Zainab', 'Hawa', 'Yeabu', 'Rugiatu', 'Memunatu', 'Marie', 'Salamatu', 'Bintu']
const LAST_NAMES = ['Kamara', 'Bangura', 'Sesay', 'Koroma', 'Turay', 'Conteh', 'Kargbo', 'Mansaray', 'Jalloh', 'Kanu', 'Sankoh', 'Fofanah', 'Bah', 'Kabia', 'Sillah', 'Gbla', 'Vandi', 'Sheriff', 'Kposowa', 'Tholley']

function makeName(gender: 'Male' | 'Female') {
  const first = gender === 'Male' ? pick(FIRST_NAMES_M) : pick(FIRST_NAMES_F)
  const last = pick(LAST_NAMES)
  return { first, last }
}

// ---------- Departments ----------
export const departments: Department[] = [
  { id: 'dept-1', name: 'Human Resources', code: 'HR', parentId: null, managerId: null, status: 'ACTIVE' },
  { id: 'dept-2', name: 'Finance', code: 'FIN', parentId: null, managerId: null, status: 'ACTIVE' },
  { id: 'dept-3', name: 'Information Technology', code: 'IT', parentId: null, managerId: null, status: 'ACTIVE' },
  { id: 'dept-4', name: 'Administration', code: 'ADM', parentId: null, managerId: null, status: 'ACTIVE' },
  { id: 'dept-5', name: 'Operations', code: 'OPS', parentId: null, managerId: null, status: 'ACTIVE' },
  { id: 'dept-6', name: 'Marketing & Communications', code: 'MKT', parentId: null, managerId: null, status: 'ACTIVE' },
  { id: 'dept-7', name: 'Procurement', code: 'PRO', parentId: null, managerId: null, status: 'ACTIVE' },
  { id: 'dept-8', name: 'Research & Development', code: 'RND', parentId: null, managerId: null, status: 'ACTIVE' },
]

// ---------- Positions ----------
export const positions: Position[] = [
  { id: 'pos-1', title: 'HR Director', departmentId: 'dept-1', level: 'Director', salaryMin: 18000, salaryMax: 24000, status: 'ACTIVE' },
  { id: 'pos-2', title: 'HR Officer', departmentId: 'dept-1', level: 'Officer', salaryMin: 8000, salaryMax: 11000, status: 'ACTIVE' },
  { id: 'pos-3', title: 'HR Assistant', departmentId: 'dept-1', level: 'Assistant', salaryMin: 5000, salaryMax: 7000, status: 'ACTIVE' },
  { id: 'pos-4', title: 'Finance Manager', departmentId: 'dept-2', level: 'Manager', salaryMin: 14000, salaryMax: 19000, status: 'ACTIVE' },
  { id: 'pos-5', title: 'Finance Officer', departmentId: 'dept-2', level: 'Officer', salaryMin: 8000, salaryMax: 11000, status: 'ACTIVE' },
  { id: 'pos-6', title: 'Accountant', departmentId: 'dept-2', level: 'Officer', salaryMin: 7000, salaryMax: 10000, status: 'ACTIVE' },
  { id: 'pos-7', title: 'IT Manager', departmentId: 'dept-3', level: 'Manager', salaryMin: 15000, salaryMax: 20000, status: 'ACTIVE' },
  { id: 'pos-8', title: 'Software Developer', departmentId: 'dept-3', level: 'Officer', salaryMin: 9000, salaryMax: 13000, status: 'ACTIVE' },
  { id: 'pos-9', title: 'IT Support Specialist', departmentId: 'dept-3', level: 'Officer', salaryMin: 6000, salaryMax: 9000, status: 'ACTIVE' },
  { id: 'pos-10', title: 'Systems Administrator', departmentId: 'dept-3', level: 'Officer', salaryMin: 8000, salaryMax: 12000, status: 'ACTIVE' },
  { id: 'pos-11', title: 'Administration Manager', departmentId: 'dept-4', level: 'Manager', salaryMin: 12000, salaryMax: 16000, status: 'ACTIVE' },
  { id: 'pos-12', title: 'Administrative Officer', departmentId: 'dept-4', level: 'Officer', salaryMin: 5500, salaryMax: 8000, status: 'ACTIVE' },
  { id: 'pos-13', title: 'Front Desk Officer', departmentId: 'dept-4', level: 'Assistant', salaryMin: 4000, salaryMax: 6000, status: 'ACTIVE' },
  { id: 'pos-14', title: 'Operations Manager', departmentId: 'dept-5', level: 'Manager', salaryMin: 13000, salaryMax: 18000, status: 'ACTIVE' },
  { id: 'pos-15', title: 'Operations Officer', departmentId: 'dept-5', level: 'Officer', salaryMin: 7000, salaryMax: 10000, status: 'ACTIVE' },
  { id: 'pos-16', title: 'Field Coordinator', departmentId: 'dept-5', level: 'Officer', salaryMin: 6500, salaryMax: 9500, status: 'ACTIVE' },
  { id: 'pos-17', title: 'Marketing Manager', departmentId: 'dept-6', level: 'Manager', salaryMin: 12000, salaryMax: 17000, status: 'ACTIVE' },
  { id: 'pos-18', title: 'Communications Officer', departmentId: 'dept-6', level: 'Officer', salaryMin: 6500, salaryMax: 9500, status: 'ACTIVE' },
  { id: 'pos-19', title: 'Procurement Manager', departmentId: 'dept-7', level: 'Manager', salaryMin: 12000, salaryMax: 16000, status: 'ACTIVE' },
  { id: 'pos-20', title: 'Procurement Officer', departmentId: 'dept-7', level: 'Officer', salaryMin: 6500, salaryMax: 9500, status: 'ACTIVE' },
  { id: 'pos-21', title: 'Research Manager', departmentId: 'dept-8', level: 'Manager', salaryMin: 13000, salaryMax: 18000, status: 'ACTIVE' },
  { id: 'pos-22', title: 'Research Analyst', departmentId: 'dept-8', level: 'Officer', salaryMin: 7500, salaryMax: 11000, status: 'ACTIVE' },
  { id: 'pos-23', title: 'Recruiter', departmentId: 'dept-1', level: 'Officer', salaryMin: 7000, salaryMax: 10000, status: 'ACTIVE' },
  { id: 'pos-24', title: 'Training & Development Officer', departmentId: 'dept-1', level: 'Officer', salaryMin: 7000, salaryMax: 10000, status: 'ACTIVE' },
  { id: 'pos-25', title: 'Performance Officer', departmentId: 'dept-1', level: 'Officer', salaryMin: 7000, salaryMax: 10000, status: 'ACTIVE' },
]

// ---------- Locations ----------
export const locations: Location[] = [
  { id: 'loc-1', name: 'IHPAU Headquarters', address: '12 Siaka Stevens Street', city: 'Freetown', country: 'Sierra Leone' },
  { id: 'loc-2', name: 'Bo Office', address: '5 Fenton Road', city: 'Bo', country: 'Sierra Leone' },
  { id: 'loc-3', name: 'Kenema Office', address: '18 Hangha Road', city: 'Kenema', country: 'Sierra Leone' },
  { id: 'loc-4', name: 'Makeni Office', address: '9 Teko Road', city: 'Makeni', country: 'Sierra Leone' },
]

// ---------- Employees ----------
export const employees: Employee[] = []

function addEmployee(n: number, opts: Partial<Employee> & { gender: 'Male' | 'Female' }) {
  const { first, last } = makeName(opts.gender)
  const dept = opts.departmentId!
  const emp: Employee = {
    id: `emp-${n}`,
    employeeCode: uid('EMP', n),
    firstName: opts.firstName ?? first,
    lastName: opts.lastName ?? last,
    email: `${(opts.firstName ?? first).toLowerCase()}.${(opts.lastName ?? last).toLowerCase()}@ihpau.demo`,
    phone: `+232 7${randInt(6, 9)} ${randInt(100000, 999999)}`,
    gender: opts.gender,
    dateOfBirth: `${randInt(1970, 2000)}-${String(randInt(1, 12)).padStart(2, '0')}-${String(randInt(1, 28)).padStart(2, '0')}`,
    departmentId: dept,
    positionId: opts.positionId!,
    locationId: opts.locationId ?? 'loc-1',
    managerId: opts.managerId ?? null,
    employmentStatus: opts.employmentStatus ?? 'ACTIVE',
    employmentType: opts.employmentType ?? 'FULL_TIME',
    joinDate: opts.joinDate ?? `${randInt(2018, 2025)}-${String(randInt(1, 12)).padStart(2, '0')}-${String(randInt(1, 28)).padStart(2, '0')}`,
  }
  employees.push(emp)
  return emp
}

let empN = 1
// Department heads first (managers)
const deptHeadPositions: Record<string, string> = {
  'dept-1': 'pos-1', 'dept-2': 'pos-4', 'dept-3': 'pos-7', 'dept-4': 'pos-11',
  'dept-5': 'pos-14', 'dept-6': 'pos-17', 'dept-7': 'pos-19', 'dept-8': 'pos-21',
}
const deptHeads: Record<string, string> = {}
for (const dept of departments) {
  const gender = rand() > 0.5 ? 'Male' : 'Female'
  const head = addEmployee(empN++, {
    gender, departmentId: dept.id, positionId: deptHeadPositions[dept.id],
    joinDate: `20${randInt(18, 20)}-0${randInt(1, 9)}-1${randInt(0, 5)}`,
  })
  deptHeads[dept.id] = head.id
}

// Named seed employees (matching prompt examples) - overwrite first few with specific data
employees[0] = { ...employees[0], firstName: 'Sarah', lastName: 'Kamara', email: 'sarah.kamara@ihpau.demo', gender: 'Female' }
const itHeadIdx = employees.findIndex((e) => e.departmentId === 'dept-3' && e.positionId === 'pos-7')
if (itHeadIdx >= 0) employees[itHeadIdx] = { ...employees[itHeadIdx], firstName: 'David', lastName: 'Bangura', email: 'david.bangura@ihpau.demo', gender: 'Male' }

const staffPositionsByDept: Record<string, string[]> = {
  'dept-1': ['pos-2', 'pos-2', 'pos-3', 'pos-23', 'pos-24', 'pos-25'],
  'dept-2': ['pos-5', 'pos-5', 'pos-6', 'pos-6'],
  'dept-3': ['pos-8', 'pos-8', 'pos-8', 'pos-9', 'pos-10'],
  'dept-4': ['pos-12', 'pos-12', 'pos-13'],
  'dept-5': ['pos-15', 'pos-15', 'pos-16', 'pos-16'],
  'dept-6': ['pos-18', 'pos-18'],
  'dept-7': ['pos-20', 'pos-20'],
  'dept-8': ['pos-22', 'pos-22', 'pos-22'],
}

for (const dept of departments) {
  const posList = staffPositionsByDept[dept.id] ?? []
  for (const posId of posList) {
    const gender = rand() > 0.5 ? 'Male' : 'Female'
    const status = rand() > 0.92 ? 'ON_LEAVE' : rand() > 0.97 ? 'SUSPENDED' : 'ACTIVE'
    addEmployee(empN++, {
      gender,
      departmentId: dept.id,
      positionId: posId,
      managerId: deptHeads[dept.id],
      locationId: rand() > 0.75 ? pick(['loc-2', 'loc-3', 'loc-4']) : 'loc-1',
      employmentStatus: status,
      employmentType: rand() > 0.85 ? pick(['PART_TIME', 'CONTRACT', 'INTERN']) : 'FULL_TIME',
    })
  }
}
// Ensure we have 40+ employees; pad with additional Ops/IT staff if needed
while (employees.length < 42) {
  const dept = pick(departments)
  const posList = staffPositionsByDept[dept.id] ?? [deptHeadPositions[dept.id]]
  const gender = rand() > 0.5 ? 'Male' : 'Female'
  addEmployee(empN++, {
    gender, departmentId: dept.id, positionId: pick(posList),
    managerId: deptHeads[dept.id], locationId: 'loc-1',
  })
}

deptHeads['dept-9'] = '' // no-op safeguard

// Rewrite department managerId now that heads exist
for (const dept of departments) dept.managerId = deptHeads[dept.id] ?? null

// ---------- Work Schedules ----------
export const workSchedules: WorkSchedule[] = [
  { id: 'sch-1', name: 'Standard Office Schedule', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '08:00', end: '17:00', graceMinutes: 15, timezone: 'Africa/Freetown' },
  { id: 'sch-2', name: 'Field Operations Schedule', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], start: '07:30', end: '16:30', graceMinutes: 10, timezone: 'Africa/Freetown' },
]

// ---------- Attendance (last 30 days, weekdays) ----------
export const attendanceRecords: AttendanceRecord[] = []
{
  let n = 1
  const today = new Date('2026-08-17')
  for (const emp of employees) {
    for (let d = 29; d >= 0; d--) {
      const date = new Date(today)
      date.setDate(date.getDate() - d)
      const day = date.getDay()
      const dateStr = date.toISOString().slice(0, 10)
      if (day === 0 || day === 6) {
        attendanceRecords.push({ id: uid('ATT', n++), employeeId: emp.id, date: dateStr, status: 'WEEKEND', checkIn: null, checkOut: null, hoursWorked: null })
        continue
      }
      const roll = rand()
      let status: AttendanceRecord['status'] = 'PRESENT'
      let checkIn = '08:0' + randInt(0, 9)
      let checkOut = '17:0' + randInt(0, 9)
      let hours = 8
      if (roll > 0.94) { status = 'ABSENT'; checkIn = null as any; checkOut = null as any; hours = 0 }
      else if (roll > 0.86) { status = 'LATE'; checkIn = `08:${randInt(20, 55)}`; hours = 7.3 }
      else if (roll > 0.8) { status = 'REMOTE'; hours = 8 }
      else if (roll > 0.76) { status = 'EARLY_DEPARTURE'; checkOut = `15:${randInt(0, 45)}`; hours = 6.5 }
      else if (roll > 0.73) { status = 'HALF_DAY'; checkOut = `12:${randInt(0, 30)}`; hours = 4 }
      else if (roll > 0.7) { status = 'EXCUSED'; checkIn = null as any; checkOut = null as any; hours = 0 }
      attendanceRecords.push({
        id: uid('ATT', n++), employeeId: emp.id, date: dateStr, status,
        checkIn: status === 'ABSENT' || status === 'EXCUSED' ? null : checkIn,
        checkOut: status === 'ABSENT' || status === 'EXCUSED' ? null : checkOut,
        hoursWorked: hours,
      })
    }
  }
}

// ---------- Leave ----------
export const leaveTypes: LeaveType[] = [
  { id: 'lt-1', name: 'Annual', annualDays: 21, color: 'brand' },
  { id: 'lt-2', name: 'Sick', annualDays: 10, color: 'danger' },
  { id: 'lt-3', name: 'Study', annualDays: 5, color: 'info' },
  { id: 'lt-4', name: 'Maternity', annualDays: 90, color: 'accent' },
  { id: 'lt-5', name: 'Paternity', annualDays: 10, color: 'success' },
  { id: 'lt-6', name: 'Compassionate', annualDays: 5, color: 'warning' },
]

export const leaveBalances: LeaveBalance[] = []
{
  let n = 1
  for (const emp of employees) {
    for (const lt of leaveTypes) {
      if (lt.id === 'lt-4' && emp.gender !== 'Female') continue
      if (lt.id === 'lt-5' && emp.gender !== 'Male') continue
      const used = randInt(0, Math.floor(lt.annualDays * 0.5))
      const pending = rand() > 0.85 ? randInt(1, 3) : 0
      leaveBalances.push({ id: uid('LB', n++), employeeId: emp.id, leaveTypeId: lt.id, entitled: lt.annualDays, used, pending })
    }
  }
}

export const leaveRequests: LeaveRequest[] = []
{
  let n = 1
  const reasons = ['Family matter', 'Medical appointment', 'Rest and recuperation', 'Personal travel', 'Further studies exam', 'Bereavement', 'Wedding ceremony']
  for (const emp of employees) {
    const count = randInt(1, 4)
    for (let i = 0; i < count; i++) {
      const lt = pick(leaveTypes.filter((l) => !(l.id === 'lt-4' && emp.gender !== 'Female') && !(l.id === 'lt-5' && emp.gender !== 'Male')))
      const startMonth = randInt(1, 8)
      const startDay = randInt(1, 24)
      const days = randInt(1, 7)
      const start = new Date(2026, startMonth - 1, startDay)
      const end = new Date(start)
      end.setDate(end.getDate() + days - 1)
      const status = pick<LeaveRequest['status']>(['APPROVED', 'APPROVED', 'PENDING', 'REJECTED', 'APPROVED', 'CANCELLED'])
      leaveRequests.push({
        id: uid('LR', n++),
        employeeId: emp.id,
        leaveTypeId: lt.id,
        startDate: start.toISOString().slice(0, 10),
        endDate: end.toISOString().slice(0, 10),
        days,
        reason: pick(reasons),
        status,
        submittedAt: new Date(2026, startMonth - 1, Math.max(1, startDay - randInt(3, 10))).toISOString(),
        decidedAt: status === 'PENDING' ? null : new Date(2026, startMonth - 1, startDay - 1).toISOString(),
        decidedBy: status === 'PENDING' ? null : (deptHeads[emp.departmentId] ?? null),
      })
    }
  }
}

// ---------- Recruitment ----------
export const jobOpenings: JobOpening[] = [
  { id: 'job-1', title: 'Software Developer', departmentId: 'dept-3', positionId: 'pos-8', locationId: 'loc-1', openings: 2, closingDate: '2026-09-15', status: 'OPEN' },
  { id: 'job-2', title: 'HR Officer', departmentId: 'dept-1', positionId: 'pos-2', locationId: 'loc-1', openings: 1, closingDate: '2026-09-01', status: 'OPEN' },
  { id: 'job-3', title: 'Field Coordinator', departmentId: 'dept-5', positionId: 'pos-16', locationId: 'loc-2', openings: 3, closingDate: '2026-09-20', status: 'OPEN' },
  { id: 'job-4', title: 'Accountant', departmentId: 'dept-2', positionId: 'pos-6', locationId: 'loc-1', openings: 1, closingDate: '2026-08-30', status: 'OPEN' },
  { id: 'job-5', title: 'Communications Officer', departmentId: 'dept-6', positionId: 'pos-18', locationId: 'loc-1', openings: 1, closingDate: '2026-09-10', status: 'OPEN' },
  { id: 'job-6', title: 'IT Support Specialist', departmentId: 'dept-3', positionId: 'pos-9', locationId: 'loc-3', openings: 1, closingDate: '2026-08-25', status: 'CLOSED' },
  { id: 'job-7', title: 'Research Analyst', departmentId: 'dept-8', positionId: 'pos-22', locationId: 'loc-1', openings: 2, closingDate: '2026-10-01', status: 'OPEN' },
  { id: 'job-8', title: 'Procurement Officer', departmentId: 'dept-7', positionId: 'pos-20', locationId: 'loc-1', openings: 1, closingDate: '2026-09-05', status: 'DRAFT' },
  { id: 'job-9', title: 'Administrative Officer', departmentId: 'dept-4', positionId: 'pos-12', locationId: 'loc-4', openings: 1, closingDate: '2026-09-12', status: 'OPEN' },
  { id: 'job-10', title: 'Operations Officer', departmentId: 'dept-5', positionId: 'pos-15', locationId: 'loc-2', openings: 2, closingDate: '2026-09-18', status: 'OPEN' },
]

export const candidates: Candidate[] = []
{
  const sources = ['LinkedIn', 'Referral', 'Company Website', 'Job Fair', 'Newspaper Ad', 'University Partnership']
  for (let i = 1; i <= 25; i++) {
    const gender = rand() > 0.5 ? 'Male' : 'Female'
    const { first, last } = makeName(gender)
    candidates.push({
      id: uid('CAND', i),
      firstName: first,
      lastName: last,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.demo`,
      phone: `+232 7${randInt(6, 9)} ${randInt(100000, 999999)}`,
      source: pick(sources),
    })
  }
}

export const applications: Application[] = []
{
  const stages: Application['stage'][] = ['APPLIED', 'SCREENING', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED']
  let n = 1
  const openJobs = jobOpenings.filter((j) => j.status !== 'DRAFT')
  for (let i = 0; i < 35; i++) {
    const candidate = candidates[i % candidates.length]
    const job = pick(openJobs)
    applications.push({
      id: uid('APP', n++),
      candidateId: candidate.id,
      jobId: job.id,
      stage: pick(stages),
      appliedAt: `2026-0${randInt(6, 8)}-${String(randInt(1, 28)).padStart(2, '0')}`,
    })
  }
}

export const interviews: Interview[] = []
{
  const interviewApps = applications.filter((a) => ['INTERVIEW', 'OFFER', 'HIRED'].includes(a.stage)).slice(0, 8)
  interviewApps.forEach((app, i) => {
    interviews.push({
      id: uid('INT', i + 1),
      candidateId: app.candidateId,
      jobId: app.jobId,
      interviewer: pick(employees.filter((e) => deptHeads[e.departmentId] === e.id)).id,
      date: `2026-08-${String(randInt(18, 28)).padStart(2, '0')}`,
      time: `${randInt(9, 15)}:${pick(['00', '30'])}`,
      durationMinutes: pick([30, 45, 60]),
      location: 'IHPAU Headquarters — Conference Room B',
      status: pick(['SCHEDULED', 'COMPLETED', 'SCHEDULED']),
    })
  })
}

export const offers: Offer[] = []
{
  const offerApps = applications.filter((a) => ['OFFER', 'HIRED'].includes(a.stage)).slice(0, 5)
  offerApps.forEach((app, i) => {
    const job = jobOpenings.find((j) => j.id === app.jobId)!
    const pos = positions.find((p) => p.id === job.positionId)!
    offers.push({
      id: uid('OFF', i + 1),
      candidateId: app.candidateId,
      jobId: app.jobId,
      salary: randInt(pos.salaryMin, pos.salaryMax),
      status: app.stage === 'HIRED' ? 'ACCEPTED' : pick(['SENT', 'DRAFT']),
      sentAt: app.stage === 'HIRED' ? '2026-07-20' : '2026-08-10',
    })
  })
}

// ---------- Performance ----------
export const performanceCycles: PerformanceCycle[] = [
  { id: 'cyc-1', name: '2026 H1 Performance Cycle', startDate: '2026-01-01', endDate: '2026-06-30', status: 'CLOSED' },
  { id: 'cyc-2', name: '2026 H2 Performance Cycle', startDate: '2026-07-01', endDate: '2026-12-31', status: 'ACTIVE' },
]

export const goals: Goal[] = []
{
  const goalTitles = [
    { title: 'Improve customer response time', unit: '%' },
    { title: 'Complete departmental process audit', unit: '%' },
    { title: 'Reduce document turnaround time', unit: '%' },
    { title: 'Increase training completion rate', unit: '%' },
    { title: 'Deliver quarterly report on schedule', unit: '%' },
    { title: 'Improve attendance punctuality', unit: '%' },
    { title: 'Mentor two junior staff members', unit: 'people' },
  ]
  let n = 1
  for (const emp of employees) {
    const count = randInt(1, 2)
    for (let i = 0; i < count; i++) {
      const g = pick(goalTitles)
      const target = g.unit === 'people' ? 2 : 90
      const current = g.unit === 'people' ? randInt(0, 2) : randInt(40, 95)
      goals.push({
        id: uid('GOAL', n++),
        employeeId: emp.id,
        cycleId: 'cyc-2',
        title: g.title,
        target,
        current,
        unit: g.unit,
        status: current >= target ? 'COMPLETED' : 'ACTIVE',
        dueDate: '2026-12-31',
      })
    }
  }
}

export const reviews: Review[] = []
{
  let n = 1
  for (const emp of employees.slice(0, 25)) {
    reviews.push({
      id: uid('REV', n++), employeeId: emp.id, cycleId: 'cyc-1', reviewer: emp.managerId ?? 'emp-1',
      type: 'MANAGER', rating: randInt(3, 5), status: 'COMPLETED', submittedAt: '2026-06-25',
    })
  }
}

// ---------- Training ----------
export const courses: Course[] = [
  { id: 'crs-1', title: 'Leadership Fundamentals', category: 'Leadership', durationHours: 16, delivery: 'IN_PERSON', status: 'ACTIVE' },
  { id: 'crs-2', title: 'Advanced Excel', category: 'Technical', durationHours: 12, delivery: 'ONLINE', status: 'ACTIVE' },
  { id: 'crs-3', title: 'Workplace Communication', category: 'Soft Skills', durationHours: 8, delivery: 'HYBRID', status: 'ACTIVE' },
  { id: 'crs-4', title: 'Cybersecurity Awareness', category: 'IT', durationHours: 4, delivery: 'ONLINE', status: 'ACTIVE' },
  { id: 'crs-5', title: 'Project Management', category: 'Management', durationHours: 20, delivery: 'HYBRID', status: 'ACTIVE' },
  { id: 'crs-6', title: 'Python Development', category: 'Technical', durationHours: 30, delivery: 'ONLINE', status: 'ACTIVE' },
  { id: 'crs-7', title: 'HR Compliance', category: 'Compliance', durationHours: 6, delivery: 'IN_PERSON', status: 'ACTIVE' },
  { id: 'crs-8', title: 'Customer Service Excellence', category: 'Soft Skills', durationHours: 8, delivery: 'IN_PERSON', status: 'ACTIVE' },
  { id: 'crs-9', title: 'Data Analytics', category: 'Technical', durationHours: 24, delivery: 'ONLINE', status: 'ACTIVE' },
  { id: 'crs-10', title: 'Professional Ethics', category: 'Compliance', durationHours: 4, delivery: 'ONLINE', status: 'ACTIVE' },
]

export const trainingSessions: TrainingSession[] = []
{
  let n = 1
  for (const course of courses.slice(0, 8)) {
    trainingSessions.push({
      id: uid('SES', n++), courseId: course.id,
      startDate: `2026-0${randInt(7, 9)}-${String(randInt(1, 20)).padStart(2, '0')}`,
      endDate: `2026-0${randInt(7, 9)}-${String(randInt(21, 28)).padStart(2, '0')}`,
      capacity: randInt(15, 30),
    })
  }
}

export const enrollments: Enrollment[] = []
{
  let n = 1
  for (const emp of employees) {
    const count = randInt(0, 2)
    const chosen = new Set<string>()
    for (let i = 0; i < count; i++) {
      const session = pick(trainingSessions)
      if (chosen.has(session.id)) continue
      chosen.add(session.id)
      const status = pick<Enrollment['status']>(['COMPLETED', 'IN_PROGRESS', 'ENROLLED', 'COMPLETED'])
      enrollments.push({
        id: uid('ENR', n++), employeeId: emp.id, sessionId: session.id, status,
        progress: status === 'COMPLETED' ? 100 : status === 'IN_PROGRESS' ? randInt(20, 80) : 0,
        certificateIssued: status === 'COMPLETED' && rand() > 0.3,
      })
    }
  }
}

// ---------- Documents ----------
export const employeeDocuments: EmployeeDocument[] = []
{
  const categories: { name: string; visibility: EmployeeDocument['visibility'] }[] = [
    { name: 'Employment Contract', visibility: 'HR_ONLY' },
    { name: 'National ID', visibility: 'HR_ONLY' },
    { name: 'Academic Certificate', visibility: 'EMPLOYEE_VISIBLE' },
    { name: 'Performance Review Letter', visibility: 'MANAGER_VISIBLE' },
    { name: 'Training Certificate', visibility: 'EMPLOYEE_VISIBLE' },
    { name: 'Promotion Letter', visibility: 'CONFIDENTIAL' },
    { name: 'Policy Acknowledgement', visibility: 'EMPLOYEE_VISIBLE' },
  ]
  let n = 1
  for (const emp of employees) {
    const count = randInt(2, 4)
    for (let i = 0; i < count; i++) {
      const cat = pick(categories)
      const hasExpiry = rand() > 0.6
      const expiresAt = hasExpiry ? `2026-${String(randInt(9, 12)).padStart(2, '0')}-${String(randInt(1, 28)).padStart(2, '0')}` : null
      employeeDocuments.push({
        id: uid('DOC', n++), employeeId: emp.id, name: `${cat.name} — ${emp.firstName} ${emp.lastName}`,
        category: cat.name, visibility: cat.visibility,
        uploadedAt: `2026-0${randInt(1, 6)}-${String(randInt(1, 28)).padStart(2, '0')}`,
        expiresAt,
        status: !expiresAt ? 'VALID' : rand() > 0.8 ? 'EXPIRING' : 'VALID',
      })
    }
  }
}

// ---------- Workflows ----------
export const workflowRequests: WorkflowRequest[] = []
{
  let n = 1
  for (const lr of leaveRequests.filter((l) => l.status === 'PENDING')) {
    workflowRequests.push({
      id: uid('WF', n++), type: 'LEAVE_APPROVAL', requesterId: lr.employeeId, relatedId: lr.id,
      status: 'PENDING', submittedAt: lr.submittedAt, currentStep: 'Manager Approval',
    })
  }
  for (const doc of employeeDocuments.filter((d) => d.category === 'Policy Acknowledgement').slice(0, 6)) {
    workflowRequests.push({
      id: uid('WF', n++), type: 'DOCUMENT_ACK', requesterId: doc.employeeId, relatedId: doc.id,
      status: pick(['PENDING', 'COMPLETED']), submittedAt: doc.uploadedAt, currentStep: 'Employee Acknowledgement',
    })
  }
}

// ---------- Notifications ----------
export function buildNotificationsFor(employeeId: string): AppNotification[] {
  const base: Omit<AppNotification, 'id'>[] = [
    { category: 'LEAVE', title: 'Leave request approved', message: 'Your annual leave request has been approved by your manager.', read: false, createdAt: '2026-08-15T09:20:00', link: '/my-leave' },
    { category: 'TRAINING', title: 'Training reminder', message: 'Cybersecurity Awareness session starts tomorrow at 09:00.', read: false, createdAt: '2026-08-16T14:00:00', link: '/training/sessions' },
    { category: 'PERFORMANCE', title: 'Performance review pending', message: 'Your H2 2026 self-review is due by 31 August.', read: true, createdAt: '2026-08-10T11:00:00', link: '/performance/reviews' },
    { category: 'HR', title: 'Document acknowledgement required', message: 'Please acknowledge the updated remote work policy.', read: false, createdAt: '2026-08-14T08:00:00', link: '/documents' },
    { category: 'RECRUITMENT', title: 'New job application', message: 'A new application was received for Software Developer.', read: true, createdAt: '2026-08-12T16:30:00', link: '/recruitment/applications' },
    { category: 'ATTENDANCE', title: 'Attendance correction approved', message: 'Your attendance correction for 12 August has been approved.', read: true, createdAt: '2026-08-13T10:15:00', link: '/my-attendance' },
    { category: 'SYSTEM', title: 'Scheduled maintenance', message: 'IHPAU HR Cloud will undergo maintenance this weekend.', read: true, createdAt: '2026-08-09T07:00:00' },
  ]
  return base.map((n, i) => ({ ...n, id: `${employeeId}-notif-${i + 1}` }))
}

// ---------- Audit ----------
export const auditEvents: AuditEvent[] = []
{
  const actions = [
    'Employee profile updated', 'Leave request approved', 'Training completed',
    'Job opening created', 'Candidate moved to interview', 'Performance review submitted',
    'Document uploaded', 'Attendance correction approved', 'Employee deactivated', 'Role permission updated',
  ]
  let n = 1
  for (let i = 0; i < 60; i++) {
    const actor = pick(employees)
    auditEvents.push({
      id: uid('AUD', n++),
      timestamp: `2026-08-${String(randInt(1, 17)).padStart(2, '0')}T${String(randInt(7, 18)).padStart(2, '0')}:${String(randInt(0, 59)).padStart(2, '0')}:00`,
      actor: `${actor.firstName} ${actor.lastName}`,
      action: pick(actions),
      resource: pick(['Employee', 'Leave Request', 'Training Enrollment', 'Job Opening', 'Application', 'Review', 'Document', 'Role']),
      status: rand() > 0.05 ? 'SUCCESS' : 'FAILURE',
    })
  }
  auditEvents.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
}

export { deptHeads }

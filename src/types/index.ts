// ===== Identity & Access =====

export type RoleKey =
  | 'SUPER_ADMIN'
  | 'HR_ADMIN'
  | 'HR_OFFICER'
  | 'MANAGER'
  | 'EMPLOYEE'
  | 'RECRUITER'
  | 'TRAINING_MANAGER'
  | 'PERFORMANCE_MANAGER'
  | 'FINANCE'

export type Permission =
  | 'employee.view' | 'employee.create' | 'employee.update' | 'employee.delete'
  | 'department.view' | 'department.manage'
  | 'attendance.view' | 'attendance.manage'
  | 'leave.view' | 'leave.create' | 'leave.approve' | 'leave.reject'
  | 'recruitment.view' | 'recruitment.manage'
  | 'performance.view' | 'performance.manage'
  | 'training.view' | 'training.manage'
  | 'document.view' | 'document.manage'
  | 'workflow.view' | 'workflow.approve'
  | 'audit.view' | 'audit.manage'
  | 'report.view'
  | 'admin.manage'
  | 'compensation.view'

export interface Organization {
  id: string
  name: string
  shortName: string
  country: string
  timezone: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: RoleKey
  roleLabel: string
  organizationId: string
  employeeId?: string
  avatarInitials: string
  lastLogin: string
}

// ===== Org structure =====

export interface Department {
  id: string
  name: string
  code: string
  parentId: string | null
  managerId: string | null
  status: 'ACTIVE' | 'INACTIVE'
}

export interface Position {
  id: string
  title: string
  departmentId: string
  level: string
  salaryMin: number
  salaryMax: number
  status: 'ACTIVE' | 'INACTIVE'
}

export interface Location {
  id: string
  name: string
  address: string
  city: string
  country: string
}

// ===== Employee =====

export type EmploymentStatus = 'ACTIVE' | 'ON_LEAVE' | 'SUSPENDED' | 'TERMINATED'
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN'

export interface Employee {
  id: string
  employeeCode: string
  firstName: string
  lastName: string
  email: string
  phone: string
  gender: 'Male' | 'Female'
  dateOfBirth: string
  departmentId: string
  positionId: string
  locationId: string
  managerId: string | null
  employmentStatus: EmploymentStatus
  employmentType: EmploymentType
  joinDate: string
}

// ===== Attendance =====

export type AttendanceStatus =
  | 'PRESENT' | 'ABSENT' | 'LATE' | 'EARLY_DEPARTURE' | 'HALF_DAY' | 'WEEKEND' | 'EXCUSED' | 'REMOTE'

export interface AttendanceRecord {
  id: string
  employeeId: string
  date: string
  status: AttendanceStatus
  checkIn: string | null
  checkOut: string | null
  hoursWorked: number | null
}

export interface WorkSchedule {
  id: string
  name: string
  days: string[]
  start: string
  end: string
  graceMinutes: number
  timezone: string
}

// ===== Leave =====

export interface LeaveType {
  id: string
  name: string
  annualDays: number
  color: string
}

export interface LeaveBalance {
  id: string
  employeeId: string
  leaveTypeId: string
  entitled: number
  used: number
  pending: number
}

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'

export interface LeaveRequest {
  id: string
  employeeId: string
  leaveTypeId: string
  startDate: string
  endDate: string
  days: number
  reason: string
  status: LeaveStatus
  submittedAt: string
  decidedAt: string | null
  decidedBy: string | null
}

// ===== Recruitment =====

export type JobStatus = 'OPEN' | 'CLOSED' | 'DRAFT'

export interface JobOpening {
  id: string
  title: string
  departmentId: string
  positionId: string
  locationId: string
  openings: number
  closingDate: string
  status: JobStatus
}

export interface Candidate {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  source: string
}

export type ApplicationStage = 'APPLIED' | 'SCREENING' | 'SHORTLISTED' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED'

export interface Application {
  id: string
  candidateId: string
  jobId: string
  stage: ApplicationStage
  appliedAt: string
}

export interface Interview {
  id: string
  candidateId: string
  jobId: string
  interviewer: string
  date: string
  time: string
  durationMinutes: number
  location: string
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
}

export type OfferStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'CANCELLED'

export interface Offer {
  id: string
  candidateId: string
  jobId: string
  salary: number
  status: OfferStatus
  sentAt: string | null
}

// ===== Performance =====

export interface PerformanceCycle {
  id: string
  name: string
  startDate: string
  endDate: string
  status: 'ACTIVE' | 'CLOSED' | 'UPCOMING'
}

export type GoalStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'

export interface Goal {
  id: string
  employeeId: string
  cycleId: string
  title: string
  target: number
  current: number
  unit: string
  status: GoalStatus
  dueDate: string
}

export interface Review {
  id: string
  employeeId: string
  cycleId: string
  reviewer: string
  type: 'SELF' | 'MANAGER' | 'HR'
  rating: number
  status: 'DRAFT' | 'SUBMITTED' | 'COMPLETED'
  submittedAt: string | null
}

// ===== Training =====

export interface Course {
  id: string
  title: string
  category: string
  durationHours: number
  delivery: 'ONLINE' | 'IN_PERSON' | 'HYBRID'
  status: 'ACTIVE' | 'ARCHIVED'
}

export interface TrainingSession {
  id: string
  courseId: string
  startDate: string
  endDate: string
  capacity: number
}

export interface Enrollment {
  id: string
  employeeId: string
  sessionId: string
  status: 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED' | 'DROPPED'
  progress: number
  certificateIssued: boolean
}

// ===== Documents =====

export type DocumentVisibility = 'EMPLOYEE_VISIBLE' | 'HR_ONLY' | 'MANAGER_VISIBLE' | 'CONFIDENTIAL'

export interface EmployeeDocument {
  id: string
  employeeId: string
  name: string
  category: string
  visibility: DocumentVisibility
  uploadedAt: string
  expiresAt: string | null
  status: 'VALID' | 'EXPIRING' | 'EXPIRED'
}

// ===== Workflow / Approvals =====

export type WorkflowStatus = 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED'

export interface WorkflowRequest {
  id: string
  type: 'LEAVE_APPROVAL' | 'DOCUMENT_ACK' | 'PERFORMANCE_REVIEW' | 'TRAINING_REQUEST' | 'EMPLOYEE_UPDATE'
  requesterId: string
  relatedId: string
  status: WorkflowStatus
  submittedAt: string
  currentStep: string
}

// ===== Notifications =====

export interface AppNotification {
  id: string
  category: 'HR' | 'LEAVE' | 'ATTENDANCE' | 'PERFORMANCE' | 'TRAINING' | 'RECRUITMENT' | 'SYSTEM'
  title: string
  message: string
  read: boolean
  createdAt: string
  link?: string
}

// ===== Audit =====

export interface AuditEvent {
  id: string
  timestamp: string
  actor: string
  action: string
  resource: string
  status: 'SUCCESS' | 'FAILURE'
}

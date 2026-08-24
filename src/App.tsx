import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/app/query-client'
import { AuthProvider, useAuth } from '@/app/auth-context'
import { ToastProvider } from '@/app/toast-context'
import { ErrorBoundary } from '@/app/ErrorBoundary'
import { AppLayout } from '@/layouts/AppLayout'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { Skeleton } from '@/components/ui/Skeleton'

import LoginPage from '@/pages/auth/LoginPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'

const EmployeesPage = lazy(() => import('@/pages/employees/EmployeesPage'))
const EmployeeProfilePage = lazy(() => import('@/pages/employees/EmployeeProfilePage'))
const DepartmentsPage = lazy(() => import('@/pages/departments/DepartmentsPage'))
const DepartmentDetailPage = lazy(() => import('@/pages/departments/DepartmentDetailPage'))
const PositionsPage = lazy(() => import('@/pages/positions/PositionsPage'))
const LocationsPage = lazy(() => import('@/pages/locations/LocationsPage'))
const AttendancePage = lazy(() => import('@/pages/attendance/AttendancePage'))
const MyAttendancePage = lazy(() => import('@/pages/attendance/MyAttendancePage'))
const LeavePage = lazy(() => import('@/pages/leave/LeavePage'))
const MyLeavePage = lazy(() => import('@/pages/leave/MyLeavePage'))
const RecruitmentLayout = lazy(() => import('@/pages/recruitment/RecruitmentLayout'))
const RecruitmentOverviewPage = lazy(() => import('@/pages/recruitment/RecruitmentOverviewPage'))
const JobsPage = lazy(() => import('@/pages/recruitment/JobsPage'))
const CandidatesPage = lazy(() => import('@/pages/recruitment/CandidatesPage'))
const PipelinePage = lazy(() => import('@/pages/recruitment/PipelinePage'))
const InterviewsPage = lazy(() => import('@/pages/recruitment/InterviewsPage'))
const OffersPage = lazy(() => import('@/pages/recruitment/OffersPage'))
const PerformancePage = lazy(() => import('@/pages/performance/PerformancePage'))
const TrainingPage = lazy(() => import('@/pages/training/TrainingPage'))
const DocumentsPage = lazy(() => import('@/pages/documents/DocumentsPage'))
const ApprovalsPage = lazy(() => import('@/pages/approvals/ApprovalsPage'))
const NotificationsPage = lazy(() => import('@/pages/notifications/NotificationsPage'))
const AuditPage = lazy(() => import('@/pages/audit/AuditPage'))
const ReportsPage = lazy(() => import('@/pages/reports/ReportsPage'))
const UsersPage = lazy(() => import('@/pages/admin/UsersPage'))
const RolesPage = lazy(() => import('@/pages/admin/RolesPage'))
const PermissionsPage = lazy(() => import('@/pages/admin/PermissionsPage'))
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'))
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function RootRedirect() {
  const { user } = useAuth()
  return <Navigate to={user ? '/dashboard' : '/login'} replace />
}

function PageFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  <Route path="/" element={<RootRedirect />} />
                  <Route path="/login" element={<LoginPage />} />

                  <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                      <Route path="/dashboard" element={<DashboardPage />} />

                      <Route element={<ProtectedRoute requires="employee.view" />}>
                        <Route path="/employees" element={<EmployeesPage />} />
                        <Route path="/employees/:id" element={<EmployeeProfilePage />} />
                      </Route>

                      <Route element={<ProtectedRoute requires="department.view" />}>
                        <Route path="/departments" element={<DepartmentsPage />} />
                        <Route path="/departments/:id" element={<DepartmentDetailPage />} />
                        <Route path="/positions" element={<PositionsPage />} />
                        <Route path="/locations" element={<LocationsPage />} />
                      </Route>

                      <Route element={<ProtectedRoute requires="attendance.view" />}>
                        <Route path="/attendance" element={<AttendancePage />} />
                      </Route>
                      <Route path="/my-attendance" element={<MyAttendancePage />} />

                      <Route element={<ProtectedRoute requires="leave.view" />}>
                        <Route path="/leave" element={<LeavePage />} />
                      </Route>
                      <Route path="/my-leave" element={<MyLeavePage />} />

                      <Route element={<ProtectedRoute requires="recruitment.view" />}>
                        <Route path="/recruitment" element={<RecruitmentLayout />}>
                          <Route index element={<RecruitmentOverviewPage />} />
                          <Route path="jobs" element={<JobsPage />} />
                          <Route path="candidates" element={<CandidatesPage />} />
                          <Route path="applications" element={<PipelinePage />} />
                          <Route path="interviews" element={<InterviewsPage />} />
                          <Route path="offers" element={<OffersPage />} />
                        </Route>
                      </Route>

                      <Route element={<ProtectedRoute requires="performance.view" />}>
                        <Route path="/performance" element={<PerformancePage />} />
                        <Route path="/performance/cycles" element={<PerformancePage />} />
                        <Route path="/performance/goals" element={<PerformancePage />} />
                        <Route path="/performance/reviews" element={<PerformancePage />} />
                      </Route>

                      <Route element={<ProtectedRoute requires="training.view" />}>
                        <Route path="/training" element={<TrainingPage />} />
                        <Route path="/training/courses" element={<TrainingPage />} />
                        <Route path="/training/sessions" element={<TrainingPage />} />
                      </Route>

                      <Route element={<ProtectedRoute requires="document.view" />}>
                        <Route path="/documents" element={<DocumentsPage />} />
                        <Route path="/my-documents" element={<DocumentsPage />} />
                      </Route>

                      <Route element={<ProtectedRoute requires="workflow.view" />}>
                        <Route path="/approvals" element={<ApprovalsPage />} />
                      </Route>

                      <Route path="/notifications" element={<NotificationsPage />} />

                      <Route element={<ProtectedRoute requires="audit.view" />}>
                        <Route path="/audit" element={<AuditPage />} />
                      </Route>

                      <Route element={<ProtectedRoute requires="report.view" />}>
                        <Route path="/reports" element={<ReportsPage />} />
                      </Route>

                      <Route element={<ProtectedRoute requires="admin.manage" />}>
                        <Route path="/admin/users" element={<UsersPage />} />
                        <Route path="/admin/roles" element={<RolesPage />} />
                        <Route path="/admin/permissions" element={<PermissionsPage />} />
                      </Route>

                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                    </Route>
                  </Route>

                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

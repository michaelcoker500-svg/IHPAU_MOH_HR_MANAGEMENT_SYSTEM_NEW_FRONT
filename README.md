# IHPAU HR Cloud

Enterprise HR platform frontend for the **International Human Potential & Advancement Union** (Freetown, Sierra Leone).

Built with React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router + TanStack Query + Recharts.

---

## Getting started (VS Code / local machine)

```bash
cd ihpau-hr-cloud
npm install
npm run dev       # http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build locally
```

No backend, database, or `.env` file is required to run the app — it boots entirely from an in-memory mock dataset (see Architecture below). Copy `.env.example` to `.env` only once you're ready to connect a real API.

## Demo accounts

There is no password — this is a demo-mode login. Open the app and pick a role card:

| Role | Email |
|---|---|
| Super Admin | superadmin@ihpau.demo |
| HR Administrator | hr.admin@ihpau.demo |
| HR Officer | hr.officer@ihpau.demo |
| Department Manager | manager@ihpau.demo |
| Employee | employee@ihpau.demo |
| Recruiter | recruiter@ihpau.demo |
| Training Manager | training@ihpau.demo |
| Performance Manager | performance@ihpau.demo |
| Finance | finance@ihpau.demo |

Each role sees a different dashboard, navigation set, and permitted actions (see `src/permissions/index.ts`).

---

## Architecture

```
src/
  app/            auth context, toast system, nav config, query client, error boundary
  components/
    ui/           design-system primitives (Button, DataTable, Modal, Drawer, Tabs, ...)
    layout/       Sidebar, Topbar, CommandPalette, NotificationPanel
    shared/       PermissionGate, ProtectedRoute, PageHeader, Breadcrumbs
  layouts/        AppLayout (sidebar + topbar shell)
  pages/          one folder per module (employees, leave, recruitment, ...)
  data/seed.ts    deterministic, relationally-consistent fictional dataset
  services/       mock "API" — same function shapes a real API client would have
  permissions/    role -> capability matrix
  types/          shared domain types
```

**Services, not scattered fetches.** Every page reads data through `src/services/index.ts`
(`employeeService`, `leaveService`, `attendanceService`, etc.), never by importing `src/data/seed.ts`
directly for anything that should eventually be a network call. Each service function returns a
`Promise` (via a `delay()` helper) so loading states are real, not instant. **To connect a real
backend:** replace the body of each function in `src/services/index.ts` with a `fetch()`/axios call
to `VITE_API_BASE_URL` — the function signatures are the contract, so pages and hooks do not need
to change.

**Permissions, not role checks.** Pages/components ask `can('leave.approve')`, not
`role === 'HR_ADMIN'`. The mapping lives in one file (`src/permissions/index.ts`) so adding a role
or changing what it can do is a one-line change. `<PermissionGate>` hides UI, `<ProtectedRoute
requires="...">` blocks whole pages. **This is UX only** — see Liabilities below.

**Relational mock data.** `src/data/seed.ts` builds ~42 employees across 8 departments with real
manager chains, then derives attendance, leave, recruitment, performance, training, documents,
workflows and audit records *from* those employees — so a manager's team, a department's headcount,
and a dashboard KPI always agree with each other.

---

## Feature status

### IMPLEMENTED (fully working against mock data/state, no backend required)
- Demo authentication + 9-role switching, permission-gated navigation and routes
- Responsive app shell: collapsible desktop sidebar, off-canvas mobile drawer, compact mobile header
- Command palette (Ctrl/Cmd+K) — navigate, search employees/departments, permission-aware actions
- Role-aware dashboards (9 distinct dashboard layouts) with charts driven by the same dataset as the tables
- Employees: list (search/sort/filter/paginate), profile with 9 tabs, create, edit
- Departments: list, detail (employees/positions tabs), edit
- Positions, Locations (salary visibility gated by `compensation.view`)
- Attendance: org-wide table with filters; self-service check-in/check-out with live state
- Leave: HR approve/reject workflow with confirmation dialogs; self-service request flow with balances
- Recruitment: jobs, candidates, interactive pipeline (desktop kanban + mobile stage selector, move stage forward/back), interviews, offers
- Performance: cycles, goals with inline progress update, reviews
- Training: course catalog with enroll action, "My Enrollments"
- Documents: visibility-aware list (CONFIDENTIAL/HR_ONLY hidden from unauthorized roles)
- Approvals: pending/completed tabs, approve/reject with confirmation
- Notifications: panel + full page, mark read / mark all read, unread badge
- Audit log: filterable, sortable, detail drawer (read-only)
- Reports: 5 categories of charts (workforce, attendance, leave, recruitment, training)
- Admin: Users, Roles, Permissions (responsive matrix -> card view on mobile)
- Toasts, skeleton loading states, empty states, 403/404 handling, error boundary
- Full responsive behavior: tables -> cards on mobile, filter bars -> drawer, modals -> sheet-style on small screens

### MOCKED
- All of the above — there is no backend. Every mutation (check-in, approvals, edits, enrollments) updates React state for the session only and resets on reload.

### COMING SOON
- Payroll, Benefits, biometric/GPS attendance, external LMS/job-board integrations, AI features (deliberately excluded, not real IHPAU features)
- Settings -> General/Notifications/Appearance tabs are placeholders
- Job opening creation form (shows a "Coming Soon" modal)

### REQUIRES BACKEND INTEGRATION
- Document upload/download/preview (needs file storage)
- Password change / session management
- Real authentication (current login is demo-only)
- Persisting any "Mocked" data beyond a single browser session

---

## Liabilities / known limitations (please read before using this beyond a demo)

**This is a frontend-only prototype. There is no backend, no database, and no server-side
authorization.** Concretely:

1. **No real authentication.** "Login" is a role picker with no password, no token, no session
   expiry. Anyone who opens the app can pick "Super Admin." Fine for a demo, not fine for real data.
2. **No real authorization boundary.** All permission checks run in the browser and can be
   inspected or bypassed via dev tools or a modified build. In a real deployment, every one of
   these checks must be re-enforced server-side; the frontend checks are UX only.
3. **Nothing persists.** All data lives in a JS module re-initialized on every page reload.
   Refreshing reverts every edit, approval, check-in, and enrollment made during the session.
4. **All employee data is fictional but realistic-looking.** If deployed publicly, treat it as
   public information since there's no login wall protecting it.
5. **No rate limiting, no CSRF protection, no server-side input validation**, because there is no
   server. Client-side form validation is a UX convenience, not a security control.
6. **The Content-Security-Policy in `index.html`** is a reasonable default for a backend-less app
   (`connect-src 'self'`), but needs the real API's origin added the moment a backend is connected,
   or requests will be silently blocked by the browser.
7. **`compensation.view` gating (salary data) is illustrative, not audited.** Relying on it for real
   compensation data needs a security review confirming the backend never sends salary fields to
   roles that shouldn't see them, rather than sending-then-hiding client-side, as this demo does.
8. **Bundle size**: main JS chunk is ~700KB (~209KB gzipped) before route-level splitting savings
   apply on navigation. Recharts and icons are the largest contributors.
9. **No automated tests.** Before production use, add tests for at least permission gating, leave
   balance math, and the attendance check-in/out state machine.
10. **Accessibility was designed-in** (focus traps, Escape-to-close, aria labels, keyboard-operable
    command palette) but **not audited** with a screen reader or automated tool (axe, Lighthouse).
11. **No internationalization.** All strings are hard-coded English.
12. **Scope**: this implements the core of the specification — shell, auth/permissions, and the
    primary flow through every listed module — rather than every possible feature (e.g.
    drag-and-drop kanban, offer-letter generation, and payroll are intentionally out of scope, see
    Coming Soon). Treat it as a strong, extensible foundation, not a finished, audited system.

## Recommended next steps

1. Stand up the real backend (Django/DRF per your existing architecture, or any stack).
2. Replace each function body in `src/services/index.ts` with real `fetch()` calls; keep signatures identical so no page needs to change.
3. Replace demo login with real authentication, and move all `can()` checks to be backed by a server-verified permission payload, not just a client-held role string.
4. Add the API origin to the CSP `connect-src` in `index.html`.
5. Add an automated test suite before any production rollout.
6. Add persistence (the backend + database) before relying on any data entered through the UI.

# Kiro Spec — Tasks

> Task tracking as used in Kiro's spec-driven workflow.
> For full plans see `implementation-plan.md`, `frontend-task-plan.md`, `backend-task-plan.md`.

---

## Backend Tasks

| ID | Task | Status |
|---|---|---|
| BE-0 | Scaffold: Express + TypeScript + Mongoose, env config, DB connection | ✅ |
| BE-1 | Google OAuth: Passport strategy, JWT utils, auth middleware, auth routes | ✅ |
| BE-2 | User model + seed script | ✅ |
| BE-3 | Ticket + Comment models + indexes | ✅ |
| BE-4 | Repositories: ticket (findAll, findById, insert, update, updateStatus, remove), comment | ✅ |
| BE-5 | Services: ticket (+ state machine ALLOWED_TRANSITIONS), comment (+ terminal guard) | ✅ |
| BE-6 | Schemas: express-validator rules for create, update, status, comments, list query | ✅ |
| BE-7 | Controllers: ticket (6 actions), comment (2 actions), auth (4 actions) | ✅ |
| BE-8 | Routes: all registered in app.ts with helmet, CORS, rate limit | ✅ |
| BE-9 | Hardening: CastError, assignedTo validation, logger, CORS preflight, .gitignore | ✅ |
| BE-10 | Tests: 26 integration tests (15 state machine + 11 CRUD) | ✅ |
| BE-11 | MongoDB reconnection, graceful SIGTERM shutdown | ✅ |
| BE-12 | Gap closures: assignee filter, multi-status filter, sort by priority, toast triggers | ✅ |

---

## Frontend Tasks

| ID | Task | Status |
|---|---|---|
| FE-1 | Scaffold: Vite + TS + Tailwind, path alias, ESLint/Prettier, shared types | ✅ |
| FE-2 | UI library: 14 components (Button, Input, Select, Textarea, Badge, Spinner, Modal, ConfirmDialog, EmptyState, ErrorMessage, Table, Pagination, SkeletonRow, Avatar) | ✅ |
| FE-3 | Auth: AuthContext, PrivateRoute, LoginPage, AuthCallbackPage | ✅ |
| FE-4 | API layer: Axios client + interceptors, React Query, queryKeys, 8 hooks, all API functions | ✅ |
| FE-5 | Ticket list: AppLayout, Sidebar, PageHeader, TicketFilters, TicketTable, URL sync | ✅ |
| FE-6 | Create ticket: TicketForm (create mode), CreateTicketPage, field error mapping | ✅ |
| FE-7 | Ticket detail: TicketInfo, TicketStatusControl (state machine), CommentList, AddCommentForm | ✅ |
| FE-8 | Edit ticket: TicketForm (edit mode), EditTicketPage, terminal-state guard | ✅ |
| FE-9 | Error handling: ErrorBoundary, NotFoundPage, all loading/empty/error states audited | ✅ |
| FE-10 | Gap closures: toast notifications, assignee filter, sort controls, auto-scroll comments | ✅ |

---

## Documentation Tasks

| ID | Task | Status |
|---|---|---|
| DOC-1 | requirements-analysis.md | ✅ |
| DOC-2 | technical-architecture.md | ✅ |
| DOC-3 | coding-guidelines.md | ✅ |
| DOC-4 | application-design.md | ✅ |
| DOC-5 | frontend-task-plan.md + backend-task-plan.md | ✅ |
| DOC-6 | All 28 assessment submission artifacts | ✅ |

---

## Definition of Done

- [ ] TypeScript: `tsc --noEmit` passes with 0 errors
- [ ] Build: `npm run build` passes on frontend
- [ ] Tests: all 26 integration tests pass
- [ ] Manual: key flows verified in browser
- [ ] Docs: CHANGELOG.md updated for FE phases
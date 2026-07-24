# Design Notes

## Architecture Overview

```
Browser (React SPA)
     │  HTTPS / REST JSON
     ▼
Express API (Node.js :5000)
  ├── Routes → Controllers → Services → Repositories → Mongoose Models
  ├── Middleware: Auth (JWT) | Validation | Error | Logger | CORS | Rate Limit
     │
     ▼
MongoDB (localhost or Atlas)
  Collections: users · tickets · comments
```

**Key design decisions:**
- Stateless API — JWT in memory (access) + HTTP-only cookie (refresh)
- Repository pattern — all DB operations isolated from business logic
- Single `ALLOWED_TRANSITIONS` constant shared as the state machine source of truth
- `.toJSON()` called explicitly in repositories (not `.lean()`) to ensure consistent `id` mapping

---

## Frontend Design

**Stack**: React 19 + Vite + TypeScript + Tailwind CSS + React Query + Axios

**Layout**: Fixed 240px dark sidebar (`#0f172a`) + flex-1 white main area

**Component hierarchy**:
```
App (AuthProvider + QueryClientProvider + BrowserRouter)
└── PrivateRoute
    └── AppLayout (Sidebar + main content)
        ├── TicketListPage → TicketFilters + TicketTable + Pagination
        ├── CreateTicketPage → TicketForm
        ├── TicketDetailPage → TicketInfo + TicketStatusControl + CommentList + AddCommentForm
        └── EditTicketPage → TicketForm (pre-filled)
```

**State management**:
- Server state: React Query (tickets, comments, users)
- Auth state: React Context (user, accessToken)
- UI state: local `useState` (filters, form fields)
- URL state: `useSearchParams` for filters/pagination (bookmarkable)

**Key UI decisions**:
- Status transitions: only valid next states shown as buttons (derived from `ALLOWED_TRANSITIONS`)
- Destructive transitions (CANCEL, CLOSE): confirmation dialog required
- Backend 422 transition errors: shown inline below status control — never swallowed
- CLOSED/CANCELLED tickets: Edit button disabled + edit route shows blocked state

---

## Backend Design

**Stack**: Express + TypeScript + Mongoose + Passport + JWT

**Layered architecture**:
```
Route (register endpoints)
  → Validator (express-validator chains)
    → Auth Middleware (JWT verify)
      → Controller (extract request data)
        → Service (business logic, state machine)
          → Repository (DB operations only)
            → Mongoose Model (schema)
```

**State machine** (single constant, never scattered conditionals):
```ts
const ALLOWED_TRANSITIONS = {
  OPEN:        ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['RESOLVED',    'CANCELLED'],
  RESOLVED:    ['CLOSED'],
  CLOSED:      [],
  CANCELLED:   [],
};
```

**Auth flow**: Google OAuth → Passport strategy → find/create user → sign JWT → set refresh cookie → redirect to `/auth/callback?token=<access>` → FE stores in memory

---

## Database Design

Three collections: `users`, `tickets`, `comments`

**Indexes:**
- `tickets`: status, priority, assignedTo, createdBy, createdAt
- `comments`: (ticket, createdAt) compound

**Relationships**: MongoDB references (not embeds) — tickets and comments queryable independently

See `data-model.md` for full schema details.

---

## Validation Strategy

- Backend is the authoritative guard — all validation at the controller boundary via express-validator
- Frontend mirrors validation for UX (inline field errors) but backend rejects regardless
- All incoming data validated before any DB operation
- Status transitions validated in service layer (not controller) — belongs to business logic

---

## Error Handling Strategy

**Backend**: Single `errorMiddleware` — all errors flow through it:
- `AppError` (known) → returns `statusCode`, `code`, `message`, optional field `errors[]`
- `CastError` (invalid ObjectId) → 404
- `ValidationError` (Mongoose) → 422
- Unknown → 500 with generic message (no stack trace in production)

**Frontend**:
- React Query `isError` states → inline error messages per component
- Axios 401 → silent refresh → retry → redirect to `/login` if refresh fails
- Route-level `ErrorBoundary` → catches render errors → "Something went wrong" + reload button
- Toast notifications for success/error on all mutations

---

## Testing Strategy

See `test-strategy.md` for full details.

Summary: Integration tests via Jest + Supertest against mongodb-memory-server. Each test creates isolated data, makes real HTTP requests, and asserts on response codes and body shape. No shared state between tests.

---

## Appendix A — Full Technical Architecture

> The following sections are extracted from `technical-architecture.md` (the full document in the repo root docs folder).

### Request Lifecycle (End-to-End Trace)

Example: `PATCH /api/tickets/:id/status` — "Mark In Progress"

```
Browser → useTransitionStatus hook → Axios (Bearer JWT)
  → Express Router (matches PATCH /tickets/:id/status)
  → transitionStatusSchema (express-validator)
  → validateMiddleware (422 if invalid)
  → authenticate middleware (verify JWT → req.user)
  → transitionStatus controller
  → ticketService.transitionStatus (checks ALLOWED_TRANSITIONS)
  → ticketRepository.updateStatus (Mongoose findByIdAndUpdate)
  → MongoDB write
  → Controller sends 200 { success, data, message }
  → Axios receives → React Query invalidates cache → UI re-renders
```

### Architectural Decision Records (Summary)

| ADR | Decision | Why |
|---|---|---|
| ADR-001 | Tailwind CSS over CSS Modules | Co-located styles, design system constraints, no naming overhead |
| ADR-002 | Context API for auth + Zustand for UI state | Auth changes rarely; Zustand lightweight for UI state |
| ADR-003 | React Query for server state | Caching, background refetch, invalidation — out of the box |
| ADR-004 | Repository layer between Services and Models | Decouples business logic from ORM, enables unit testing |
| ADR-005 | express-validator for request validation | Native Express integration; Zod used for env config only |

---

## Appendix B — UI/UX Design System

> Design tokens and component specs extracted from `application-design.md`.

### Colour Tokens

| Token | Hex | Usage |
|---|---|---|
| Primary | `#2563eb` (blue-600) | Buttons, active nav, focus rings |
| Sidebar bg | `#0f172a` (slate-900) | Fixed sidebar background |
| Page bg | `#f8fafc` (slate-50) | Main content area |
| Card bg | `#ffffff` | White cards and panels |
| Error | `#ef4444` (red-500) | Errors, destructive actions |

### Status Badge Colours

| Status | Tailwind |
|---|---|
| Open | `bg-blue-100 text-blue-700` |
| In Progress | `bg-yellow-100 text-yellow-700` |
| Resolved | `bg-green-100 text-green-700` |
| Closed | `bg-slate-100 text-slate-600` |
| Cancelled | `bg-red-100 text-red-700` |

### Priority Badge Colours

| Priority | Tailwind |
|---|---|
| Low | `bg-green-100 text-green-700` |
| Medium | `bg-yellow-100 text-yellow-700` |
| High | `bg-orange-100 text-orange-700` |
| Critical | `bg-red-100 text-red-700` |

### Typography

- Font: **Inter** (Google Fonts, weights 400/500/600/700)
- Page title: `text-2xl font-bold text-slate-800`
- Body: `text-sm text-slate-800`
- Muted: `text-xs text-slate-400`

### Layout

- Sidebar: 240px fixed, `bg-slate-900`
- Main area: `flex-1`, `bg-slate-50`
- Page padding: `px-8 py-8`
- Max content width: `max-w-screen-xl`
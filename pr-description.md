# PR Description

## Summary

Implements a complete full-stack Support Ticket Management System (TicketDesk) using React + Node.js + MongoDB. The application allows internal users to create, update, comment on, search, and progress tickets through an enforced status state machine.

---

## Features Implemented

### Core (All Mandatory Requirements)
- ✅ Create tickets with title, description, priority, and optional assignee
- ✅ List tickets with keyword search, status/assignee filters, sorting, and pagination
- ✅ View ticket details with all fields and comment history
- ✅ Update ticket fields (title, description, priority, assignee)
- ✅ Status state machine with strict transition enforcement
- ✅ Add comments (blocked on CLOSED/CANCELLED tickets)
- ✅ Data persistence across restarts (MongoDB)
- ✅ Backend validation with field-level error responses
- ✅ Meaningful error states throughout the UI

### Stretch (All Optional Items Implemented)
- ✅ Google OAuth 2.0 authentication + JWT (access in memory, refresh in HTTP-only cookie)
- ✅ Role-based access control (admin / agent / user)
- ✅ Filter by assignee + sort by createdAt/priority + full pagination
- ✅ Toast notifications for all user actions
- ✅ Block editing of terminal-state tickets (both BE guard + FE UX)
- ✅ Persistent AI project context via Kiro steering files

---

## Technical Changes

### Backend
- Express + TypeScript REST API with layered architecture (Route → Controller → Service → Repository → Model)
- Google OAuth via Passport.js + JWT (15min access / 7d refresh)
- State machine enforced as a single `ALLOWED_TRANSITIONS` constant in the service layer
- MongoDB with Mongoose — 3 collections: users, tickets, comments
- express-validator on all endpoints
- Central error middleware (AppError + CastError + Mongoose validation)
- Rate limiting on auth endpoints, helmet for security headers
- MongoDB reconnection on disconnect with retry

### Frontend
- React 19 + Vite + TypeScript + Tailwind CSS
- React Query for server state, React Context for auth state
- Axios with JWT interceptor + silent refresh on 401
- URL-synced filter state (bookmarkable, browser back/forward works)
- `TicketStatusControl` — derives valid transitions from `ALLOWED_TRANSITIONS` constant (same as backend)
- Confirmation dialog for destructive transitions (Cancel, Close)
- Route-level ErrorBoundary for unexpected render errors

---

## Database Changes

- New collections: `users`, `tickets`, `comments`
- Indexes: status, priority, assignedTo, createdBy, createdAt on tickets; (ticket, createdAt) on comments
- Seed script creates 5 users (1 admin, 2 agents, 2 users)

---

## Testing Done

- 26 integration tests (15 state machine + 11 CRUD) — all passing
- TypeScript clean build: `tsc --noEmit` passes on both FE and BE
- Production build: `npm run build` passes (190 modules, 0 errors)
- Manual smoke test: full user journey from login to ticket creation to status transitions

---

## AI Usage Summary

Built entirely using **Kiro** as the primary AI tool. Key AI contributions:
- Requirements analysis and structured documentation
- Layered architecture design with explicit trade-off decisions
- Complete TypeScript code generation phase-by-phase
- Root cause analysis for 6 bugs found during testing
- Integration test case generation (15 state machine cases)
- Code review against defined coding guidelines

See `ai-prompts/` for categorised prompt history and `tool-workflow.md` for methodology.

---

## Known Limitations

- Seeded users have synthetic Google IDs — they cannot log in via Google OAuth (only real Google accounts can log in)
- No pagination on comments (out of scope for Core)
- No email notifications on status change (out of scope)
- No file attachments (out of scope)

## Future Improvements

- Add Swagger/OpenAPI documentation
- Implement comment editing/deletion
- Add real-time updates via WebSockets
- Add email notifications on ticket assignment/status change
- Docker setup for consistent local environment
# Kiro Spec — Requirements

> This file represents the requirements as used in Kiro's spec-driven development workflow.
> Kiro used this as persistent context for all code generation sessions.
> For the full requirements document, see `requirements-analysis.md`.

---

## Project

**Support Ticket Management System (TicketDesk)**
Internal web application for managing support tickets through a defined lifecycle.

---

## Core Entities

### User (seeded only)
- id, name, email, role (admin/agent/user)
- Created via seed script or first Google login
- No user management UI required

### Ticket
- id, ticketId (TKT-XXXXX), title, description, priority, status, category
- assignedTo (User ref, nullable), createdBy (User ref, immutable)
- createdAt, updatedAt (auto)

### Comment
- id, ticket (Ticket ref), message, createdBy (User ref)
- createdAt (auto)
- Immutable — no edit or delete

---

## Status State Machine (CRITICAL REQUIREMENT)

```
ALLOWED_TRANSITIONS = {
  OPEN:        ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['RESOLVED',    'CANCELLED'],
  RESOLVED:    ['CLOSED'],
  CLOSED:      [],
  CANCELLED:   [],
}
```

- This constant is the single source of truth — same in both BE and FE
- Backend enforces with 422 + descriptive error message
- Frontend shows only valid next-state buttons
- Destructive transitions (CANCEL, CLOSE) require confirmation dialog
- Terminal states (CLOSED, CANCELLED): no edit, no comment, no transition

---

## Feature Requirements

| ID | Feature |
|---|---|
| FR-01 | Create ticket (status auto-OPEN, createdBy from auth) |
| FR-02 | List tickets (paginated, sortable) |
| FR-03 | View ticket detail (full fields + comments) |
| FR-04 | Update fields (title, description, priority, assignedTo) — NOT status |
| FR-05 | Change status (separate endpoint, state machine enforced) |
| FR-06 | Add comment (blocked on CLOSED/CANCELLED) |
| FR-07 | Search by keyword + filter by status/assignee + sort |

---

## Non-Functional Requirements

- TypeScript strict mode on both FE and BE
- Layered architecture: Route → Controller → Service → Repository → Model
- All inputs validated at API boundary (express-validator)
- No `any` types except documented exceptions
- Google OAuth + JWT auth (access in memory, refresh in HTTP-only cookie)
- Data persists across server restarts
- 26 integration tests must pass

---

## Constraints

- `.env` never committed
- No secrets in logs
- Semantic HTML + keyboard navigation throughout
- `id` (not `_id`) in all API responses
# Acceptance Criteria

## Core Requirements

- [x] **AC-01** A user can create a ticket via the UI with title, description, priority, and optional assignee
- [x] **AC-02** A user can view all tickets from the database in a paginated list
- [x] **AC-03** A user can open a ticket detail view showing all fields and comments
- [x] **AC-04** A user can update ticket fields (title, description, priority, assignee) via edit form
- [x] **AC-05** A user can add comments to a ticket
- [x] **AC-06** Status changes only through valid transitions; invalid ones are rejected with a 422 and descriptive message
- [x] **AC-07** Keyword search (title + description) and status filter work correctly
- [x] **AC-08** Data remains available after backend server restart (MongoDB persistence)
- [x] **AC-09** Backend validation prevents invalid records (required fields, enum values, field lengths)
- [x] **AC-10** No secrets committed to the repository (.env is git-ignored)
- [x] **AC-11** State-machine integration tests pass (15 valid + invalid transition tests)

## Validation

- [x] Title: required, max 120 chars — returns 422 with field-level error if violated
- [x] Description: required — returns 422 if missing
- [x] Priority: required, must be LOW/MEDIUM/HIGH/CRITICAL — returns 422 for invalid value
- [x] AssignedTo: optional, must be a valid existing user ID — returns 422 if user not found
- [x] Comment message: required, max 2000 chars — returns 422 if empty
- [x] Status transition: must follow state machine — returns 422 with current and target status in error message
- [x] Editing CLOSED/CANCELLED ticket: blocked with 422 — cannot modify terminal-state tickets

## Error Handling

- [x] Network errors show "Unable to reach the server" message
- [x] 404 errors (ticket not found) show friendly message with back link
- [x] 422 validation errors show field-level inline errors on forms
- [x] 422 transition errors show inline error near status control (not swallowed)
- [x] 500 errors show "Something went wrong" without stack trace
- [x] Global ErrorBoundary catches render errors and shows reload option
- [x] All async operations show loading states (skeletons / spinners)
- [x] All lists show empty state when no data

## Testing

- [x] 15 state machine integration tests (IT-SM-01 to IT-SM-15) — all pass
- [x] 11 CRUD/validation integration tests — all pass
- [x] Tests use real HTTP requests via supertest against in-memory MongoDB
- [x] Tests are isolated — no shared state between test cases
- [x] Run with: `npm run test:integration`

## Documentation

- [x] `README.md` with full setup instructions at repo root
- [x] `backend/README.md` with API reference and scripts
- [x] `frontend/README.md` with environment config and scripts
- [x] `database/setup-notes.md` with MongoDB setup options
- [x] All `.env.example` files committed with placeholder values
- [x] Prompt history documented in `ai-prompts/` and `.kiro/steering/prompt-history.md`
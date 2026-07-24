# Kiro Spec — Design

> Design decisions used as persistent context in Kiro sessions.
> For the full document see `design-notes.md` and `technical-architecture.md`.

---

## Architecture

```
React SPA (:3000)
  → Axios (Bearer JWT in header, refresh cookie automatic)
  → Express API (:5000)
      Route → Validator → Auth Middleware → Controller → Service → Repository → Model
  → MongoDB
```

---

## Backend Layer Rules (enforced in code review)

| Layer | Allowed | Not Allowed |
|---|---|---|
| Route | Register endpoints, attach middleware | No logic |
| Controller | Parse req, call service, send res | No business logic |
| Service | All business logic | No req/res, no direct DB |
| Repository | All DB operations | No business logic |
| Model | Schema definition | No business logic |

---

## Frontend Design Decisions

- **React Query** for server state (tickets, comments, users)
- **React Context** for auth state only (user, accessToken)
- **useState** for local UI state (filters, forms)
- **useSearchParams** for filter/pagination state (URL-synced)
- Axios singleton in `src/api/client.ts` — never imported directly in components
- `ALLOWED_TRANSITIONS` imported from `src/utils/ticketTransitions.ts` — same constant as BE

---

## UI Design System

- Font: Inter (Google Fonts)
- Primary: `#2563eb` (blue-600)
- Sidebar: `#0f172a` (slate-900) fixed 240px
- Background: `#f8fafc` (slate-50)
- Cards: `#ffffff` with `shadow-sm`
- Status badges: blue/yellow/green/grey/red (always text label, never colour-only)
- All interactive elements: `<button>` or `<a>` — no `<div onClick>`

---

## Error Handling Contract

**Backend**: All errors → `errorMiddleware` → `{ success: false, message, errors? }`
**Frontend**: 
- Field errors → inline below each input
- API errors → `ErrorMessage` component or toast
- Transition errors → inline below status control (never toast-only)
- Render errors → `ErrorBoundary` → reload button

---

## Auth Flow

```
1. GET /api/auth/google → Google consent
2. Google callback → Passport → find/create user
3. Sign JWT (15m access + 7d refresh)
4. Set refresh in HTTP-only cookie
5. Redirect to /auth/callback?token=<access>
6. FE: store access in React state, clear URL, fetch /api/auth/me
7. Page refresh: POST /api/auth/refresh → new access token (cookie sent automatically)
```

---

## Appendix — Coding Standards Reference

The full coding guidelines are maintained in `../../coding-guidelines.md` (at the doc root). Key rules enforced in every Kiro session:

- TypeScript strict mode always on (`"strict": true`)
- Layered architecture: Route → Controller → Service → Repository → Model
- No `any` types (except documented Mongoose `toJSON` transforms)
- All inputs validated at API boundary before any DB operation
- 2-space indent, single quotes, trailing commas (Prettier enforced)
- Documentation files: kebab-case lowercase (e.g. `requirements.md`, not `REQUIREMENTS.md`)
- Components under 200 lines; business logic in hooks/services
- `<button>` elements always — no `<div onClick>`
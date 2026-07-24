# Code Review Notes

## AI-Assisted Review Summary

After each implementation phase, I asked Kiro to review generated code against the `coding-guidelines.md` and `technical-architecture.md`. Reviews focused on: architecture compliance, type safety, security, error handling, and accessibility.

---

## My Review Observations

### Architecture Compliance
- ✅ All routes delegate directly to controllers — no business logic in routes
- ✅ All business logic in services — controllers only parse request and call service
- ✅ All DB operations in repositories — services never touch Mongoose models directly
- ⚠️ **Finding**: The initial `user.routes.ts` had a direct `UserModel.find()` call without going through a repository — **fixed** by rewriting to use `toJSON()` correctly

### Type Safety
- ✅ No bare `any` types except in the `toJSON` transform where Mongoose's typing doesn't allow it (commented with explanation)
- ✅ All API functions typed with generic response shapes (`ApiResponse<T>`, `PaginatedResponse<T>`)
- ⚠️ **Finding**: `TicketForm` initially used a union type `CreateTicketDto | UpdateTicketDto` for `onSubmit` prop — caused TypeScript errors. **Fixed** by introducing a dedicated `TicketFormPayload` interface
- ⚠️ **Finding**: `ticket.controller.ts` had a duplicate import — **fixed**

### Security
- ✅ All inputs validated via express-validator before any DB operation
- ✅ Refresh token in HTTP-only cookie — never accessible to JS
- ✅ Access token in React state only — never in localStorage
- ✅ `googleId` never returned in API responses (deleted in `toJSON` transform)
- ✅ Passwords: not applicable — Google OAuth used (no password storage)
- ✅ CORS explicitly whitelist origin — no wildcard in production
- ✅ Rate limiting on `/api/auth/*` endpoints
- ⚠️ **Finding**: Initial CORS setup had helmet before CORS — preflight requests could be blocked. **Fixed** by moving CORS before helmet

### Error Handling
- ✅ All errors flow to central `errorMiddleware`
- ✅ CastError (invalid ObjectId) handled → 404
- ✅ Mongoose ValidationError handled → 422
- ✅ No stack traces exposed in production responses
- ✅ Frontend `ErrorBoundary` at route level

### Accessibility
- ✅ All interactive elements use `<button>` or `<a>` — no `<div onClick>`
- ✅ All form fields have associated `<label>` elements via `htmlFor`
- ✅ Badges use text labels — colour is supplementary only
- ✅ Focus rings visible on all focusable elements
- ✅ Status filter buttons use `aria-pressed`
- ✅ Pagination uses `aria-label` on prev/next and `aria-current` on active page

### Code Quality
- ✅ Components under 200 lines
- ✅ Single responsibility per function
- ✅ No magic strings — enums and constants used
- ✅ Barrel exports for `components/ui/` and `hooks/`

---

## Changes Made After Review

| Issue | File | Change |
|---|---|---|
| `user.routes.ts` direct model call | `user.routes.ts` | Rewrote to use `toJSON()` explicitly |
| Duplicate TS import | `ticket.controller.ts` | Removed duplicate `TicketStatus` import |
| Union type on TicketForm | `TicketForm.tsx` | Introduced `TicketFormPayload` interface |
| CORS before helmet | `app.ts` | Moved `cors()` before `helmet()`, added `app.options('*', cors(...))` |
| `lean()` bypasses toJSON | All repositories | Switched to `.exec()` + `serialize(doc.toJSON())` |

---

## Suggestions Rejected (and why)

| Suggestion | Reason Rejected |
|---|---|
| Add Swagger/OpenAPI docs | Out of scope for Core; `api-contract.md` serves this purpose for the assessment |
| Add React.lazy code splitting | Decided against for this scale — bundle size is acceptable at 390KB gzipped |
| Inline edit on ticket detail page | Separate edit page is architecturally cleaner and already complete; inline edit adds complexity without functional value |
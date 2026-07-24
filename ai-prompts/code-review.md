# AI Prompts — Code Review

Prompts used during code review phases.

---

## CR-01 — Phase 2 UI Library Review

**Prompt**: "Review the UI component library against our coding guidelines. Check: TypeScript correctness, accessibility (ARIA, keyboard nav), Tailwind consistency, single responsibility."
**AI Findings**:
- All components use semantic HTML ✅
- Focus rings applied via `focus-visible` ✅
- Badge component: text label always shown — colour supplementary only ✅
- Modal: focus trap implemented, Escape key closes, body scroll locked ✅
**Changes made**: None — all components met guidelines on first review

---

## CR-02 — Backend Architecture Review

**Prompt**: "Review the backend layered architecture against the coding guidelines. Check: Route → Controller → Service → Repository → Model separation, no business logic in wrong layer, all errors flowing to errorMiddleware."
**AI Findings**:
- Controllers correctly only parse request + call service ✅
- Services correctly contain all business logic ✅
- Issue: `user.routes.ts` had a direct `UserModel.find()` call — no repository layer ⚠️
- All errors use `next(err)` → errorMiddleware ✅
**Changes made**: Rewrote `user.routes.ts` to use `toJSON()` explicitly

---

## CR-03 — Security Review

**Prompt**: "Review the application for security issues. Check: token storage, CORS config, credential exposure, input validation."
**AI Findings**:
- Access token in React state only — not localStorage ✅
- Refresh token in HTTP-only cookie ✅
- Issue: CORS registered after helmet — preflight could be blocked ⚠️
- All inputs validated by express-validator before DB operations ✅
- `googleId` deleted in `toJSON` transform — never in API responses ✅
**Changes made**: Moved `cors()` before `helmet()`, added `app.options('*', cors(...))` for explicit preflight handling

---

## CR-04 — Frontend Error Handling Review

**Prompt**: "Review error handling across all frontend pages. Verify: all async operations have loading states, all API errors shown to users, no swallowed errors, form data preserved on errors."
**AI Findings**:
- All pages: loading skeleton → data → error message ✅
- Status transitions: 422 errors shown inline below status control (not toast) ✅
- Forms: data preserved on API error (no form reset) ✅
- Network errors: normalised to user-friendly message ✅
**Changes made**: None — all states were handled correctly

---

## CR-05 — TypeScript Strict Mode Review

**Prompt**: "Run tsc --noEmit and review any TypeScript issues."
**Findings**:
- Duplicate `import type { TicketStatus }` in `ticket.controller.ts` ⚠️
- `TicketForm` union type `CreateTicketDto | UpdateTicketDto` caused parameter incompatibility ⚠️
- `jest.config.ts` had `setupFilesAfterFramework` (invalid key) ⚠️
**Changes made**: Fixed all three TypeScript errors
# Debugging Notes

## Issue 1 — Ticket creation navigates to `/tickets/undefined`

### Problem
After creating a ticket, the frontend navigated to `/tickets/undefined` and immediately called `/api/tickets/undefined` and `/api/tickets/undefined/comments`, returning 404.

### How I Investigated
Checked the `CreateTicketPage` code: `navigate(\`/tickets/${result.data.id}\`)`. The `id` was `undefined`. Checked the API response in the network tab — the response had `_id` (ObjectId) but no `id` string.

### How AI Helped
Kiro identified the root cause immediately: `.lean({ virtuals: true })` in Mongoose repositories bypasses the `toJSON` transform. The `toJSON` transform maps `_id → id`, but `.lean()` returns a plain JS object — only runs virtuals if they are explicitly defined on the schema, and even then the transform function is skipped.

### What I Validated
Confirmed by checking `ticket.repository.ts` — all queries used `.lean({ virtuals: true })`. Confirmed `toJSON` transform was defined on all models but never called for lean results.

### Final Fix
Removed all `.lean()` calls from repositories. Replaced with `.exec()` + `doc.toJSON()` via a `serialize()` helper. This ensures the `toJSON` transform runs on every document before it reaches the controller.

Applied to: `ticket.repository.ts`, `comment.repository.ts`

---

## Issue 2 — Search returns empty results for existing tickets

### Problem
`GET /api/tickets?q=test` returned `{ data: [], total: 0 }` even when tickets with "test" in the title existed.

### How I Investigated
The query used MongoDB's `$text` operator. Checked MongoDB logs — the `$text` query ran but returned nothing. Investigated: MongoDB `$text` requires a text index. The schema defined one, but it was created after the tickets were inserted. MongoDB indexes existing documents asynchronously — tickets inserted before the index was ready are not indexed.

### How AI Helped
Kiro confirmed the diagnosis and suggested switching to case-insensitive regex search (`$regex` with `'i'` flag) which requires no index and supports partial word matches.

### What I Validated
Tested with existing tickets in the database — regex search found them correctly. Also confirmed special characters in search queries are escaped to prevent regex injection.

### Final Fix
Replaced `$text` query with:
```ts
const regex = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
query.$or = [{ title: { $regex: regex } }, { description: { $regex: regex } }];
```
Also removed the text index definition from the schema.

---

## Issue 3 — Empty `?status=` causes 422 Validation Failed

### Problem
Frontend sends `?status=&page=1&limit=20` (empty string) when no status filter selected. Backend returned `422: status must be one of: OPEN, IN_PROGRESS, RESOLVED, CLOSED, CANCELLED`.

### How I Investigated
Traced the request to the `listTicketsSchema` validator. `query('status').optional().isIn(STATUSES)` — `optional()` only skips when the field is absent (`undefined`), not when it's an empty string (`''`).

### How AI Helped
Kiro identified `optional({ checkFalsy: true })` as the correct fix — this treats empty strings, `null`, and `undefined` all as "not provided".

### Final Fix
Changed to `query('status').optional({ nullable: true, checkFalsy: true }).isString()`
Also added `|| undefined` guard in the controller to prevent empty strings reaching the repository.

---

## Issue 4 — Editing CLOSED tickets allowed

### Problem
Users could edit the title, description, and priority of CLOSED and CANCELLED tickets through `PATCH /api/tickets/:id`. The business rule should block edits on terminal-state tickets.

### How I Investigated
Checked `ticket.service.ts` → `updateTicket()` — no check for terminal status before proceeding with the update.

### How AI Helped
Kiro suggested adding the guard at the service layer (correct — business logic belongs in services, not controllers).

### Final Fix
Added to `updateTicket()`:
```ts
if (['CLOSED', 'CANCELLED'].includes(ticket.status)) {
  throw new AppError(422, 'TICKET_IMMUTABLE', 'Cannot edit a ticket that is closed...');
}
```
Frontend: disabled Edit button and added route-level block for `/tickets/:id/edit` on terminal tickets.

---

## Issue 5 — Google OAuth "Invalid Origin" error

### Problem
When setting up Google OAuth, got "Invalid Origin: URIs must not contain a path or end with '/'" when trying to add the callback URL to "Authorized JavaScript origins".

### How I Investigated
Read the error message carefully — the origins field only accepts base domains, not full paths.

### How AI Helped
Kiro clarified the two fields:
- **Authorized JavaScript origins** → base domain only: `http://localhost:3000`
- **Authorized redirect URIs** → full callback path: `http://localhost:5000/api/auth/google/callback`

### Final Fix
Entered the correct values in the correct fields in Google Cloud Console.

---

## Issue 6 — Comments auto-scroll not working

### Problem
After adding a comment, the list didn't scroll to the new comment.

### How I Investigated
The `CommentList` component had no scroll behaviour. After `useAddComment` success, the list re-rendered but focus remained where it was.

### How AI Helped
Kiro suggested using a `useRef` on a bottom anchor element + `useEffect` watching `comments.length`.

### Final Fix
```tsx
const bottomRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  if (comments.length > 0) {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}, [comments.length]);
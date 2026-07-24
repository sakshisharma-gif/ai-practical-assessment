# AI Prompts — Debugging

Prompts used when investigating and fixing bugs.

---

## Bug 1 — `/api/tickets/undefined`

**Prompt**: "On creating tickets one issue coming. On submit after entering details API is called http://localhost:5000/api/tickets/undefined — Resource not found."
**AI Diagnosis**: `.lean({ virtuals: true })` bypasses the Mongoose `toJSON` transform. The `_id → id` mapping in the transform never runs for lean queries. Response has `_id` but no `id`.
**Human Validation**: Checked `ticket.repository.ts` — confirmed all queries used `.lean()`. Confirmed `toJSON` transform was defined but not called.
**Fix Applied**: Removed `.lean()` from all repositories. Used `.exec()` + `doc.toJSON()` via `serialize()` helper.
**Result**: `id` present in all responses ✅

---

## Bug 2 — Search returns empty results

**Prompt**: "Ticket has been created and visible but search is not working. GET /api/tickets?q=test returns empty data array with total 0."
**AI Diagnosis**: MongoDB `$text` operator requires a text index to exist and be built. The index was defined in the schema but may not have been applied to existing documents. Text index creation is asynchronous.
**Human Validation**: Tested with a fresh ticket — search still returned empty. Confirmed the issue was the index, not the query.
**Fix Applied**: Replaced `$text` with case-insensitive regex: `{ $regex: new RegExp(escapedQuery, 'i') }` on title and description via `$or`.
**Result**: Search works immediately with no index dependency ✅

---

## Bug 3 — Empty `status=` param causes 422

**Prompt**: "API is giving error: status must be one of OPEN, IN_PROGRESS... when status is empty string."
**AI Diagnosis**: `optional()` in express-validator only skips `undefined` and `null`. An empty string `''` passes through to `isIn()` validation and fails.
**Human Validation**: Traced request to `listTicketsSchema` — confirmed `.optional()` without `checkFalsy: true`.
**Fix Applied**: Changed to `optional({ checkFalsy: true })` + `|| undefined` guard in controller.
**Result**: `?status=` treated as no filter applied ✅

---

## Bug 4 — CLOSED tickets editable

**Prompt**: "I am able to edit ticket even after its status is marked as closed, ideally this is not valid functionality."
**AI Diagnosis**: `updateTicket()` service had no check for terminal status. Any `PATCH /api/tickets/:id` request was processed regardless of current status.
**Human Validation**: Checked `ticket.service.ts` → confirmed no terminal-state guard.
**Fix Applied**: Added `IMMUTABLE_STATUSES` check in service. Frontend: disabled Edit button, added route-level blocked state page.
**Result**: CLOSED/CANCELLED tickets cannot be edited ✅

---

## Bug 5 — Google OAuth Invalid Origin error

**Prompt**: "Getting error while setting authorized Redirect URI — Invalid Origin: URIs must not contain a path or end with '/'."
**AI Diagnosis**: The callback URL was being entered in the wrong field. "Authorized JavaScript origins" only accepts base domains. "Authorized redirect URIs" accepts full paths.
**Human Validation**: Checked the Google Cloud Console form — confirmed the URL was in the wrong section.
**Fix Applied**: Moved URL to correct field. Set origins to `http://localhost:3000`, redirect URI to `http://localhost:5000/api/auth/google/callback`.
**Result**: OAuth configuration valid ✅

---

## Bug 6 — Comments don't auto-scroll

**Prompt**: "Comments auto-scroll not working after adding a new comment."
**AI Diagnosis**: `CommentList` had no scroll behaviour. After mutation success and React re-render, viewport position was unchanged.
**Fix Applied**: Added `useRef` on bottom anchor + `useEffect` watching `comments.length` to call `scrollIntoView({ behavior: 'smooth' })`.
**Result**: New comments scroll into view after posting ✅
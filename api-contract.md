# API Contract

Base URL: `http://localhost:5000/api`

All responses use the envelope: `{ success: boolean, data: T, message: string }`
All protected endpoints require: `Authorization: Bearer <accessToken>`

---

## Auth

### POST /auth/logout
**Purpose**: Clear refresh token cookie and end session
**Auth**: Required
**Response 200**: `{ success: true, data: null, message: "Logged out successfully" }`

### POST /auth/refresh
**Purpose**: Issue new access token from HTTP-only refresh cookie
**Auth**: Cookie only (no Bearer token needed)
**Response 200**: `{ success: true, data: { accessToken: string }, message: "Token refreshed" }`
**Response 401**: `{ success: false, message: "No refresh token" }`

### GET /auth/me
**Purpose**: Get current authenticated user
**Auth**: Required
**Response 200**: `{ success: true, data: { id, name, email, role, avatar }, message: "..." }`

---

## Tickets

### GET /tickets
**Purpose**: List tickets with search, filters, sort, pagination
**Auth**: Required
**Query Params**:
| Param | Type | Description |
|---|---|---|
| `q` | string | Keyword search (title + description, case-insensitive) |
| `status` | string | Single or comma-separated: `OPEN,IN_PROGRESS` |
| `assignedTo` | MongoId | Filter by assignee user ID |
| `sortBy` | `createdAt\|priority` | Sort field (default: createdAt) |
| `order` | `asc\|desc` | Sort direction (default: desc) |
| `page` | integer | Page number (default: 1) |
| `limit` | integer 1–100 | Items per page (default: 20) |

**Response 200**:
```json
{
  "success": true,
  "data": [{ "id": "...", "ticketId": "TKT-00001", "title": "...", "status": "OPEN", ... }],
  "pagination": { "total": 45, "page": 1, "limit": 20, "totalPages": 3 },
  "message": "Tickets fetched successfully"
}
```

---

### POST /tickets
**Purpose**: Create a new ticket (status auto-set to OPEN)
**Auth**: Required
**Request Body**:
```json
{ "title": "string (required, max 120)", "description": "string (required)", "priority": "LOW|MEDIUM|HIGH|CRITICAL (required)", "category": "Bug|Feature|Support|Other (optional)", "assignedTo": "MongoId (optional)" }
```
**Response 201**: `{ "success": true, "data": { ticket }, "message": "Ticket created successfully" }`
**Response 422**: `{ "success": false, "message": "Validation failed", "errors": [{ "field": "title", "message": "Title is required" }] }`

---

### GET /tickets/:id
**Purpose**: Get full ticket detail
**Auth**: Required
**Response 200**: `{ "success": true, "data": { ticket with populated createdBy + assignedTo } }`
**Response 404**: `{ "success": false, "message": "Ticket not found" }`

---

### PATCH /tickets/:id
**Purpose**: Update editable fields (title, description, priority, category, assignedTo). Status NOT updateable here.
**Auth**: Required
**Request Body** (all optional): `{ title?, description?, priority?, category?, assignedTo? }`
**Response 200**: `{ "success": true, "data": { updatedTicket } }`
**Response 422**: `{ "success": false, "message": "Cannot edit a ticket that is closed..." }` — for terminal-state tickets

---

### PATCH /tickets/:id/status
**Purpose**: Transition ticket status through the state machine
**Auth**: Required
**Request Body**: `{ "status": "IN_PROGRESS|RESOLVED|CLOSED|CANCELLED" }`
**Response 200**: `{ "success": true, "data": { updatedTicket }, "message": "Ticket status updated successfully" }`
**Response 422**: `{ "success": false, "message": "Cannot transition ticket from OPEN to CLOSED. Allowed transitions from OPEN are: IN_PROGRESS, CANCELLED." }`

---

### DELETE /tickets/:id
**Purpose**: Delete ticket (admin only)
**Auth**: Required (admin role)
**Response 200**: `{ "success": true, "data": { deletedTicket } }`
**Response 403**: `{ "success": false, "message": "Forbidden" }`

---

## Comments

### GET /tickets/:id/comments
**Purpose**: Get all comments for a ticket, ordered oldest first
**Auth**: Required
**Response 200**: `{ "success": true, "data": [{ id, message, createdBy: { name, email }, createdAt }] }`

---

### POST /tickets/:id/comments
**Purpose**: Add a comment to a ticket
**Auth**: Required
**Request Body**: `{ "message": "string (required, max 2000)" }`
**Response 201**: `{ "success": true, "data": { comment }, "message": "Comment added successfully" }`
**Response 422**: `{ "success": false, "message": "Cannot comment on a closed or cancelled ticket" }`

---

## Users

### GET /users
**Purpose**: List all users (for assignee dropdown)
**Auth**: Required
**Response 200**: `{ "success": true, "data": [{ id, name, email, role, avatar }] }`

---

## Standard Error Responses

| Code | When |
|---|---|
| 400 | Bad Request — malformed syntax |
| 401 | Unauthorised — missing or invalid token |
| 403 | Forbidden — insufficient role |
| 404 | Not Found — resource doesn't exist or invalid ObjectId |
| 422 | Validation failed or invalid state transition |
| 429 | Rate limit exceeded (auth endpoints) |
| 500 | Internal server error — generic message only |
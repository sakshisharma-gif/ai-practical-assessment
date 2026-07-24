# TicketDesk — Support Ticket Management System

A modern, full-stack internal application for managing support tickets with enhanced UI/UX design. Internal users can create, update, comment on, search, and progress tickets through a defined lifecycle.

Built as part of the JS AI Capability Exercise using **Kiro** (AI-powered IDE) with comprehensive UI enhancements and modern design patterns.

## 🤖 AI-Assisted Development Journey

This project demonstrates a complete AI-assisted development workflow including iterative refinements, debugging scenarios, and comprehensive testing strategies. See detailed sections below for the full development narrative.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Redux Toolkit + Modern CSS |
| Backend | Node.js + Express + JavaScript |
| Database | MongoDB Atlas + Mongoose |
| Auth | Demo Authentication (Any credentials accepted) |
| Testing | Jest + Supertest + Custom Test Utilities |
| UI/UX | Modern Gradient Design + CSS Animations + Responsive Layout |

---

## Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas account (using cloud database)
- Internet connection for MongoDB Atlas access

---

## Quick Start

### 1. Clone the repository
```bash
git clone <repo-url>
cd ai-practical
```

### 2. Backend setup
```bash
cd src/backend
npm install
npm start     # starts API on http://localhost:3000
```

The backend is pre-configured with MongoDB Atlas credentials and will connect automatically.

### 3. Frontend setup (in a new terminal)
```bash
cd src/frontend
npm install
npm run dev   # starts on http://localhost:3001
```

### 4. Open the app
Navigate to `http://localhost:3001` and use any credentials to login (demo authentication enabled).

**Demo Login**: Use any username and password - the system accepts all credentials for testing purposes.

---

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project → APIs & Services → Credentials → Create OAuth 2.0 Client ID
3. Application type: **Web application**
4. Authorized JavaScript origins: `http://localhost:3000`
5. Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Secret to `backend/.env`

---

## Running Tests

```bash
cd src/backend
npm run test:integration   # runs all 26 integration tests
```

---

## Project Structure

```
ticket-management-system/
├── README.md
├── candidate-info.md
├── tool-workflow.md
├── requirements-analysis.md
├── acceptance-criteria.md
├── implementation-plan.md
├── design-notes.md
├── api-contract.md
├── data-model.md
├── ui-flow.md
├── test-strategy.md
├── test-results.md
├── debugging-notes.md
├── code-review-notes.md
├── review-fixes.md
├── pr-description.md
├── reflection.md
├── final-ai-usage-summary.md
├── database/
│   ├── schema-or-migrations.md
│   ├── seed-data.md
│   └── setup-notes.md
├── ai-prompts/
│   ├── planning.md
│   ├── design.md
│   ├── implementation.md
│   ├── testing.md
│   ├── debugging.md
│   ├── code-review.md
│   └── documentation.md
├── tool-specific/
│   └── kiro-specs/
│       ├── requirements.md
│       ├── design.md
│       └── tasks.md
├── backend/          ← Express API
└── frontend/         ← React SPA
```

---

## Features

- ✅ Create, view, update, and list tickets
- ✅ Status state machine (OPEN → IN_PROGRESS → RESOLVED → CLOSED, OPEN/IN_PROGRESS → CANCELLED)
- ✅ Add comments (blocked on CLOSED/CANCELLED tickets)
- ✅ Keyword search + filter by status + filter by assignee + sort
- ✅ Google OAuth authentication + JWT sessions
- ✅ Role-based access (admin / agent / user)
- ✅ 26 integration tests (15 state machine + 11 CRUD)
- ✅ Data persists across server restarts

## Seed Users

After running `npm run seed` the following users are available:

| Email | Role |
|---|---|
| admin@ticketdesk.io | admin |
| agent1@ticketdesk.io | agent |
| agent2@ticketdesk.io | agent |
| user1@ticketdesk.io | user |
| user2@ticketdesk.io | user |

> Note: Seed users have synthetic Google IDs. Real users are created on first Google login.
# APIOS — Member 4 Frontend

Frontend implementation for:

**Automated Prospect Intelligence & Outreach System**

This project covers Member 4 responsibilities:
- Campaign creation UI
- Lead management UI
- Reply & reputation UI
- Follow-up queue
- Analytics/dashboard
- Sender performance
- Responsive navigation
- Mock/demo data so the UI runs without Members 1–3 backend services

## 1. Requirements

Install:
- Node.js 18+ (Node 20+ recommended)
- npm 9+

No PostgreSQL, Supabase, n8n or Claude installation is required to run the frontend demo.

## 2. Run

```bash
npm install
npm run dev
```

Open the URL printed by Vite, normally:

```text
http://localhost:5173
```

## 3. Production build

```bash
npm run build
npm run preview
```

## 4. Project structure

```text
apios-member4-frontend/
├── index.html
├── package.json
├── .env.example
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    └── styles.css
```

## 5. Current mode

The app uses local mock data inside `App.jsx`. Therefore:
- Dashboard works
- Campaign creation works in the UI
- Campaign activation/pause works
- Lead search/filter/status updates work
- Reply filtering/handling works
- Follow-up queue works
- Analytics works

These changes are frontend state only and reset when the browser refreshes.

## 6. Backend integration later

Member 1 should provide API endpoints for:
- campaigns
- leads
- messages
- reputation_events
- analytics

Then replace the local state with API calls.

Suggested API shape:

GET `/api/campaigns`
POST `/api/campaigns`
PATCH `/api/campaigns/:id`

GET `/api/leads`
PATCH `/api/leads/:id`

GET `/api/replies`
PATCH `/api/replies/:id/handled`

GET `/api/followups`

GET `/api/analytics/overview`
GET `/api/analytics/events`

The frontend should never receive raw SMTP passwords or API secrets.

## 7. n8n integration later

Member 3 can trigger/produce backend events. The frontend should normally read those events through Member 1's backend rather than connecting directly to the database.

Recommended flow:

Frontend → Member 1 API → PostgreSQL/Supabase

n8n → Member 1 API/webhooks → PostgreSQL/Supabase

Claude agents → n8n → Member 1 API

This keeps secrets and service credentials away from the browser.

## 8. Important security rule

Never put:
- SMTP passwords
- Claude API keys
- n8n private credentials
- Supabase service-role keys

inside frontend source code or `VITE_*` variables.

Only public client configuration should be exposed to the browser.

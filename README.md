# NexOps - Incident Correlation Engine

A modern, enterprise-grade frontend focused on answering exactly one critical question better than anything else: **"What caused this incident, and how do we know?"**

NexOps reads deployments, alerts, and dependency graphs from connected systems, correlating operational events to find root causes and map dependency blast radius.

---

## Technical Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + OKLch Design Tokens
- **Components**: shadcn/ui + Radix UI primitives
- **Data Table**: @tanstack/react-table
- **Charts**: Recharts
- **Topology Graphing**: React Flow (v11)
- **Icons**: Lucide React
- **Themes**: next-themes (default dark mode)

---

## Getting Started

### Installation

```bash
# Clone the project and navigate to the directory
cd updated-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```Visit `http://localhost:3000` to launch the landing page. Sign in to authenticate using Firebase and set up your workspace.

> [!NOTE]
> **Authentication is production-grade and backed by Firebase Auth.** A local running FastAPI backend server must be active on `http://localhost:8000` to verify tokens, perform GitHub OAuth sync, and load live telemetry databases.

---

## Project Structure

The project has been streamlined from the old 18-route platform down to **7 active correlation routes**, removing out-of-scope modules like raw log ingestion, custom paging, and automations. It adds a pre-app shell, onboarding sequence, and personal profile space:

```
updated-frontend/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── globals.css             # OKLch design tokens & theme variables
│   ├── page.tsx                # Cinematic scrollytelling landing page
│   ├── login/                  # Mock SSO login interface (GitHub / Google)
│   ├── onboarding/             # Connect GitHub/PagerDuty step & auto-derived graph preview
│   ├── profile/                # Personal staff workspace, owned services, triage logs
│   ├── dashboard/              # Correlation Command Center
│   ├── services/               # Microservice Catalog (read-only derived views)
│   ├── dependencies/           # Interactive React Flow topology graphs
│   ├── incidents/              # Operational incident tracking log
│   │   ├── page.tsx            # Incident table & tabs
│   │   └── [id]/               # Dedicated incident investigation workspace
│   ├── recent-changes/         # Deployment change feed & blast radius metrics
│   ├── settings/               # System configuration tabbed parameters (Preferences, Notifications, Workspace, Account)
│   ├── not-found.tsx           # Custom 404 page in NexOps design language
│   └── error.tsx               # Graceful system crash boundary
│
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── dashboard/              # Active incidents, recent changes, topology components
│   ├── top-nav.tsx             # Fixed header navigation with wired profile dropdown actions
│   ├── sidebar.tsx             # Restructured 7-route navigation sidebar
│   ├── layout.tsx              # Reusable layout components (PageLayout, Grid, MetricCard, EmptyState)
│   ├── command-palette.tsx     # Global CMD+K shortcut re-indexed to active routes
│   └── app-shell.tsx           # App shell wrapper that excludes pre-app paths from navigation sidebar/header
│
├── docs/
│   ├── DASHBOARD.md            # Detailed dashboard & correlation widgets guide
│   ├── DESIGN_SYSTEM.md        # OKLch tokens and patterns
│   └── README.md               # Master developer documentation
│
├── lib/
│   ├── graph.ts                # Single source of truth for the service dependency graph
│   ├── mock-data.ts            # Incidents, changes, and blastRadius datasets referencing graph.ts
│   └── utils.ts                # Tailwind merge helper
```

---

## Navigation & Page Access

### Pre-App / Identity Shell
- **Landing Page** (`/`): Displays a scrollytelling simulation of the correlation engine's pipeline (backward correlation matches and forward blast radius risks) followed by CTA targets.
- **SSO Login** (`/login`): Clean developer access interface supporting mock SSO connections.
- **Onboarding** (`/onboarding`): Simulated 3-step setup connecting integrations to build the derived microservice dependency tree.
- **User Profile** (`/profile`): Displays engineering credentials, owned services (auto-derived), and a real-time record of all causal triage actions taken by the user.

### 7 Core Platform Routes
- **Dashboard** (`/dashboard`): Active incidents, ranked causal candidates, deployment risk, and dependency topology at a glance.
- **Services** (`/services`): Microservices metadata, team ownership, and uptime statuses.
- **Dependencies** (`/dependencies`): Interactive node-edge graph mapping service interactions.
- **Incidents** (`/incidents`): Logs of active and resolved incidents. Clicking any incident card in the list routes the engineer directly to its individual investigation workspace (`/incidents/[id]`).
- **Recent Changes** (`/recent-changes`): Deploys and configuration changes showing risk scores and downstream blast radius.
- **Settings** (`/settings`): Consolidated preferences, notification controls, workspace integration settings, and mock logout button.

---
## Core Correlation Features

1.  **Causal Candidate Identification**: Displays ranked suspect deployments under active incidents with explicit natural language reasoning (never bare score percentages).
2.  **Blast Radius Mapping**: Surfaces direct and downstream services affected by a deployment directly on change cards.
3.  **Human Feedback Loop**: Session-persisted confirm/reject buttons on candidates let engineers train correlation algorithms by marking causes as validated or ruled out.
4.  **Alert Noise Indicators**: Highlights alert rules that rarely correlate with real incidents with a badge (e.g. `"3 noisy rules"`), helping engineers separate signal from noise.

---

## Development

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Type Checking
```bash
npx tsc --noEmit
```

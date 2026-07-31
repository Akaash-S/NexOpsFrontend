# NexOps — Next.js Frontend Dashboard

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,css,html,firebase,vercel,git,github" alt="Frontend Tech Stack Icons" />
  </a>
</p>

A modern, high-performance, enterprise-grade frontend focused on answering exactly one critical question better than anything else: **"What caused this incident, and how do we know?"**

NexOps correlates deployments, alerts, and dependency graphs from connected systems, mapping blast radius and determining root causes with real-time operational telemetry.

---

## 🛠️ Tech Stack & Badges

| Technology | Purpose | Icon Badge |
| :--- | :--- | :--- |
| **Next.js 16** | App Router Framework & SSR | <img src="https://skillicons.dev/icons?i=nextjs" width="36" height="36" alt="Next.js" /> |
| **React 19** | UI Library & Hooks | <img src="https://skillicons.dev/icons?i=react" width="36" height="36" alt="React" /> |
| **TypeScript** | Type-safe Application Logic | <img src="https://skillicons.dev/icons?i=ts" width="36" height="36" alt="TypeScript" /> |
| **Tailwind CSS** | Styling & OKLch Design Tokens | <img src="https://skillicons.dev/icons?i=tailwind" width="36" height="36" alt="Tailwind CSS" /> |
| **HTML5 & CSS3** | Semantic Structure & Animations | <img src="https://skillicons.dev/icons?i=html,css" height="36" alt="HTML5 & CSS3" /> |
| **Firebase Auth** | Developer & User Authentication | <img src="https://skillicons.dev/icons?i=firebase" width="36" height="36" alt="Firebase" /> |
| **Vercel** | Edge Deployment & Hosting | <img src="https://skillicons.dev/icons?i=vercel" width="36" height="36" alt="Vercel" /> |
| **Git & GitHub** | Source Control & CI/CD Integrations | <img src="https://skillicons.dev/icons?i=git,github" height="36" alt="Git & GitHub" /> |

---

## 🚀 Getting Started

### Installation & Local Setup

```bash
# Navigate to the frontend directory
cd updated-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) to view the application.

> [!NOTE]
> **Production-Grade Authentication:** Backed by Firebase Auth. Ensure your backend server is running on `http://localhost:8000` to verify tokens, perform GitHub OAuth sync, and stream live incident telemetry.

---

## 📁 Project Structure

The platform features **7 core correlation routes** alongside a scrollytelling landing page, onboarding sequence, and staff workspace:

```
updated-frontend/
├── app/
│   ├── layout.tsx              # Root layout with providers & theme injection
│   ├── globals.css             # OKLch design tokens & theme CSS variables
│   ├── page.tsx                # Cinematic scrollytelling landing page
│   ├── login/                  # Developer SSO login interface (GitHub / Google / Email)
│   ├── onboarding/             # Step-by-step GitHub/PagerDuty setup & live dependency preview
│   ├── profile/                # Personal engineer workspace & triage history
│   ├── dashboard/              # Correlation Command Center & candidate cause ranking
│   ├── services/               # Microservices Catalog & Derived Health metrics
│   ├── dependencies/           # Interactive React Flow topology graphs
│   ├── incidents/              # Operational incident tracking log
│   │   ├── page.tsx            # Incident table & filter tabs
│   │   └── [id]/               # Dedicated incident investigation workspace
│   ├── recent-changes/         # Deployment change feed, blast radius & metadata grid
│   └── settings/               # System & Workspace configuration tabs
├── components/
│   ├── ui/                     # shadcn/ui primitives (Cards, Badges, Buttons, Inputs)
│   ├── dashboard/              # Active incidents, recent changes & topology components
│   ├── top-nav.tsx             # Header navigation with profile & workspace state
│   ├── sidebar.tsx             # Gated 7-route platform navigation sidebar
│   ├── layout.tsx              # PageLayout, Grid, MetricCard, and EmptyState wrappers
│   └── score-with-reasoning.tsx# Blast radius & risk score reasoning pills
└── lib/
    ├── api-client.ts           # Unified API fetch client with token handling
    ├── graph.ts                # Service dependency graph engine
    └── utils.ts                # Tailwind class merge helper
```

---

## 🔒 Feature Flag & Option C Navigation Gating

To maintain NexOps' narrow product focus as a lightweight Causal Correlation Engine ("What caused this incident, and how do we know?"), extended enterprise capabilities are gated per-tenant via the `show_extended_navigation` workspace feature flag (default: `False`).

### Core Correlation Scope (Always Active):
- **Dashboard** (`/dashboard`): Correlation Command Center & candidate cause ranking
- **Services Catalog** (`/services`): Microservices Catalog & derived health metrics
- **Incident Investigation** (`/incidents`): Operational incident list & triage workspace
- **Recent Changes** (`/recent-changes`): Deployment feed, blast radius & risk scores
- **Settings** (`/settings`): Workspace configuration & feature flag toggles

### Extended Navigation Features (Gated behind `show_extended_navigation = True`):
1. **Automation Rules** (`/automation`): Event triggers, action runners & rule engine
2. **Cluster Operations** (`/clusters`): Infrastructure cluster management
3. **CI/CD Pipelines** (`/cicd`): Build pipeline telemetry
4. **Topology Map** (`/dependencies` or `/graph`): Extended dependency graph visualization
5. **Analytics Dashboard** (`/analytics`): Velocity stats & deployment outcome charts
6. **Activity Stream** (`/activity`): Ingested webhook audit log & event telemetry
7. **Postmortem Triage** (`/incidents/[id]/postmortem`): Detailed postmortem editor & publisher


---

## 🌟 Core Features

1. **Ranked Causal Candidates**: Pinpoints suspect deployments under active incidents with natural language risk reasoning.
2. **Interactive Topology Mapping**: Uses React Flow to map direct and downstream service dependencies.
3. **Deployment Blast Radius**: Displays risk scores, direct impacts, and downstream services on change cards.
4. **Expandable Metadata Drawer**: Inspect commit SHAs, environments, deployment statuses, and deployers with zero layout overlap.
5. **Alert Noise Filtering**: Detects un-correlated alert rules and badges them (`"3 noisy rules"`) to eliminate pager fatigue.

---

## 🛠️ Scripts & Commands

```bash
# Run development server
npm run dev

# Type checking
npx tsc --noEmit

# Build production bundle
npm run build

# Start production server
npm start
```

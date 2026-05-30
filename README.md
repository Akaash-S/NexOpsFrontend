# NexOps - Engineering Intelligence Platform

A modern, enterprise-grade frontend for understanding what changed, what is impacted, what is unhealthy, why failures occurred, and what actions should be taken next.

## Overview

NexOps is an **Engineering Intelligence Platform** designed for engineering organizations to gain deep insights into their systems, services, and deployments. The UI combines the best patterns from Linear, Vercel Dashboard, Datadog, and modern cloud control panels while maintaining its own distinct identity.

**Phase 1** provides a complete, production-ready application shell with:
- Full navigation system with 7 organized sections
- 18 routes covering all major features
- Professional design system with enterprise aesthetics
- Responsive layout for desktop and mobile
- Dark mode by default with light mode support
- Reusable layout and data display components
- Loading states and skeleton loaders

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Design Tokens (OKLch)
- **Components**: shadcn/ui
- **Data Table**: @tanstack/react-table
- **Icons**: Lucide React
- **Themes**: next-themes
- **Node**: v18+

## Getting Started

### Installation

```bash
# Clone or set up the project
cd nexops

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit `http://localhost:3000` - you'll be redirected to `/dashboard`.

## Project Structure

```
nexops/
├── app/
│   ├── layout.tsx              # Root layout with ThemeProvider
│   ├── globals.css             # Design tokens and theme variables
│   ├── page.tsx                # Home redirect
│   ├── dashboard/              # Dashboard page
│   ├── clusters/               # Clusters overview
│   ├── services/               # Services management
│   ├── repositories/           # Repository visibility
│   ├── dependencies/           # Dependency graph
│   ├── pipelines/              # Pipeline management
│   ├── deployments/            # Deployment tracking
│   ├── releases/               # Release management
│   ├── alerts/                 # Alert management
│   ├── incidents/              # Incident tracking
│   ├── health/                 # Health center
│   ├── change-impact/          # Change impact analysis
│   ├── risk-analysis/          # Risk analysis
│   ├── recommendations/        # Recommendations
│   ├── rules/                  # Automation rules
│   ├── workflows/              # Automation workflows
│   ├── teams/                  # Team management
│   ├── integrations/           # Integration management
│   └── settings/               # Application settings
│
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── top-nav.tsx             # Fixed header navigation
│   ├── sidebar.tsx             # Side navigation with sections
│   ├── layout.tsx              # Page layout components
│   ├── data-table.tsx          # Data table with sorting/filtering
│   ├── intelligence-drawer.tsx # Right-side drawer panel
│   ├── investigation-workspace.tsx # Two-panel analysis layout
│   ├── command-palette.tsx     # Cmd+K command palette
│   ├── notification-center.tsx # Notification panel
│   ├── loading-state.tsx       # Skeleton loaders
│   └── app-shell.tsx           # App shell wrapper
│
├── docs/
│   ├── DESIGN_SYSTEM.md        # Design tokens and patterns
│   └── PHASE_1_COMPLETE.md     # Phase 1 completion details
│
├── lib/
│   └── utils.ts                # Utility functions (cn for classnames)
│
├── hooks/
│   ├── use-mobile.ts           # Mobile detection hook
│   └── use-toast.ts            # Toast notifications
│
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
└── README.md (this file)
```

## Navigation Structure

### Overview
- **Dashboard** - Engineering command center showing what needs attention

### Engineering
- **Clusters** - Domain-level operational view
- **Services** - Primary operational entities
- **Repositories** - Source control visibility
- **Dependencies** - Relationship and dependency graph

### Delivery
- **Pipelines** - Delivery pipeline status and insights
- **Deployments** - Release intelligence and risk analysis
- **Releases** - Release management and versioning

### Operations
- **Alerts** - Operational signals and alerting
- **Incidents** - Incident investigation and management
- **Health Center** - System health and SLO/SLA tracking

### Intelligence
- **Change Impact** - What changed and what was affected
- **Risk Analysis** - Predictive risk intelligence
- **Recommendations** - Decision support system

### Automation
- **Rules** - Automation rules and policies
- **Workflows** - Complex workflow orchestration

### Administration
- **Teams** - Team management and permissions
- **Integrations** - External service integrations
- **Settings** - Application preferences and configuration

## Design System

### Colors
NexOps uses a professional slate-based color palette optimized for data-dense interfaces:

**Light Mode**
- Primary: Blue (`oklch(0.44 0.12 262)`)
- Background: Off-white (`oklch(0.98 0 0)`)
- Foreground: Dark slate (`oklch(0.15 0 0)`)

**Dark Mode (Default)**
- Primary: Bright blue (`oklch(0.64 0.15 262)`)
- Background: Deep slate (`oklch(0.12 0 0)`)
- Foreground: Off-white (`oklch(0.92 0 0)`)

**Status Colors**
- Success: Green - Healthy systems
- Warning: Amber - Warning conditions
- Destructive: Red - Errors and critical issues
- Accent: Blue - Information

See `docs/DESIGN_SYSTEM.md` for complete design specification.

### Typography
- **Sans (Body)**: Geist
- **Mono (Code)**: Geist Mono
- **Scale**: Semantic hierarchy (page title, section header, body, small)

### Spacing
- **Base Unit**: 4px (Tailwind standard)
- **Section Padding**: 24px (p-6) / 32px (p-8)
- **Gap System**: 16px (gap-4) / 24px (gap-6)

### Layout
- **Desktop**: 256px sidebar + full-width content
- **Mobile**: Full-width with collapsible sidebar overlay
- **Drawers**: 420px desktop, full-width mobile
- **Two-panel**: 70% main content, 30% intelligence panel

## Key Components

### Layout Components
- `PageContainer` - Full-width wrapper
- `PageLayout` - Sidebar-aware layout
- `PageHeader` - Page title and actions
- `Section` - Content section with padding
- `Grid` - Responsive grid (1-4 columns)

### Data Components
- `MetricCard` - KPI display with trend
- `StatusBadge` - Health indicator
- `DataTable` - Sortable, filterable table
- `EmptyState` - Empty state UI

### State Components
- `CardSkeleton` - Card loading skeleton
- `TableSkeleton` - Table loading skeleton
- `GridSkeleton` - Grid loading skeleton

### Interaction Components
- `IntelligenceDrawer` - Right-side information panel
- `InvestigationWorkspace` - Deep analysis layout
- `CommandPalette` - Cmd+K command search
- `NotificationCenter` - Notification panel

## Features

### ✅ Complete
- Responsive design (mobile-first)
- Dark mode by default
- Navigation with all 18 routes
- Design system with tokens
- Layout components
- Data table component
- Loading states
- Accessibility foundations

### 🚀 Ready for Phase 2
- Dashboard page (fill with real components)
- Data pages (tables and lists)
- Intelligence features (graphs, analysis)
- Interactive workflows (modals, drawers)
- Real data integration

## Responsive Breakpoints

- **Mobile**: Default styles (< 768px)
- **Tablet** (md): 768px and up
- **Desktop** (lg): 1024px and up

## Accessibility

✅ Semantic HTML
✅ ARIA labels
✅ Keyboard navigation
✅ Focus indicators
✅ Color contrast (WCAG AA)
✅ Screen reader support

## Development

### Run Development Server
```bash
pnpm dev
```

### Build for Production
```bash
pnpm build
pnpm start
```

### Type Checking
```bash
pnpm type-check
```

### Linting
```bash
pnpm lint
```

## Next Steps (Phase 2)

Phase 2 will focus on building out the core features:

1. **Dashboard Page** - Real components:
   - Engineering Health Panel
   - Active Incidents
   - Critical Changes
   - Recommended Actions

2. **Data Pages** - Complete implementations:
   - Cluster management
   - Service overview
   - Pipeline status
   - Deployment tracking

3. **Intelligence Features**:
   - Dependency graphs
   - Change impact timeline
   - Risk scoring
   - Recommendations engine

4. **Interactive Workflows**:
   - Investigation workspaces
   - Incident investigation
   - Change approval flows
   - Risk remediation

## Specification

This project implements the NexOps Engineering Intelligence Platform specification with:

✅ Enterprise SaaS aesthetic
✅ Professional design language
✅ Fast navigation and discoverability
✅ Flexible workflows for different teams
✅ Clear visual hierarchy
✅ Accessibility-first interactions
✅ Intelligent guidance and recommendations
✅ Consistent interaction patterns

See the specification PDF for complete requirements.

## Performance

- **Next.js 16**: Latest features and optimizations
- **Server Components**: Reduced JavaScript bundle
- **Streaming**: Progressive content loading
- **Suspense**: Built-in loading states
- **Responsive Images**: Optimized with Next.js Image
- **Code Splitting**: Automatic route splitting

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

When adding new features:

1. Follow the component structure in `components/`
2. Use design tokens from `app/globals.css`
3. Maintain responsive design practices
4. Add proper ARIA labels for accessibility
5. Create placeholder pages before building features

## License

MIT

---

**Built with ❤️ using Next.js, React, and Tailwind CSS**

For questions or feedback, refer to the specification document or PHASE_1_COMPLETE.md for implementation details.

# NexOps Quick Start Guide

## What's Built (Phase 1)

✅ Complete application shell with professional enterprise design
✅ Navigation system with all 18 routes
✅ Responsive design (desktop & mobile)
✅ Dark mode by default
✅ Design system with tokens and components
✅ Reusable layout and data display components

## Getting Started

### 1. View the Application

The application is already running. Just visit it in your browser. You'll see:

- **Sidebar Navigation**: All 7 sections with organized menu items
- **Top Navigation**: Search, notifications, workspace switcher, user menu
- **Dashboard**: Hero section with key metrics
- **Fully Responsive**: Works on desktop, tablet, and mobile

### 2. Understanding the Structure

**Main Sections:**
- **Overview**: Dashboard (command center)
- **Engineering**: Clusters, Services, Repositories, Dependencies
- **Delivery**: Pipelines, Deployments, Releases
- **Operations**: Alerts, Incidents, Health Center
- **Intelligence**: Change Impact, Risk Analysis, Recommendations
- **Automation**: Rules, Workflows
- **Administration**: Teams, Integrations, Settings

Each section has a placeholder page ready for feature development.

### 3. Making Changes

#### Modify Navigation
Edit `components/sidebar.tsx` to add/remove menu items.

#### Update Colors & Design
All colors are in `app/globals.css` using CSS custom properties.
Theme colors automatically apply to both light and dark modes.

#### Add a New Layout Component
Create in `components/layout.tsx` or a new file in `components/`.

#### Create a New Page
1. Create a new folder: `app/[route-name]/`
2. Create `page.tsx` with:
```tsx
import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'

export const metadata = {
  title: 'Page Name | NexOps',
  description: 'Page description',
}

export default function PageName() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader title="Page Name" description="Description" />
          {/* Your content here */}
        </Section>
      </PageLayout>
    </>
  )
}
```

### 4. Components Overview

#### Layout Components (use in all pages)
```tsx
import { 
  PageLayout,      // Main layout wrapper
  Section,         // Content section with padding
  PageHeader,      // Title, description, actions
  Grid,            // Responsive grid (1-4 columns)
  MetricCard,      // KPI display
  StatusBadge,     // Health indicator
  EmptyState       // Empty state UI
} from '@/components/layout'
```

#### Data Display
```tsx
import { DataTable } from '@/components/data-table'
// Use with @tanstack/react-table columns

import { IntelligenceDrawer } from '@/components/intelligence-drawer'
// Right-side drawer (420px desktop, full mobile)

import { InvestigationWorkspace } from '@/components/investigation-workspace'
// Two-panel layout for analysis (70% main, 30% intelligence)
```

#### Loading States
```tsx
import { 
  CardSkeleton,     // Card skeleton loader
  TableSkeleton,    // Table skeleton loader
  GridSkeleton,     // Grid skeleton loader
} from '@/components/loading-state'
```

#### Interaction
```tsx
import { CommandPalette } from '@/components/command-palette'
// Cmd+K command palette

import { NotificationCenter } from '@/components/notification-center'
// Notification panel
```

### 5. Design System Usage

#### Colors (use in Tailwind classes)
```tsx
// Background & text
<div className="bg-background text-foreground">

// Status colors
<div className="text-success">Healthy</div>
<div className="text-warning">Warning</div>
<div className="text-destructive">Critical</div>

// Cards & containers
<div className="bg-card border border-border">

// Hover states
<button className="bg-muted hover:bg-muted/80">
```

#### Spacing (Tailwind scale)
```tsx
// Padding
<div className="p-4">      {/* 16px */}
<div className="p-6">      {/* 24px */}
<div className="p-8">      {/* 32px */}

// Gaps
<div className="gap-4">    {/* 16px */}
<div className="gap-6">    {/* 24px */}

// Margins
<div className="mb-4">     {/* 16px */}
<div className="mb-8">     {/* 32px */}
```

#### Typography
```tsx
// Page titles
<h1 className="text-3xl font-bold">Title</h1>

// Section headers
<h2 className="text-lg font-semibold">Section</h2>

// Body text
<p className="text-sm">Normal text</p>

// Small text
<span className="text-xs">Small text</span>
```

### 6. Responsive Design

Mobile-first approach using Tailwind prefixes:

```tsx
// Mobile by default, tablet and up
<div className="w-full md:w-1/2 lg:w-1/3">

// Hidden on mobile, visible on tablet+
<div className="hidden sm:block">

// Different layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

### 7. Common Patterns

#### Metric Card
```tsx
<MetricCard 
  label="Workspace Health"
  value="94%"
  change="+2.1% from yesterday"
  trend="up"
  icon={<Activity className="w-8 h-8" />}
/>
```

#### Status Badge
```tsx
<StatusBadge status="healthy" />
<StatusBadge status="warning" />
<StatusBadge status="critical" />
<StatusBadge status="info" />
```

#### Empty State
```tsx
<EmptyState
  icon={<Package className="w-12 h-12" />}
  title="No Data"
  description="Start by adding your first cluster"
  action={<Button>Add Cluster</Button>}
/>
```

#### Data Table
```tsx
import { DataTable } from '@/components/data-table'
import { ColumnDef } from '@tanstack/react-table'

const columns: ColumnDef<typeof data[0]>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "status", header: "Status" },
]

<DataTable columns={columns} data={data} />
```

### 8. Adding Icons

NexOps uses Lucide React icons. All navigation items already have icons.

Import and use:
```tsx
import { Activity, AlertTriangle, Zap } from 'lucide-react'

<Activity className="w-4 h-4" />
<AlertTriangle className="w-8 h-8" />
```

Available icon sizes: `w-3 h-3`, `w-4 h-4`, `w-5 h-5`, `w-6 h-6`, `w-8 h-8`

### 9. Dark/Light Mode

The app defaults to dark mode. Users can switch via ThemeProvider (future feature).

To test light mode during development:
```tsx
// In layout.tsx, temporarily change:
<html lang="en" suppressHydrationWarning className="light">
  {/* instead of className="dark" */}
```

### 10. Next Steps

To build a feature page:

1. **Plan the layout** - Use Grid, Section, PageHeader components
2. **Add data display** - Use MetricCard, DataTable, or custom components
3. **Handle loading** - Use skeleton loaders
4. **Add interactions** - Use drawers and modals as needed
5. **Test responsive** - Check mobile, tablet, and desktop

## File Locations Quick Reference

| What | Where |
|------|-------|
| Page routes | `app/[route]/page.tsx` |
| Layout components | `components/layout.tsx` |
| Navigation | `components/sidebar.tsx`, `components/top-nav.tsx` |
| Data table | `components/data-table.tsx` |
| Design tokens | `app/globals.css` |
| Design docs | `docs/DESIGN_SYSTEM.md` |
| Style config | `tailwind.config.ts` |
| Utilities | `lib/utils.ts` |

## Keyboard Shortcuts (Ready for Implementation)

- `Cmd+K` / `Ctrl+K` - Command palette (UI ready)
- `Escape` - Close drawers/modals

## Troubleshooting

### Page looks blank
- Check that TopNav and PageLayout are included
- Verify Section wrapper is present
- Check the browser console for errors

### Colors not applying
- Colors are in `app/globals.css` as CSS variables
- Use Tailwind classes like `bg-primary`, `text-foreground`
- Don't use hard-coded color values

### Layout is broken on mobile
- Check responsive classes (sm:, md:, lg: prefixes)
- Use Grid component for consistent layouts
- Test with `agent-browser set viewport 375 667` (mobile size)

### Component not found
- Check that imports are correct
- Use `from '@/components/...'` imports
- shadcn/ui components are in `components/ui/`

## Need Help?

1. Check `DESIGN_SYSTEM.md` for design patterns
2. Look at existing page files for examples
3. Reference `components/layout.tsx` for component props
4. Read component JSDoc comments for usage

---

**You're ready to start building! Phase 1 foundation is complete and ready for feature development.**

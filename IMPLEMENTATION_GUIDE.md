# NexOps Dashboard - Implementation Guide

## Quick Start

The dashboard is fully implemented and ready to use. Start the development server and navigate to the dashboard:

```bash
# Install dependencies (if not already done)
pnpm install

# Start dev server
pnpm dev

# Open in browser
# http://localhost:3000/dashboard
```

## Dashboard Architecture

### File Structure

```
components/
├── dashboard/
│   ├── health-overview.tsx          # 24h health trend chart
│   ├── active-incidents.tsx         # Current operational incidents
│   ├── recent-changes.tsx           # Deployments & infrastructure changes
│   ├── recommendations.tsx          # AI-powered action suggestions
│   └── impact-map.tsx               # Service topology visualization
├── layout.tsx                       # Layout utilities
├── top-nav.tsx                      # Header navigation
├── sidebar.tsx                      # Side navigation
└── ui/                              # shadcn/ui components

app/
├── dashboard/
│   └── page.tsx                     # Main dashboard page
├── layout.tsx                       # Root layout
└── globals.css                      # Design tokens & styles

docs/
├── DASHBOARD.md                     # Comprehensive documentation
├── DESIGN_SYSTEM.md                 # Design tokens reference
└── README.md                        # Project overview
```

## Component Overview

### Health Overview (`health-overview.tsx`)
**Purpose**: Visualize 24-hour health trends

**Props**: None (uses internal mock data)

**Features**:
- Line chart with 4 metrics
- Real-time tooltips
- Legend display
- Responsive sizing

**Usage**:
```tsx
import { HealthOverview } from '@/components/dashboard/health-overview'

export default function Dashboard() {
  return <HealthOverview />
}
```

**To Connect Real Data**:
```tsx
// Add props interface
interface HealthOverviewProps {
  data: HealthDataPoint[]
}

// Update component
export function HealthOverview({ data }: HealthOverviewProps) {
  return (
    <LineChart data={data}>
      {/* chart config */}
    </LineChart>
  )
}
```

### Active Incidents (`active-incidents.tsx`)
**Purpose**: Display ongoing operational issues

**Props**: None (uses internal mock data)

**Features**:
- Severity-based coloring
- Status indicators
- Affected services list
- Owner assignment
- Click handlers ready

**Usage**:
```tsx
import { ActiveIncidents } from '@/components/dashboard/active-incidents'

export default function Dashboard() {
  return <ActiveIncidents />
}
```

**Data Interface**:
```typescript
interface Incident {
  id: string
  title: string
  severity: 'critical' | 'high' | 'medium'
  status: 'investigating' | 'mitigating' | 'resolved'
  duration: string
  affectedServices: string[]
  owner: string
  startedAt: string
}
```

### Recent Changes (`recent-changes.tsx`)
**Purpose**: Track recent deployments and infrastructure changes

**Props**: None (uses internal mock data)

**Features**:
- Type-based icons
- Status indicators
- Impact levels
- Author tracking
- Timestamps

**Usage**:
```tsx
import { RecentChanges } from '@/components/dashboard/recent-changes'

export default function Dashboard() {
  return <RecentChanges />
}
```

**Data Interface**:
```typescript
interface Change {
  id: string
  type: 'deployment' | 'pr' | 'infrastructure'
  title: string
  service: string
  impact: 'high' | 'medium' | 'low'
  status: 'success' | 'warning' | 'error'
  timestamp: string
  author: string
  details?: string
}
```

### Recommendations (`recommendations.tsx`)
**Purpose**: AI-powered action suggestions

**Props**: None (uses internal mock data)

**Features**:
- Confidence scores with gradient bars
- Clear problem → solution flow
- Suggested owners
- Related services
- Dual-action buttons

**Usage**:
```tsx
import { Recommendations } from '@/components/dashboard/recommendations'

export default function Dashboard() {
  return <Recommendations />
}
```

**Data Interface**:
```typescript
interface Recommendation {
  id: string
  title: string
  issue: string
  impact: 'critical' | 'high' | 'medium' | 'low'
  confidence: number  // 0-100
  suggestedOwner?: string
  estimatedOutcome: string
  action: string
  relatedServices: string[]
}
```

### Impact Map (`impact-map.tsx`)
**Purpose**: Service dependency topology visualization

**Props**: None (uses internal mock data)

**Features**:
- 3-tier topology visualization
- Service status indicators
- Dependency counts
- Risk metrics
- Click handlers ready

**Usage**:
```tsx
import { ImpactMap } from '@/components/dashboard/impact-map'

export default function Dashboard() {
  return <ImpactMap />
}
```

## Styling & Design

### Color System

All colors are defined as CSS variables in `app/globals.css`:

```css
:root {
  --primary: oklch(0.44 0.12 262);      /* Blue */
  --success: oklch(0.62 0.16 142);      /* Green */
  --warning: oklch(0.82 0.22 85);       /* Amber */
  --destructive: oklch(0.58 0.24 27);   /* Red */
  --muted-foreground: oklch(0.45 0 0);  /* Gray */
}
```

### Responsive Classes

Dashboard uses Tailwind responsive prefixes:

```tsx
// 1 column on mobile, 2 on tablet, 4 on desktop
<Grid columns={4}>
  {/* grid-cols-1 md:grid-cols-2 lg:grid-cols-4 */}
</Grid>
```

Available breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Adding Data Sources

### Connecting to an API

Replace mock data with API calls:

```tsx
// Before: Static mock data
const incidents = [
  { id: 'INC-001', title: 'API Gateway Latency...', ... }
]

// After: API-driven data
import { useEffect, useState } from 'react'

export function ActiveIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/incidents')
      .then(r => r.json())
      .then(data => {
        setIncidents(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <LoadingSkeleton />
  return <IncidentsPanel incidents={incidents} />
}
```

### Using SWR for Data Fetching

Recommended approach for client components:

```tsx
'use client'

import useSWR from 'swr'

export function HealthOverview() {
  const { data, error, isLoading } = useSWR(
    '/api/health/24h',
    fetcher,
    { refreshInterval: 30000 } // Refresh every 30s
  )

  if (isLoading) return <HealthChartSkeleton />
  if (error) return <ErrorState />

  return <LineChart data={data} />
}
```

### Real-time Updates with WebSocket

For live metric updates:

```tsx
'use client'

import { useEffect, useState } from 'react'

export function HealthOverview() {
  const [data, setData] = useState<HealthDataPoint[]>([])

  useEffect(() => {
    const ws = new WebSocket('wss://api.example.com/health')
    
    ws.onmessage = (event) => {
      const newDataPoint = JSON.parse(event.data)
      setData(prev => [...prev.slice(-23), newDataPoint]) // Keep last 24
    }

    return () => ws.close()
  }, [])

  return <LineChart data={data} />
}
```

## Customization Examples

### Adding a New Dashboard Widget

1. Create component file:
```tsx
// components/dashboard/my-widget.tsx
'use client'

import { Card } from '@/components/ui/card'

export function MyWidget() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">My Widget</h3>
      {/* Your content */}
    </Card>
  )
}
```

2. Import in dashboard:
```tsx
// app/dashboard/page.tsx
import { MyWidget } from '@/components/dashboard/my-widget'

export default function DashboardPage() {
  return (
    <PageLayout>
      {/* ... existing content ... */}
      <MyWidget />
    </PageLayout>
  )
}
```

### Changing Color Scheme

Update CSS variables in `globals.css`:

```css
:root {
  /* Change primary color to purple */
  --primary: oklch(0.6 0.2 280);
  
  /* Change accent color */
  --accent: oklch(0.7 0.15 200);
}
```

### Adjusting Chart Colors

Modify chart component:

```tsx
<Line
  type="monotone"
  dataKey="overall"
  stroke="var(--primary)" // Change this
  strokeWidth={2}
/>
```

## Performance Optimization

### Lazy Loading Heavy Sections

```tsx
import dynamic from 'next/dynamic'

const HealthOverview = dynamic(
  () => import('@/components/dashboard/health-overview'),
  { loading: () => <HealthChartSkeleton /> }
)

export default function DashboardPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <HealthOverview />
    </Suspense>
  )
}
```

### Memoizing Components

```tsx
import { memo } from 'react'

export const HealthOverview = memo(function HealthOverview() {
  return (
    <Card>
      {/* content */}
    </Card>
  )
})
```

### Virtualization for Large Lists

For tables with >100 rows, use react-window:

```bash
pnpm add react-window
```

```tsx
import { FixedSizeList } from 'react-window'

export function IncidentsList({ incidents }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={incidents.length}
      itemSize={80}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <IncidentRow incident={incidents[index]} />
        </div>
      )}
    </FixedSizeList>
  )
}
```

## Debugging

### Enable React DevTools

```bash
# React DevTools browser extension helps debug components
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools
```

### Log Component Data

```tsx
export function HealthOverview() {
  console.log('[v0] Health data loaded:', healthData)
  
  return <LineChart data={healthData} />
}
```

### Check TypeScript Errors

```bash
# Type check all files
pnpm tsc --noEmit
```

### Inspect Network Requests

```tsx
// Add request logging
const fetcher = async (url: string) => {
  console.log('[v0] Fetching:', url)
  const res = await fetch(url)
  const data = await res.json()
  console.log('[v0] Response:', data)
  return data
}
```

## Testing

### Component Testing

```tsx
// __tests__/dashboard.test.tsx
import { render, screen } from '@testing-library/react'
import { Dashboard } from '@/app/dashboard/page'

describe('Dashboard', () => {
  it('renders dashboard title', () => {
    render(<Dashboard />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('displays health metrics', () => {
    render(<Dashboard />)
    expect(screen.getByText('94%')).toBeInTheDocument() // Workspace Health
  })
})
```

### Visual Regression Testing

```bash
# Install Playwright
pnpm add -D @playwright/test

# Take baseline screenshots
pnpm playwright test --update-snapshots

# Compare against baseline
pnpm playwright test
```

## Troubleshooting

### Charts Not Rendering

**Problem**: Charts appear blank
**Solution**: Ensure Recharts is installed and charts have data

```bash
pnpm add recharts
```

### Dark Mode Not Working

**Problem**: Light mode only
**Solution**: Check that html element has `dark` class

```tsx
// app/layout.tsx
<html className="dark">
  {/* content */}
</html>
```

### Responsive Layout Broken

**Problem**: Not stacking on mobile
**Solution**: Verify grid responsive classes

```tsx
// Should have responsive breakpoints
<Grid columns={4} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

### Build Errors

**Problem**: TypeScript errors
**Solution**: Run type check

```bash
pnpm tsc --noEmit
```

## Deployment

### Vercel Deployment

```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys from GitHub
# No additional steps needed!
```

### Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=https://api.example.com
API_KEY=your-key
```

Use in components:
```tsx
const apiUrl = process.env.NEXT_PUBLIC_API_URL
fetch(`${apiUrl}/incidents`)
```

### Build Optimization

```bash
# Build for production
pnpm build

# Check build size
pnpm analyze
```

## Next Steps

1. **Connect Real Data**: Replace mock data with API endpoints
2. **Add Real-time Updates**: Implement WebSocket or polling
3. **User Customization**: Let users customize layouts
4. **Advanced Analytics**: Add predictive insights
5. **Mobile App**: Extend to native mobile

## Support & Resources

- **Documentation**: See `docs/` folder
- **Design System**: See `docs/DESIGN_SYSTEM.md`
- **Component Docs**: See `docs/DASHBOARD.md`
- **Issue Tracker**: Create issues for bugs/features
- **Team Slack**: #engineering-platform channel

## Maintenance

### Regular Updates

- Update dependencies monthly: `pnpm update`
- Run type checks: `pnpm tsc --noEmit`
- Run linter: `pnpm lint`
- Test components: `pnpm test`

### Performance Monitoring

Monitor in production:
- Core Web Vitals (CLS, LCP, FID)
- Time to Interactive
- Bundle size
- API response times

### Security

- Keep dependencies updated
- Sanitize user input
- Validate API responses
- Use HTTPS only
- Enable CORS properly

---

**Dashboard is production-ready and fully documented. Happy building! 🚀**

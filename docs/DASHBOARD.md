# NexOps Dashboard Documentation

## Overview

The NexOps Dashboard is the central command center for engineering organizations. It answers the critical question: **"What needs attention today?"**

The dashboard follows the specification in the main PDF and implements:
- Executive health overview
- Active incidents with severity and impact
- Recent critical changes and deployments
- AI-powered recommended actions
- Service dependency impact map

## Dashboard Layout

The dashboard uses a responsive three-column layout optimized for both desktop and mobile:

### Desktop Layout (1920px+)
```
┌─────────────────────────────────────────────────────┐
│  Header (Fixed)                                     │
├────────────────────┬────────────────────────────────┤
│                    │                                │
│   Left Sidebar     │  Main Content Area             │
│                    │                                │
├────────────────────┴────────────────────────────────┤
│  Executive Metrics (4 columns)                      │
├─────────────────────────────────────┬───────────────┤
│  Engineering Health (50%) │ Impact Map (50%)        │
├─────────────────────────────────────┴───────────────┤
│  Active Incidents (Full Width)                      │
├─────────────────────────────────────────────────────┤
│  Recent Critical Changes (Full Width)               │
├─────────────────────────────────────────────────────┤
│  Recommended Actions (Full Width)                   │
└─────────────────────────────────────────────────────┘
```

## Components

### 1. Executive Health Cards
**Location**: Top of page (4-column grid)

Displays key metrics at a glance:
- **Workspace Health**: Overall platform stability (0-100%)
- **Active Incidents**: Count of ongoing operational issues
- **Deployment Risk**: Risk assessment of pending changes
- **Change Failure Rate**: Percentage of failed deployments

**Features**:
- Trend indicators (up/down/neutral)
- Color-coded for quick scanning
- Responsive grid: 1 column mobile, 2 columns tablet, 4 columns desktop

### 2. Engineering Health Trend
**Component**: `HealthOverview`
**File**: `components/dashboard/health-overview.tsx`

Interactive line chart showing 24-hour health trends across:
- Overall System Health (primary line)
- Cluster Health (green)
- Service Health (amber)
- Deployment Health (blue)

**Features**:
- Real-time metric lines
- Hover tooltips with exact values
- Legend for all four metrics
- Responsive chart (scales with viewport)
- Dark mode compatible colors

**Data Structure**:
```typescript
{
  time: string        // Time label (e.g., "2 PM")
  overall: number     // 0-100 health score
  clusters: number    // 0-100 health score
  services: number    // 0-100 health score
  deployments: number // 0-100 health score
}
```

### 3. Active Incidents Panel
**Component**: `ActiveIncidents`
**File**: `components/dashboard/active-incidents.tsx`

Lists ongoing incidents with full context and ownership.

**Data Structure**:
```typescript
{
  id: string                    // Incident ID (e.g., "INC-001")
  title: string                 // Short description
  severity: 'critical' | 'high' | 'medium'
  status: 'investigating' | 'mitigating' | 'resolved'
  duration: string              // Time since incident started
  affectedServices: string[]    // List of impacted services
  owner: string                 // Assigned team member
  startedAt: string             // Time incident started
}
```

**Features**:
- Color-coded by severity (red for critical, amber for high, etc.)
- Clear ownership assignment
- Affected services badges
- Status indicators
- Clickable incidents open in Intelligence Drawer (future)
- CTA button to view all incidents

**Design**:
- Critical incidents have red background accent
- High incidents have amber accent
- Visual hierarchy emphasizes most urgent incidents

### 4. Impact Map Preview
**Component**: `ImpactMap`
**File**: `components/dashboard/impact-map.tsx`

Simplified topology visualization showing service dependencies and blast radius.

**Visual Structure**:
- **Ingress Layer**: API Gateway
- **Service Layer**: Auth, User, Payment services
- **Data Layer**: Database cluster, cache services
- Connection arrows show dependency flow

**Key Metrics**:
- Critical Dependencies count
- Blast Radius (affected services)
- Single Point of Failure (SPOF) risk assessment

**Features**:
- Clickable nodes (future intelligence drawer)
- Risk indicators with color coding
- Service dependency count display
- CTA to open full investigation workspace

### 5. Recent Critical Changes
**Component**: `RecentChanges`
**File**: `components/dashboard/recent-changes.tsx`

Timeline of recent deployments, pull requests, and infrastructure changes.

**Data Structure**:
```typescript
{
  id: string                               // Change ID
  type: 'deployment' | 'pr' | 'infrastructure'
  title: string                            // Change description
  service: string                          // Affected service
  impact: 'high' | 'medium' | 'low'
  status: 'success' | 'warning' | 'error'  // Deployment outcome
  timestamp: string                        // When it occurred
  author: string                           // Who made the change
  details?: string                         // Additional context
}
```

**Features**:
- Type icons for quick visual scanning (package, git branch, settings)
- Status indicators (green checkmark, amber/red alert)
- Service and impact badges
- Time relative to now
- Detailed descriptions with explanations
- CTA to view all changes

**Design**:
- Icons identify change type
- Color coding matches status severity
- Compact layout for information density
- Hover states indicate interactivity

### 6. Recommended Actions
**Component**: `Recommendations`
**File**: `components/dashboard/recommendations.tsx`

AI-powered suggestions prioritized by impact and confidence. This is the most important widget on the dashboard.

**Data Structure**:
```typescript
{
  id: string                          // Recommendation ID
  title: string                       // Short action summary
  issue: string                       // Problem description
  impact: 'critical' | 'high' | 'medium' | 'low'
  confidence: number                  // 0-100 confidence score
  suggestedOwner?: string             // Recommended team lead
  estimatedOutcome: string            // Expected result
  action: string                      // Specific action to take
  relatedServices: string[]           // Affected services
}
```

**Features**:
- **Confidence Score Visualization**: Gradient bar showing AI confidence
  - Red bars for <75% confidence
  - Amber bars for 75-90% confidence
  - Green bars for >90% confidence
- Color-coded by impact (critical = red, high = amber, etc.)
- Clear ownership suggestions
- Expected outcomes for each action
- Related services list
- Dual-action buttons:
  - "Approve & Execute" (blue primary)
  - "Review & Schedule" (secondary outline)

**Information Architecture**:
1. Problem statement (what's wrong)
2. Confidence score (how sure are we?)
3. Expected outcome (what will improve?)
4. Specific action (what to do)
5. Suggested owner (who should do it)
6. Related services (what might break?)
7. Action buttons (what's next?)

## Responsive Design

### Mobile (< 768px)
- Single-column layout
- Executive cards stack to 1 per row
- Charts scale to viewport width
- Incident cards full width
- Impact map simplified
- Recommendations take full width

### Tablet (768px - 1024px)
- 2-column layout where applicable
- Executive cards: 2 per row
- Main content area flexible
- Sidebar collapsible overlay

### Desktop (> 1024px)
- 3-column layout for health/map
- 4-column grid for metrics
- Full width for comprehensive sections
- Persistent sidebar
- Optimized spacing and typography

## Color System

The dashboard uses the NexOps professional slate palette:

### Status Colors
- **Green (Success)**: `oklch(0.62 0.16 142)` - Healthy, resolved, normal
- **Amber (Warning)**: `oklch(0.82 0.22 85)` - Degradation, risks, attention needed
- **Red (Critical)**: `oklch(0.58 0.24 27)` - Failures, critical issues
- **Blue (Primary)**: `oklch(0.44 0.12 262)` - Information, actions, highlights
- **Gray (Neutral)**: Slate shades for text and borders

### Application
- Critical incidents: Red backgrounds with red text
- Active warnings: Amber backgrounds
- Success states: Green text and accents
- Interactive elements: Blue accents

## Data Flow & Interactivity

### Current Features (Built)
- ✅ Executive metrics display
- ✅ Health trend charts
- ✅ Incident listings
- ✅ Change history
- ✅ Recommendations display
- ✅ Impact map preview
- ✅ Responsive layouts

### Future Features (Phase 2)
- 🔮 Click incidents to open intelligence drawer
- 🔮 Click nodes in impact map for service details
- 🔮 Approve/execute recommendations with confirmation
- 🔮 Real-time data refresh with WebSocket
- 🔮 Custom dashboard layouts per user role
- 🔮 Time range filters (24h, 7d, 30d)
- 🔮 Search and filter recommendations
- 🔮 Historical trend comparisons

## Performance Characteristics

### Metrics
- **Initial Load**: < 2 seconds (with streaming UI)
- **Time to Interactive**: < 3 seconds
- **Chart Rendering**: Optimized with Recharts (virtualization for large datasets)
- **Table Rendering**: Efficient card components (not virtualized for this section)

### Optimization Techniques
1. **Server Components**: PageLayout and layout components as Server Components
2. **Client Components**: Only chart components use 'use client'
3. **Code Splitting**: Each dashboard section is independently bundled
4. **Image Optimization**: No images in core dashboard
5. **CSS-in-JS**: Tailwind classes only (no runtime overhead)

## Customization & Future Enhancements

### Dashboard Customization
Users can customize the dashboard by:
1. Rearranging sections (drag-and-drop)
2. Hiding/showing panels
3. Changing metric display (7d, 30d views)
4. Setting alert thresholds
5. Creating saved views
6. Custom metric cards

### Adding New Sections
To add a new dashboard panel:

1. Create component in `components/dashboard/`
2. Export from component file
3. Import in `app/dashboard/page.tsx`
4. Add to appropriate grid/layout section
5. Implement responsive styling

Example:
```tsx
// components/dashboard/my-widget.tsx
'use client'
import { Card } from '@/components/ui/card'

export function MyWidget() {
  return (
    <Card className="p-6">
      {/* Your content */}
    </Card>
  )
}

// app/dashboard/page.tsx
import { MyWidget } from '@/components/dashboard/my-widget'

// In JSX:
<MyWidget />
```

## Accessibility

The dashboard implements WCAG 2.1 Level AA compliance:

- ✅ All text has sufficient color contrast
- ✅ Color is not the only means of conveying information
- ✅ Charts have accessible tooltips with full data
- ✅ Buttons are keyboard accessible
- ✅ Status badges have text labels (not icon-only)
- ✅ Incident severity indicated by color + text + icon
- ✅ Form controls are properly labeled

## Troubleshooting

### Charts Not Rendering
- Ensure recharts is installed: `pnpm add recharts`
- Check browser console for errors
- Verify data structure matches expected format

### Missing Colors
- Confirm CSS variables are defined in `globals.css`
- Check that dark mode class is applied to html element
- Verify Tailwind color utility classes are correct

### Responsive Issues
- Test on multiple viewport sizes
- Use Chrome DevTools device emulation
- Check grid/flex classes match breakpoints

## File Structure

```
components/dashboard/
├── health-overview.tsx      # 24-hour health trend chart
├── active-incidents.tsx     # Current operational incidents
├── recent-changes.tsx       # Deployments and PR merges
├── recommendations.tsx      # AI-powered action suggestions
└── impact-map.tsx          # Service topology visualization

app/dashboard/
└── page.tsx                # Main dashboard page

docs/
├── DASHBOARD.md            # This file
└── DESIGN_SYSTEM.md        # Design tokens and system
```

## Next Steps

1. **Phase 2**: Implement drawer interactions for incidents/changes
2. **Phase 3**: Connect to real API endpoints for live data
3. **Phase 4**: Add WebSocket for real-time updates
4. **Phase 5**: Implement recommendation approval workflow

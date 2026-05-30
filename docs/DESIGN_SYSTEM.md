# NexOps Design System

## Color System

NexOps uses a professional slate-based color system optimized for enterprise SaaS applications with data-dense interfaces.

### Light Mode
- **Background**: `oklch(0.98 0 0)` - Off-white
- **Foreground**: `oklch(0.15 0 0)` - Dark slate
- **Primary**: `oklch(0.44 0.12 262)` - Professional blue
- **Secondary**: `oklch(0.925 0.02 262)` - Light slate blue
- **Muted**: `oklch(0.88 0 0)` - Light gray
- **Destructive**: `oklch(0.58 0.24 27)` - Red
- **Warning**: `oklch(0.82 0.22 85)` - Amber/Yellow
- **Success**: `oklch(0.62 0.16 142)` - Green

### Dark Mode (Default)
- **Background**: `oklch(0.12 0 0)` - Deep slate
- **Foreground**: `oklch(0.92 0 0)` - Off-white
- **Primary**: `oklch(0.64 0.15 262)` - Bright blue
- **Secondary**: `oklch(0.23 0.02 262)` - Dark slate blue
- **Muted**: `oklch(0.28 0 0)` - Medium gray
- **Destructive**: `oklch(0.58 0.24 27)` - Red
- **Warning**: `oklch(0.82 0.22 85)` - Amber
- **Success**: `oklch(0.62 0.16 142)` - Green

## Typography

### Font Stack
- **Sans (Body)**: Geist, system fonts
- **Mono (Code)**: Geist Mono, system fonts

### Scale
- **Page Title**: `text-3xl font-bold`
- **Section Header**: `text-lg font-semibold`
- **Body**: `text-sm`
- **Small**: `text-xs`
- **Metric Value**: `text-2xl font-bold`

### Line Height
- **Body Text**: `leading-relaxed` (1.5)
- **Default**: `leading-6` (1.5)

## Spacing System

Uses Tailwind's standard spacing scale:
- `p-4` (16px) - Default padding
- `p-6` (24px) - Large padding
- `gap-4` (16px) - Default gap
- `gap-6` (24px) - Large gap
- `mb-8` (32px) - Section spacing

## Components

### Layout Components
- **PageLayout**: Main content container with sidebar offset
- **Section**: Content section with standard padding
- **Grid**: Responsive grid (1, 2, 3, or 4 columns)
- **PageHeader**: Page title with description and actions

### Data Components
- **DataTable**: Sortable, filterable table with pagination
- **MetricCard**: Key metric display with trend
- **StatusBadge**: Health/status indicator
- **StatusBadge**: Health indicator (healthy, warning, critical, info)

### State Components
- **EmptyState**: Empty state with icon, title, description, action
- **CardSkeleton**: Skeleton loader for cards
- **TableSkeleton**: Skeleton loader for tables
- **GridSkeleton**: Skeleton loader for grids

### Interaction Components
- **IntelligenceDrawer**: Right-side drawer (420px, 30% on mobile)
- **InvestigationWorkspace**: Two-panel layout (70% main, 30% intelligence)
- **CommandPalette**: Cmd+K command palette
- **NotificationCenter**: Right-side notifications panel

## Responsive Design

Mobile-first approach with breakpoints:
- **Mobile**: Base styles (no prefix)
- **Tablet (md)**: `md:` prefix (768px)
- **Desktop (lg)**: `lg:` prefix (1024px)

### Layout Behavior
- **Sidebar**: 
  - Mobile: Fixed overlay, slides from left
  - Desktop: 256px width, fixed on left
- **Top Nav**: Fixed at top (64px height)
- **Content**: Adjusts for sidebar on desktop
- **Drawers**: 
  - Mobile: Full width
  - Desktop: 420px from right

## Status Colors

- **Healthy**: `bg-success/10 text-success` - Green
- **Warning**: `bg-warning/10 text-warning` - Amber
- **Critical**: `bg-destructive/10 text-destructive` - Red
- **Info**: `bg-accent/10 text-accent` - Blue

## Border and Radius

- **Border**: `border-border` (light gray on both modes)
- **Radius**: 8px (`rounded-lg`)

## Interaction Patterns

### Cursor States
- **Default**: Pointer on clickable elements
- **Text**: Text cursor on editable fields
- **Grab**: Grab/grabbing on draggable elements
- **Disabled**: Not-allowed on disabled actions

### Feedback States
- **Hover**: Subtle background change on interactive elements
- **Focus**: Ring outline for keyboard navigation
- **Active**: Highlight for active routes/selections
- **Disabled**: Reduced opacity (50%)

## Dark Mode Default

The application uses dark mode as default with full light mode support:
```jsx
<html className="dark">
```

Users can switch themes via settings (future implementation).

## Usage Guidelines

1. **Always use design tokens** - Never use hard-coded colors
2. **Maintain contrast** - Ensure WCAG AA compliance
3. **Consistent spacing** - Use Tailwind spacing scale
4. **Semantic colors** - Use status colors appropriately
5. **Mobile-first** - Design mobile first, enhance for desktop

## Component Structure Example

```tsx
import { PageLayout, Section, PageHeader, Grid, MetricCard } from '@/components/layout'

export default function Page() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader 
            title="Page Title"
            description="Page description"
          />
          <Grid columns={4}>
            <MetricCard 
              label="Metric"
              value="123"
              change="+5% from yesterday"
            />
          </Grid>
        </Section>
      </PageLayout>
    </>
  )
}
```

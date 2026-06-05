import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

/**
 * Main page container - use for full-width content
 */
export function PageContainer({ 
  children, 
  className 
}: { 
  children: ReactNode 
  className?: string 
}) {
  return (
    <div className={cn('w-full h-full', className)}>
      {children}
    </div>
  )
}

/**
 * Page content wrapper with sidebar layout
 * Supports independent scrolling for sidebar and main content
 */
export function PageLayout({ 
  children, 
  className 
}: { 
  children: ReactNode 
  className?: string 
}) {
  return (
    <main className={cn('pt-16 lg:ml-64 bg-background', className)}>
      {children}
    </main>
  )
}

/**
 * Section header with title and optional actions
 */
export function PageHeader({ 
  title, 
  description, 
  children 
}: { 
  title: string 
  description?: string 
  children?: ReactNode 
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex-1">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}

/**
 * Content section with padding
 */
export function PageContent({ 
  children, 
  className 
}: { 
  children: ReactNode 
  className?: string 
}) {
  return (
    <section className={cn('px-4 py-6 sm:px-6 lg:px-8', className)}>
      {children}
    </section>
  )
}

/**
 * Grid layout for cards and widgets
 */
export function Grid({ 
  children, 
  columns = 1,
  className 
}: { 
  children: ReactNode 
  columns?: 1 | 2 | 3 | 4
  className?: string 
}) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns]

  return (
    <div className={cn('grid gap-6', gridClass, className)}>
      {children}
    </div>
  )
}

/**
 * Metric card for displaying key metrics
 */
export function MetricCard({ 
  label, 
  value, 
  change, 
  trend = 'up',
  icon,
  className 
}: { 
  label: string 
  value: string | number 
  change?: string 
  trend?: 'up' | 'down' | 'neutral'
  icon?: ReactNode
  className?: string 
}) {
  return (
    <div className={cn('rounded-lg border border-border bg-card p-6', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          {change && (
            <p className={cn(
              'text-sm mt-2',
              trend === 'up' && 'text-success',
              trend === 'down' && 'text-destructive',
              trend === 'neutral' && 'text-muted-foreground'
            )}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Status badge for service/cluster health
 */
export function StatusBadge({ 
  status, 
  className 
}: { 
  status: 'healthy' | 'warning' | 'critical' | 'info'
  className?: string 
}) {
  const statusClass = {
    healthy: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    critical: 'bg-destructive/10 text-destructive border-destructive/20',
    info: 'bg-accent/10 text-accent border-accent/20',
  }[status]

  const statusText = {
    healthy: 'Healthy',
    warning: 'Warning',
    critical: 'Critical',
    info: 'Info',
  }[status]

  return (
    <span className={cn('px-2.5 py-1 rounded-md text-xs font-medium border', statusClass, className)}>
      {statusText}
    </span>
  )
}

/**
 * Empty state for pages with no data
 */
export function EmptyState({ 
  icon, 
  title, 
  description, 
  action 
}: { 
  icon: ReactNode 
  title: string 
  description: string 
  action?: ReactNode 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-muted-foreground mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-xs">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

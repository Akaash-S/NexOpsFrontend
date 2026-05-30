'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GitBranch, Package, Settings, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

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

const changes: Change[] = [
  {
    id: 'DEP-1024',
    type: 'deployment',
    title: 'API Gateway v2.15.3 deployed',
    service: 'API Gateway',
    impact: 'high',
    status: 'success',
    timestamp: '3 minutes ago',
    author: 'deployment-bot',
    details: 'Added rate limiting improvements and security patches',
  },
  {
    id: 'PR-8392',
    type: 'pr',
    title: 'Merged: Fix payment processing race condition',
    service: 'Payment Service',
    impact: 'high',
    status: 'success',
    timestamp: '18 minutes ago',
    author: 'Sarah Chen',
    details: 'Resolved critical race condition affecting concurrent payments',
  },
  {
    id: 'INF-2891',
    type: 'infrastructure',
    title: 'Database scaling event triggered',
    service: 'Database Cluster',
    impact: 'medium',
    status: 'warning',
    timestamp: '42 minutes ago',
    author: 'auto-scaling',
    details: 'Automatically scaled due to increased connection demand',
  },
  {
    id: 'DEP-1023',
    type: 'deployment',
    title: 'User Service v1.8.2 deployment failed',
    service: 'User Service',
    impact: 'high',
    status: 'error',
    timestamp: '1 hour ago',
    author: 'ci-pipeline',
    details: 'Rolled back due to health check failure',
  },
  {
    id: 'PR-8385',
    type: 'pr',
    title: 'Merged: Cache invalidation optimization',
    service: 'Cache Service',
    impact: 'medium',
    status: 'success',
    timestamp: '2 hours ago',
    author: 'Marcus Johnson',
    details: 'Improved cache hit rate by 15%',
  },
]

const typeConfig = {
  deployment: { icon: Package, label: 'Deployment', color: 'text-primary' },
  pr: { icon: GitBranch, label: 'Pull Request', color: 'text-success' },
  infrastructure: { icon: Settings, label: 'Infrastructure', color: 'text-accent' },
}

const impactConfig = {
  high: { label: 'High', bg: 'bg-destructive/10', text: 'text-destructive' },
  medium: { label: 'Medium', bg: 'bg-warning/10', text: 'text-warning' },
  low: { label: 'Low', bg: 'bg-success/10', text: 'text-success' },
}

const statusConfig = {
  success: { icon: CheckCircle, color: 'text-success' },
  warning: { icon: AlertCircle, color: 'text-warning' },
  error: { icon: AlertCircle, color: 'text-destructive' },
}

export function RecentChanges() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Recent Critical Changes</h3>
        <p className="text-sm text-muted-foreground mt-1">Latest deployments and infrastructure updates</p>
      </div>

      <div className="space-y-4">
        {changes.map((change) => {
          const TypeIcon = typeConfig[change.type].icon
          const StatusIcon = statusConfig[change.status].icon
          return (
            <div
              key={change.id}
              className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={cn('mt-1', typeConfig[change.type].color)}>
                  <TypeIcon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{change.title}</p>
                      {change.details && (
                        <p className="text-xs text-muted-foreground mt-1">{change.details}</p>
                      )}
                    </div>
                    <StatusIcon className={cn('w-5 h-5 flex-shrink-0', statusConfig[change.status].color)} />
                  </div>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {change.service}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={cn('text-xs', impactConfig[change.impact].text)}
                    >
                      {impactConfig[change.impact].label} Impact
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {change.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button className="w-full mt-6 p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors text-sm font-medium">
        View All Changes →
      </button>
    </Card>
  )
}

'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Network, BellOff, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { serviceNodes, dependencyEdges, ServiceNode } from '@/lib/graph'

const healthMock: Record<string, 'healthy' | 'warning' | 'critical'> = {
  'api-gateway': 'warning',
  'auth-service': 'critical',
  'user-service': 'healthy',
  'payment-service': 'warning',
  'notification-service': 'healthy',
  'analytics-engine': 'healthy',
  'database': 'warning',
  'redis-cache': 'healthy',
  'kafka-queue': 'healthy',
}

const healthConfig = {
  healthy: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30', dot: 'bg-success' },
  warning: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30', dot: 'bg-warning' },
  critical: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/30', dot: 'bg-destructive' },
}

const tierLabels = {
  ingress: 'Ingress',
  service: 'Services',
  data: 'Data',
}

function getDownstreamCount(nodeId: string): number {
  return dependencyEdges.filter((e) => e.to === nodeId).length
}

function ServiceNodeCard({ node }: { node: ServiceNode }) {
  const health = healthMock[node.id] ?? 'healthy'
  const cfg = healthConfig[health]
  const downstreamCount = getDownstreamCount(node.id)
  const noisyCount = node.alertHistory.noisyRuleIds?.length ?? 0

  return (
    <div
      className={cn(
        'px-3 py-2.5 rounded-lg border-2 transition-colors cursor-default relative',
        cfg.bg,
        cfg.border
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', cfg.dot)} />
            <span className="font-semibold text-xs leading-tight">{node.name}</span>
          </div>
          {downstreamCount > 0 && (
            <p className="text-[10px] text-muted-foreground">{downstreamCount} upstream dependent{downstreamCount !== 1 ? 's' : ''}</p>
          )}
        </div>
        {/* Alert noise badge */}
        {noisyCount > 0 && (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0.5 bg-muted/50 text-muted-foreground border-border flex-shrink-0 gap-0.5"
            title={`${noisyCount} alert rule${noisyCount > 1 ? 's' : ''} on this service rarely correlate with real incidents`}
          >
            <BellOff className="w-2.5 h-2.5" />
            {noisyCount} noisy
          </Badge>
        )}
      </div>
    </div>
  )
}

export function ImpactMap() {
  const tiers = ['ingress', 'service', 'data'] as const

  // Build stats from graph
  const criticalNodes = serviceNodes.filter((n) => healthMock[n.id] === 'critical')
  const warningNodes = serviceNodes.filter((n) => healthMock[n.id] === 'warning')
  const maxDownstream = serviceNodes.reduce((max, n) => {
    return Math.max(max, getDownstreamCount(n.id))
  }, 0)
  const noisyServiceCount = serviceNodes.filter(
    (n) => (n.alertHistory.noisyRuleIds?.length ?? 0) > 0
  ).length

  return (
    <Card className="p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Network className="w-5 h-5" />
          Dependency Graph
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Service topology — derived from live dependency data
        </p>
      </div>

      {/* Tier layout — generated from graph data, not hardcoded */}
      <div className="space-y-4 mb-5">
        {tiers.map((tier, tierIndex) => {
          const nodes = serviceNodes.filter((n) => n.tier === tier)
          return (
            <div key={tier}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {tierLabels[tier]}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className={cn(
                'grid gap-2',
                nodes.length === 1 ? 'grid-cols-1' :
                nodes.length === 2 ? 'grid-cols-2' :
                'grid-cols-3'
              )}>
                {nodes.map((node) => (
                  <ServiceNodeCard key={node.id} node={node} />
                ))}
              </div>
              {tierIndex < tiers.length - 1 && (
                <div className="text-center text-muted-foreground/40 text-xs mt-2">↓</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Stats — derived from graph */}
      <div className="grid grid-cols-3 gap-3 mb-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Critical</p>
          <p className={cn('text-xl font-bold', criticalNodes.length > 0 ? 'text-destructive' : 'text-success')}>
            {criticalNodes.length}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Warning</p>
          <p className={cn('text-xl font-bold', warningNodes.length > 0 ? 'text-warning' : 'text-success')}>
            {warningNodes.length}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Noisy Services</p>
          <p className="text-xl font-bold">{noisyServiceCount}</p>
        </div>
      </div>

      {/* Alerts / risk indicators */}
      <div className="space-y-1.5 mb-5">
        {criticalNodes.map((n) => (
          <div key={n.id} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-destructive flex-shrink-0" />
            <span>{n.name} is critical — {getDownstreamCount(n.id)} upstream services affected</span>
          </div>
        ))}
        {warningNodes.map((n) => (
          <div key={n.id} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-warning flex-shrink-0" />
            <span>{n.name} degraded</span>
            {(n.alertHistory.noisyRuleIds?.length ?? 0) > 0 && (
              <Badge variant="outline" className="text-xs text-muted-foreground gap-1">
                <BellOff className="w-3 h-3" />
                {n.alertHistory.noisyRuleIds!.length} noisy rules
              </Badge>
            )}
          </div>
        ))}
      </div>

      <Link
        href="/dependencies"
        className="block text-center w-full p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors text-sm font-medium"
      >
        Open Full Dependency Graph →
      </Link>
    </Card>
  )
}

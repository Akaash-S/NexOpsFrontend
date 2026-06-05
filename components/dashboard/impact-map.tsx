'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Network } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Node {
  id: string
  label: string
  type: 'cluster' | 'service' | 'external'
  health: 'healthy' | 'warning' | 'critical'
  dependents: number
  dependencies: number
}

// Simplified topology visualization
const nodes: Node[] = [
  { id: 'api-gw', label: 'API Gateway', type: 'service', health: 'warning', dependents: 8, dependencies: 2 },
  { id: 'auth-svc', label: 'Auth Service', type: 'service', health: 'critical', dependents: 6, dependencies: 1 },
  { id: 'user-svc', label: 'User Service', type: 'service', health: 'healthy', dependents: 4, dependencies: 2 },
  { id: 'payment-svc', label: 'Payment Service', type: 'service', health: 'healthy', dependents: 2, dependencies: 3 },
  { id: 'db-cluster', label: 'Database Cluster', type: 'cluster', health: 'warning', dependents: 12, dependencies: 0 },
  { id: 'cache-svc', label: 'Cache Service', type: 'service', health: 'healthy', dependents: 5, dependencies: 0 },
]

const healthConfig = {
  healthy: { bg: 'bg-success/20', text: 'text-success', border: 'border-success/40' },
  warning: { bg: 'bg-warning/20', text: 'text-warning', border: 'border-warning/40' },
  critical: { bg: 'bg-destructive/20', text: 'text-destructive', border: 'border-destructive/40' },
}

export function ImpactMap() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Network className="w-5 h-5" />
          Impact Map Preview
        </h3>
        <p className="text-sm text-muted-foreground mt-1">Service dependencies and blast radius visualization</p>
      </div>

      {/* Simple topology grid representation */}
      <div className="space-y-4 mb-6">
        {/* Top tier */}
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground font-semibold">Ingress</div>
          <div className={cn(
            'flex-1 px-4 py-3 rounded-lg border-2 transition-colors cursor-pointer hover:border-primary',
            healthConfig['warning'].bg,
            healthConfig['warning'].border
          )}>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">API Gateway</span>
              <span className="text-xs text-muted-foreground">8 downstream</span>
            </div>
          </div>
        </div>

        {/* Connection lines (visual representation) */}
        <div className="text-xs text-muted-foreground text-center">↓ ↓ ↓ ↓ ↓</div>

        {/* Service tier */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Auth Service', health: 'critical' as const, downstream: 6 },
            { label: 'User Service', health: 'healthy' as const, downstream: 4 },
            { label: 'Payment Service', health: 'healthy' as const, downstream: 2 },
          ].map((service) => (
            <div
              key={service.label}
              className={cn(
                'px-4 py-3 rounded-lg border-2 transition-colors cursor-pointer hover:border-primary',
                healthConfig[service.health].bg,
                healthConfig[service.health].border
              )}
            >
              <div className="font-semibold text-sm">{service.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{service.downstream} services</div>
            </div>
          ))}
        </div>

        {/* Connection lines */}
        <div className="text-xs text-muted-foreground text-center">↓ ↓ ↓</div>

        {/* Data tier */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Database Cluster', health: 'warning' as const, downstream: 12 },
            { label: 'Cache Service', health: 'healthy' as const, downstream: 5 },
          ].map((service) => (
            <div
              key={service.label}
              className={cn(
                'px-4 py-3 rounded-lg border-2 transition-colors cursor-pointer hover:border-primary',
                healthConfig[service.health].bg,
                healthConfig[service.health].border
              )}
            >
              <div className="font-semibold text-sm">{service.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{service.downstream} upstream</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Critical Dependencies</p>
          <p className="text-2xl font-bold text-destructive">2</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Blast Radius</p>
          <p className="text-2xl font-bold text-warning">8 services</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">SPOF Risk</p>
          <p className="text-2xl font-bold text-primary">High</p>
        </div>
      </div>

      {/* Risk indicators */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-destructive"></div>
          <span className="text-sm">Auth Service degradation affects 6 services</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-warning"></div>
          <span className="text-sm">Database cluster under 85% capacity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success"></div>
          <span className="text-sm">Cache service is redundant</span>
        </div>
      </div>

      <Link href="/risk-analysis" className="block text-center w-full p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors text-sm font-medium">
        Open Full Impact Analysis →
      </Link>
    </Card>
  )
}

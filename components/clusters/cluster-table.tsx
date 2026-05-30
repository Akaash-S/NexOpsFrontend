'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Cluster {
  id: string
  name: string
  region: string
  provider: string
  health: number
  status: 'healthy' | 'warning' | 'critical'
  nodes: number
  services: number
  incidents: number
  lastSync: string
  capacity: number
  version: string
  criticalDeps: number
}

interface ClusterTableProps {
  clusters: Cluster[]
  selectedCluster: string | null
  onSelectCluster: (id: string) => void
}

const statusColors = {
  healthy: 'text-success bg-success/10 border-success/20',
  warning: 'text-warning bg-warning/10 border-warning/20',
  critical: 'text-destructive bg-destructive/10 border-destructive/20',
}

const statusIcons = {
  healthy: <CheckCircle className="w-4 h-4" />,
  warning: <AlertTriangle className="w-4 h-4" />,
  critical: <AlertTriangle className="w-4 h-4" />,
}

export function ClusterTable({ clusters, selectedCluster, onSelectCluster }: ClusterTableProps) {
  return (
    <div className="space-y-2">
      {clusters.length === 0 ? (
        <div className="text-center py-12 border border-border rounded-lg">
          <p className="text-muted-foreground">No clusters match your filters</p>
        </div>
      ) : (
        clusters.map((cluster) => (
          <Card
            key={cluster.id}
            className={cn(
              'p-4 cursor-pointer transition-all hover:border-primary/50',
              selectedCluster === cluster.id && 'border-primary bg-primary/5'
            )}
            onClick={() => onSelectCluster(cluster.id)}
          >
            <div className="flex items-center justify-between">
              {/* Left: Name and Basic Info */}
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{cluster.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {cluster.region} • {cluster.provider.toUpperCase()} • v{cluster.version}
                    </p>
                  </div>
                </div>
              </div>

              {/* Health Status */}
              <div className="flex items-center gap-6">
                {/* Health Score */}
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {statusIcons[cluster.status]}
                    <div>
                      <Badge variant="outline" className={cn('border', statusColors[cluster.status])}>
                        {cluster.health}% Health
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{cluster.nodes}</p>
                    <p className="text-xs text-muted-foreground">Nodes</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{cluster.services}</p>
                    <p className="text-xs text-muted-foreground">Services</p>
                  </div>
                  <div className="text-center">
                    <p className={cn('font-semibold', cluster.incidents > 0 ? 'text-destructive' : 'text-foreground')}>
                      {cluster.incidents}
                    </p>
                    <p className="text-xs text-muted-foreground">Incidents</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{cluster.capacity}%</p>
                    <p className="text-xs text-muted-foreground">Capacity</p>
                  </div>
                </div>

                {/* Last Sync & Button */}
                <div className="text-right flex items-center gap-3">
                  <div className="text-xs text-muted-foreground">
                    <p>Synced</p>
                    <p className="font-semibold">{cluster.lastSync}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Capacity Bar */}
            <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  cluster.capacity > 85 ? 'bg-destructive' : cluster.capacity > 70 ? 'bg-warning' : 'bg-success'
                )}
                style={{ width: `${cluster.capacity}%` }}
              />
            </div>
          </Card>
        ))
      )}
    </div>
  )
}

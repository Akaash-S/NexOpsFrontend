'use client'

import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Service {
  id: string
  name: string
  team: string
  health: number
  status: 'healthy' | 'warning' | 'critical' | 'disconnected'
  deployments: number
  dependencies: string[]
  dependents: string[]
  lastDeployed: string
  owner: string
  criticality: string
  changeFailureRate: number
  deploymentFrequency: string
  mttr: string
  incidents30d: number
}

interface ServiceCatalogProps {
  services: Service[]
  selectedService: string | null
  onSelectService: (id: string) => void
}

const statusColors = {
  healthy: 'text-success bg-success/10 border-success/20',
  warning: 'text-warning bg-warning/10 border-warning/20',
  critical: 'text-destructive bg-destructive/10 border-destructive/20',
  disconnected: 'text-muted-foreground bg-muted/30 border-border/60',
}

const criticalityColors = {
  critical: 'bg-destructive/10 text-destructive',
  high: 'bg-warning/10 text-warning',
  medium: 'bg-primary/10 text-primary',
  low: 'bg-muted text-muted-foreground',
}

export function ServiceCatalog({
  services,
  selectedService,
  onSelectService,
}: ServiceCatalogProps) {
  return (
    <div className="space-y-6">
      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {services.length === 0 ? (
          <div className="lg:col-span-2 text-center py-12 border border-border rounded-lg">
            <p className="text-muted-foreground">No services match your search</p>
          </div>
        ) : (
          services.map((service) => (
            <Card
              key={service.id}
              className={cn(
                'p-4 cursor-pointer transition-all hover:border-primary/50',
                selectedService === service.id && 'border-primary bg-primary/5',
                service.status === 'disconnected' && 'opacity-75 bg-muted/10 border-dashed'
              )}
              onClick={() => onSelectService(service.id)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{service.name}</h3>
                    {service.status === 'disconnected' && (
                      <Badge variant="outline" className="text-[10px] text-amber-500/90 border-amber-500/30 bg-amber-500/10">
                        Disconnected — Deleted on GitHub
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{service.team}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Status and Criticality */}
              <div className="flex gap-2 mb-4">
                <Badge
                  variant="outline"
                  className={cn('gap-1', statusColors[service.status])}
                >
                  {service.status === 'healthy' && <CheckCircle className="w-3 h-3" />}
                  {service.status === 'disconnected' && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                  {service.status !== 'healthy' && service.status !== 'disconnected' && <AlertTriangle className="w-3 h-3" />}
                  {service.status === 'disconnected' ? 'Disconnected' : `${service.health}% Health`}
                </Badge>
                <Badge
                  variant="outline"
                  className={criticalityColors[service.criticality as keyof typeof criticalityColors]}
                >
                  {service.criticality}
                </Badge>
              </div>

              {/* Health Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-muted/50 p-2 rounded">
                  <p className="text-xs text-muted-foreground">Deployments</p>
                  <p className="font-semibold text-sm">{service.deployments}</p>
                </div>
                <div className="bg-muted/50 p-2 rounded">
                  <p className="text-xs text-muted-foreground">Change Failure Rate</p>
                  <p className="font-semibold text-sm">{service.changeFailureRate}%</p>
                </div>
                <div className="bg-muted/50 p-2 rounded">
                  <p className="text-xs text-muted-foreground">MTTR</p>
                  <p className="font-semibold text-sm">{service.mttr}</p>
                </div>
                <div className="bg-muted/50 p-2 rounded">
                  <p className="text-xs text-muted-foreground">Incidents (30d)</p>
                  <p className={`font-semibold text-sm ${service.incidents30d > 0 ? 'text-destructive' : 'text-success'}`}>
                    {service.incidents30d}
                  </p>
                </div>
              </div>

              {/* Dependencies Info */}
              <div className="grid grid-cols-2 text-xs mb-3 pb-3 border-t border-border">
                <div className="pt-3">
                  <p className="text-muted-foreground">Dependencies</p>
                  <p className="font-semibold">{service.dependencies.length}</p>
                </div>
                <div className="pt-3">
                  <p className="text-muted-foreground">Dependents</p>
                  <p className="font-semibold">{service.dependents.length}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">{service.owner}</p>
                  <p>Last deployed {service.lastDeployed}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

'use client'

import { X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Alert {
  id: string
  title: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: 'firing' | 'resolved'
  cluster: string
  services: string[]
  value: string
  threshold: string
  createdAt: string
  duration: string
  correlatedAlerts: number
  suggestedActions: string[]
}

interface AlertDrawerProps {
  alert: Alert
  onClose: () => void
}

const SEVERITY_COLORS = {
  critical: 'text-destructive',
  high: 'text-warning',
  medium: 'text-info',
  low: 'text-success',
}

export function AlertDrawer({ alert, onClose }: AlertDrawerProps) {
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-16 h-[calc(100vh-64px)] w-96 bg-background border-l border-border z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-semibold text-lg">{alert.title}</h2>
            <p className="text-sm text-muted-foreground">{alert.cluster}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6 space-y-6">
            {/* Alert Status */}
            <div>
              <h3 className="font-semibold mb-4">Alert Status</h3>
              <div className="space-y-3">
                <Card className="p-4 bg-muted/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Severity</span>
                    <Badge className={SEVERITY_COLORS[alert.severity]}>
                      {alert.severity}
                    </Badge>
                  </div>
                </Card>
                <Card className="p-4 bg-muted/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <Badge variant="outline" className="capitalize">
                      {alert.status}
                    </Badge>
                  </div>
                </Card>
                <Card className="p-4 bg-muted/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Duration Active</span>
                    <span className="font-semibold">{alert.duration}</span>
                  </div>
                </Card>
              </div>
            </div>

            {/* Metrics */}
            <div>
              <h3 className="font-semibold mb-4">Metrics</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <span className="text-sm">Current Value</span>
                  <span className="font-semibold text-lg">{alert.value}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <span className="text-sm">Threshold</span>
                  <span className="font-semibold">{alert.threshold}</span>
                </div>
              </div>
            </div>

            {/* Impacted Services */}
            <div>
              <h3 className="font-semibold mb-4">Impacted Services ({alert.services.length})</h3>
              <div className="flex flex-wrap gap-2">
                {alert.services.map((service) => (
                  <Badge key={service} variant="outline">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Correlation */}
            {alert.correlatedAlerts > 0 && (
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  Correlated Alerts
                </h3>
                <Card className="p-4 bg-muted/50">
                  <p className="text-sm">
                    This alert is correlated with <strong>{alert.correlatedAlerts}</strong> other{' '}
                    {alert.correlatedAlerts === 1 ? 'alert' : 'alerts'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    May indicate a systemic issue affecting multiple services
                  </p>
                </Card>
              </div>
            )}

            {/* Suggested Actions */}
            <div>
              <h3 className="font-semibold mb-4">Suggested Actions</h3>
              <div className="space-y-2">
                {alert.suggestedActions.map((action, idx) => (
                  <Card key={idx} className="p-3">
                    <p className="text-sm">• {action}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}

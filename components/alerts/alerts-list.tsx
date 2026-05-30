'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react'

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
}

interface AlertsListProps {
  alerts: Alert[]
  selectedAlert: string | null
  onSelectAlert: (id: string) => void
}

const SEVERITY_CONFIG = {
  critical: { bg: 'bg-destructive/10', text: 'text-destructive', icon: AlertCircle },
  high: { bg: 'bg-warning/10', text: 'text-warning', icon: AlertTriangle },
  medium: { bg: 'bg-info/10', text: 'text-info', icon: AlertTriangle },
  low: { bg: 'bg-success/10', text: 'text-success', icon: Info },
}

export function AlertsList({
  alerts,
  selectedAlert,
  onSelectAlert,
}: AlertsListProps) {
  return (
    <div className="space-y-3">
      {alerts.length === 0 ? (
        <Card className="p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-success/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No alerts match your filters</p>
        </Card>
      ) : (
        alerts.map((alert) => {
          const config = SEVERITY_CONFIG[alert.severity]
          const Icon = config.icon

          return (
            <Card
              key={alert.id}
              className={`p-4 cursor-pointer transition-all hover:border-primary ${
                selectedAlert === alert.id ? 'border-primary ring-1 ring-primary' : ''
              }`}
              onClick={() => onSelectAlert(alert.id)}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left Side */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <Icon className={`w-5 h-5 ${config.text} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1">
                      <h3 className="font-semibold">{alert.title}</h3>
                      <p className="text-sm text-muted-foreground">{alert.cluster}</p>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {alert.services.map((service) => (
                      <Badge key={service} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Right Side */}
                <div className="text-right space-y-2">
                  <div>
                    <Badge
                      variant="secondary"
                      className={`${config.bg} ${config.text}`}
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">{alert.value}</div>
                    <div className="text-xs text-muted-foreground">
                      threshold: {alert.threshold}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {alert.duration} active
                  </div>
                  {alert.correlatedAlerts > 0 && (
                    <div className="text-xs text-warning font-medium">
                      {alert.correlatedAlerts} correlated
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })
      )}
    </div>
  )
}

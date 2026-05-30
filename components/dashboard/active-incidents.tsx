'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Clock, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Incident {
  id: string
  title: string
  severity: 'critical' | 'high' | 'medium'
  status: 'investigating' | 'mitigating' | 'resolved'
  duration: string
  affectedServices: string[]
  owner: string
  startedAt: string
}

const incidents: Incident[] = [
  {
    id: 'INC-001',
    title: 'API Gateway Latency Spike',
    severity: 'critical',
    status: 'investigating',
    duration: '42 minutes',
    affectedServices: ['API Gateway', 'Auth Service', 'Payment Service'],
    owner: 'Sarah Chen',
    startedAt: '2:15 PM',
  },
  {
    id: 'INC-002',
    title: 'Database Connection Pool Exhaustion',
    severity: 'high',
    status: 'mitigating',
    duration: '18 minutes',
    affectedServices: ['User Service', 'Profile Service'],
    owner: 'Marcus Johnson',
    startedAt: '3:27 PM',
  },
  {
    id: 'INC-003',
    title: 'Memory Leak in Cache Service',
    severity: 'medium',
    status: 'investigating',
    duration: '5 minutes',
    affectedServices: ['Cache Service'],
    owner: 'Alex Rodriguez',
    startedAt: '3:50 PM',
  },
]

const severityConfig = {
  critical: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Critical' },
  high: { bg: 'bg-warning/10', text: 'text-warning', label: 'High' },
  medium: { bg: 'bg-accent/10', text: 'text-accent', label: 'Medium' },
}

const statusConfig = {
  investigating: 'Investigating',
  mitigating: 'Mitigating',
  resolved: 'Resolved',
}

export function ActiveIncidents() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Active Incidents
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{incidents.length} incidents active</p>
        </div>
      </div>

      <div className="space-y-4">
        {incidents.map((incident) => (
          <div
            key={incident.id}
            className={cn(
              'p-4 rounded-lg border transition-colors cursor-pointer hover:border-primary/50',
              severityConfig[incident.severity].bg,
              'border-current border-opacity-20'
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-muted-foreground">
                    {incident.id}
                  </span>
                  <Badge variant="outline" className={cn('text-xs', severityConfig[incident.severity].text)}>
                    {severityConfig[incident.severity].label}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {statusConfig[incident.status]}
                  </Badge>
                </div>
                <p className="font-semibold mt-2">{incident.title}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Started {incident.startedAt}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertTriangle className="w-4 h-4" />
                <span>{incident.affectedServices.length} services affected</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{incident.owner}</span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {incident.affectedServices.map((service) => (
                <Badge key={service} variant="outline" className="text-xs">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors text-sm font-medium">
        View All Incidents →
      </button>
    </Card>
  )
}

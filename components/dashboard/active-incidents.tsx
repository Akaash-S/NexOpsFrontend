'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Clock, Users, Link as LinkIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockIncidents } from '@/lib/mock-data'

interface DisplayIncident {
  id: string
  title: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: 'investigating' | 'monitoring' | 'resolved'
  duration: string
  affectedServices: number
  owner: string
  startedAt: string
}

const severityConfig = {
  critical: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Critical' },
  high: { bg: 'bg-warning/10', text: 'text-warning', label: 'High' },
  medium: { bg: 'bg-accent/10', text: 'text-accent', label: 'Medium' },
  low: { bg: 'bg-info/10', text: 'text-info', label: 'Low' },
}

const statusConfig = {
  investigating: 'Investigating',
  monitoring: 'Monitoring',
  resolved: 'Resolved',
}

function calculateDuration(startedAt: string, endedAt?: string): string {
  const start = new Date(startedAt);
  const end = endedAt ? new Date(endedAt) : new Date();
  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 60) return `${diffMins}m`;
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function getDisplayIncidents(): DisplayIncident[] {
  return mockIncidents.slice(0, 3).map((incident) => ({
    id: incident.id,
    title: incident.title,
    severity: incident.severity,
    status: incident.status,
    duration: calculateDuration(incident.startedAt, incident.resolvedAt),
    affectedServices: incident.affectedUsers,
    owner: incident.assignee,
    startedAt: new Date(incident.startedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  }));
}

export function ActiveIncidents() {
  const incidents = getDisplayIncidents();
  const activeCount = mockIncidents.filter(i => i.status !== 'resolved').length;
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Active Incidents
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{activeCount} incidents active</p>
        </div>
      </div>

      <div className="space-y-4">
        {incidents.map((incident, index) => {
          const mockIncident = mockIncidents[index];
          return (
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
                  <span>{incident.affectedServices} users affected</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{incident.owner}</span>
                </div>
              </div>

              <div className="mt-3">
                <Badge variant="outline" className="text-xs">
                  <LinkIcon className="w-3 h-3 mr-1" />
                  {mockIncident.service}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-6 p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors text-sm font-medium">
        View All Incidents →
      </button>
    </Card>
  )
}

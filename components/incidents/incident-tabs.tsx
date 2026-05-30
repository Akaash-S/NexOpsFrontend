'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface Incident {
  id: string
  title: string
  severity: 'critical' | 'high' | 'medium'
  status: 'open' | 'investigating' | 'resolved'
  startTime: string
  duration: string
  lead: string
  affectedServices: string[]
  affectedClusters: string[]
  rootCause: string
  impactedUsers: number
}

interface IncidentTabsProps {
  incidents: Incident[]
  selectedIncident: string | null
  onSelectIncident: (id: string) => void
  onStatusFilterChange: (status: 'all' | 'open' | 'investigating' | 'resolved') => void
}

const SEVERITY_CONFIG = {
  critical: { bg: 'bg-destructive/10', text: 'text-destructive' },
  high: { bg: 'bg-warning/10', text: 'text-warning' },
  medium: { bg: 'bg-info/10', text: 'text-info' },
}

export function IncidentTabs({
  incidents,
  selectedIncident,
  onSelectIncident,
  onStatusFilterChange,
}: IncidentTabsProps) {
  return (
    <Tabs defaultValue="open">
      <TabsList>
        <TabsTrigger value="open" onClick={() => onStatusFilterChange('open')}>
          Open
        </TabsTrigger>
        <TabsTrigger value="investigating" onClick={() => onStatusFilterChange('investigating')}>
          Investigating
        </TabsTrigger>
        <TabsTrigger value="resolved" onClick={() => onStatusFilterChange('resolved')}>
          Resolved
        </TabsTrigger>
      </TabsList>

      <TabsContent value="open" className="space-y-3 mt-6">
        {incidents
          .filter((i) => i.status === 'open')
          .map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              selected={selectedIncident === incident.id}
              onSelect={onSelectIncident}
            />
          ))}
      </TabsContent>

      <TabsContent value="investigating" className="space-y-3 mt-6">
        {incidents
          .filter((i) => i.status === 'investigating')
          .map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              selected={selectedIncident === incident.id}
              onSelect={onSelectIncident}
            />
          ))}
      </TabsContent>

      <TabsContent value="resolved" className="space-y-3 mt-6">
        {incidents
          .filter((i) => i.status === 'resolved')
          .map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              selected={selectedIncident === incident.id}
              onSelect={onSelectIncident}
            />
          ))}
      </TabsContent>
    </Tabs>
  )
}

function IncidentCard({
  incident,
  selected,
  onSelect,
}: {
  incident: Incident
  selected: boolean
  onSelect: (id: string) => void
}) {
  const config = SEVERITY_CONFIG[incident.severity]
  const Icon = incident.status === 'resolved' ? CheckCircle2 : AlertCircle

  return (
    <Card
      className={`p-4 cursor-pointer transition-all hover:border-primary ${
        selected ? 'border-primary ring-1 ring-primary' : ''
      }`}
      onClick={() => onSelect(incident.id)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-2">
            <Icon className={`w-5 h-5 ${config.text} flex-shrink-0 mt-0.5`} />
            <div className="flex-1">
              <h3 className="font-semibold">{incident.title}</h3>
              <p className="text-sm text-muted-foreground">Lead: {incident.lead}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {incident.affectedServices.map((service) => (
              <Badge key={service} variant="outline" className="text-xs">
                {service}
              </Badge>
            ))}
          </div>
        </div>

        <div className="text-right space-y-2">
          <Badge variant="secondary" className={`${config.bg} ${config.text}`}>
            {incident.severity}
          </Badge>
          <div className="text-sm">
            <div className="font-semibold">{incident.duration}</div>
            <div className="text-xs text-muted-foreground">{incident.startTime}</div>
          </div>
          <div className="text-xs text-muted-foreground">
            {incident.impactedUsers.toLocaleString()} users
          </div>
        </div>
      </div>
    </Card>
  )
}

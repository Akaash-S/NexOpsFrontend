'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, CheckCircle2, FileText, ChevronRight, Clock, CheckCheck, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PostmortemEditor } from './postmortem-editor'

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
  low: { bg: 'bg-muted text-muted-foreground', text: 'text-muted-foreground' },
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
        <TabsTrigger value="postmortems" onClick={() => onStatusFilterChange('resolved')}>
          Postmortems
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

      <TabsContent value="postmortems" className="space-y-3 mt-6">
        <PostmortemsTab incidents={incidents} />
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
  const config = SEVERITY_CONFIG[incident.severity] || SEVERITY_CONFIG.medium
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

function PostmortemsTab({ incidents }: { incidents: Incident[] }) {
  const [editingIncident, setEditingIncident] = useState<{ id: string; title: string } | null>(null)

  const resolved = incidents.filter((i) => i.status === 'resolved')

  if (resolved.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-border rounded-lg bg-card/20">
        <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
        <h4 className="font-semibold text-sm text-foreground">No Resolved Incidents Yet</h4>
        <p className="text-xs text-muted-foreground mt-1">
          Postmortems can be created for resolved incidents. When an incident is marked resolved, its postmortem draft is auto-generated here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {resolved.map((inc) => (
        <Card key={inc.id} className="p-4 flex items-center justify-between gap-4 hover:border-primary/50 transition-colors">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              <h4 className="font-semibold text-sm text-foreground truncate">{inc.title}</h4>
              <Badge variant="outline" className="text-[10px] uppercase font-mono bg-muted/30">
                Resolved ({inc.duration})
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
              <span>Lead: <strong className="text-foreground">{inc.lead}</strong></span>
              <span>·</span>
              <span>Root Cause: <strong className="text-foreground font-mono">{inc.rootCause}</strong></span>
              <span>·</span>
              <span>Resolved at: {inc.startTime}</span>
            </p>

            <div className="flex flex-wrap gap-1 mt-2">
              {inc.affectedServices.map((service) => (
                <Badge key={service} variant="secondary" className="text-[10px]">
                  {service}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditingIncident({ id: inc.id, title: inc.title })}
              className="gap-1.5 text-xs"
            >
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span>Edit Postmortem</span>
            </Button>
          </div>
        </Card>
      ))}

      {editingIncident && (
        <PostmortemEditor
          incidentId={editingIncident.id}
          incidentTitle={editingIncident.title}
          open={!!editingIncident}
          onClose={() => setEditingIncident(null)}
        />
      )}
    </div>
  )
}

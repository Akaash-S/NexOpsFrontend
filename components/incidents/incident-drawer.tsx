'use client'

import { useState, useEffect } from 'react'
import { X, Activity, MessageSquare, Plus, GitBranch, ArrowRight, AlertCircle, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

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
  relatedDeployments: string[]
  relatedAlerts: number
  timeline: { time: string; event: string; status: 'info' | 'warning' | 'success' }[]
  resolutionNotes?: string
}

interface IncidentDrawerProps {
  incident: Incident
  onClose: () => void
}

export function IncidentDrawer({ incident, onClose }: IncidentDrawerProps) {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn("fixed inset-0 z-40 bg-black/50 transition-opacity duration-300", isAnimatingOut ? "opacity-0" : "opacity-100")} 
        onClick={handleClose} 
      />

      {/* Drawer */}
      <div 
        className={cn(
          "fixed right-0 top-16 h-[calc(100vh-64px)] w-[600px] bg-background border-l border-border z-50 flex flex-col transform transition-transform duration-300",
          isAnimatingOut ? "translate-x-full" : "translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="font-semibold text-lg">{incident.title}</h2>
              <Badge variant="outline" className="font-mono">{incident.id}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Started {incident.startTime}</span>
              <span>•</span>
              <span>Lead: {incident.lead}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col">
          <TabsList className="rounded-none border-b border-border px-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 min-h-0">
            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6 space-y-6">
              {/* Status */}
              <div>
                <h3 className="font-semibold mb-3">Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <span className="text-sm">Severity</span>
                    <Badge
                      variant="secondary"
                      className={`${
                        incident.severity === 'critical'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-warning/10 text-warning'
                      }`}
                    >
                      {incident.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <span className="text-sm">Status</span>
                    <Badge variant="outline" className="capitalize">
                      {incident.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Impact */}
              <div>
                <h3 className="font-semibold mb-3">Impact</h3>
                <div className="space-y-2">
                  <Card className="p-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{incident.impactedUsers.toLocaleString()} users affected</span>
                    </div>
                  </Card>
                  <Card className="p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{incident.duration} duration</span>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Affected Services */}
              <div>
                <h3 className="font-semibold mb-3">Affected Services</h3>
                <div className="flex flex-wrap gap-2">
                  {incident.affectedServices.map((service) => (
                    <Badge key={service} variant="outline">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Affected Clusters */}
              <div>
                <h3 className="font-semibold mb-3">Affected Clusters</h3>
                <div className="flex flex-wrap gap-2">
                  {incident.affectedClusters.map((cluster) => (
                    <Badge key={cluster} variant="outline">
                      {cluster}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="p-6 space-y-4">
              {incident.timeline.map((entry, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="text-xs text-muted-foreground w-14 font-mono flex-shrink-0">
                    {entry.time}
                  </div>
                  <div className="flex-1">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm">{entry.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="p-6 space-y-6">
              {/* Root Cause */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Root Cause
                </h3>
                <Card className="p-4 bg-muted/50">
                  <p className="text-sm">{incident.rootCause}</p>
                </Card>
              </div>

              {/* Resolution Notes */}
              {incident.resolutionNotes && (
                <div>
                  <h3 className="font-semibold mb-3">Resolution Notes</h3>
                  <Card className="p-4 bg-muted/50">
                    <p className="text-sm">{incident.resolutionNotes}</p>
                  </Card>
                </div>
              )}

              {/* Related Items */}
              <div>
                <h3 className="font-semibold mb-3">Related Items</h3>
                <div className="space-y-2">
                  <Card className="p-3">
                    <p className="text-sm">
                      <strong>Related Alerts:</strong> {incident.relatedAlerts}
                    </p>
                  </Card>
                  <Card className="p-3">
                    <p className="text-sm">
                      <strong>Related Deployments:</strong>{' '}
                      {incident.relatedDeployments.length > 0
                        ? incident.relatedDeployments.join(', ')
                        : 'None'}
                    </p>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </>
  )
}

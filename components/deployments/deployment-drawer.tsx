'use client'

import { X, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface Deployment {
  id: string
  service: string
  version: string
  environment: string
  status: 'success' | 'pending' | 'rollback' | 'failed'
  riskScore: number
  confidence: number
  deployedAt: string
  duration: string
  changesCount: number
  affectedServices: number
  blastRadius: string
  rollbackReady: boolean
}

interface DeploymentDrawerProps {
  deployment: Deployment
  onClose: () => void
}

const RELATED_INCIDENTS = [
  { id: 'inc-001', title: 'Increased error rate on API Gateway', severity: 'critical', duration: '12m' },
  { id: 'inc-002', title: 'Database connection pool exhausted', severity: 'high', duration: '5m' },
]

const RELATED_ALERTS = [
  { id: 'alert-001', type: 'CPU Usage', value: '82%', threshold: '80%', status: 'firing' },
  { id: 'alert-002', type: 'Memory', value: '67%', threshold: '75%', status: 'resolved' },
  { id: 'alert-003', type: 'Error Rate', value: '2.3%', threshold: '1%', status: 'firing' },
]

const TIMELINE = [
  { time: '14:35', event: 'Deployment completed', status: 'success' },
  { time: '14:32', event: 'Health checks passed', status: 'success' },
  { time: '14:28', event: 'Services started', status: 'success' },
  { time: '14:24', event: 'Deployment initiated', status: 'success' },
]

export function DeploymentDrawer({ deployment, onClose }: DeploymentDrawerProps) {
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-16 h-[calc(100vh-64px)] w-96 bg-background border-l border-border z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-semibold text-lg">{deployment.service}</h2>
            <p className="text-sm text-muted-foreground">{deployment.version}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Risk Analysis */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Risk Analysis
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Risk Score</span>
                    <span className="font-semibold">{deployment.riskScore}/100</span>
                  </div>
                  <Progress value={Math.min(deployment.riskScore * 2, 100)} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Deployment Confidence</span>
                    <span className="font-semibold">{deployment.confidence}%</span>
                  </div>
                  <Progress value={deployment.confidence} className="h-2" />
                </div>
                <Card className="p-3 bg-muted/50">
                  <p className="text-sm">
                    <strong>Blast Radius:</strong>{' '}
                    <Badge variant="outline" className="ml-2">
                      {deployment.blastRadius}
                    </Badge>
                  </p>
                </Card>
                <Card className="p-3 bg-muted/50">
                  <p className="text-sm">
                    <strong>Rollback Ready:</strong>{' '}
                    {deployment.rollbackReady ? (
                      <CheckCircle2 className="w-4 h-4 text-success inline-block ml-2" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-destructive inline-block ml-2" />
                    )}
                  </p>
                </Card>
              </div>
            </div>

            {/* Related Incidents */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                Related Incidents
              </h3>
              <div className="space-y-2">
                {RELATED_INCIDENTS.length > 0 ? (
                  RELATED_INCIDENTS.map((incident) => (
                    <div key={incident.id} className="p-3 bg-muted/50 rounded">
                      <p className="text-sm font-medium">{incident.title}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className={`text-xs ${incident.severity === 'critical' ? 'border-destructive text-destructive' : 'border-warning text-warning'}`}>
                          {incident.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{incident.duration}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No related incidents</p>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="font-semibold mb-4">Deployment Timeline</h3>
              <div className="space-y-2">
                {TIMELINE.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="text-xs text-muted-foreground w-12">{item.time}</div>
                    <div className="flex-1 pb-3">
                      <p className="text-sm">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Alerts */}
            <div>
              <h3 className="font-semibold mb-4">Related Alerts</h3>
              <div className="space-y-2">
                {RELATED_ALERTS.map((alert) => (
                  <div key={alert.id} className="p-3 bg-muted/50 rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{alert.type}</span>
                      <Badge variant="outline" className={alert.status === 'firing' ? 'bg-destructive/10 text-destructive border-destructive' : 'bg-success/10 text-success border-success'}>
                        {alert.value}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}

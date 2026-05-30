'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, AlertTriangle, TrendingUp, Zap, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Cluster {
  id: string
  name: string
  health: number
  status: 'healthy' | 'warning' | 'critical'
  nodes: number
  services: number
  incidents: number
  capacity: number
  version: string
  criticalDeps: number
}

interface ClusterIntelligenceDrawerProps {
  cluster: Cluster
  onClose: () => void
}

const healthData = [
  { time: '00:00', health: 92 },
  { time: '04:00', health: 91 },
  { time: '08:00', health: 94 },
  { time: '12:00', health: 96 },
  { time: '16:00', health: 95 },
  { time: '20:00', health: 98 },
  { time: '24:00', health: 98 },
]

const insights = [
  {
    type: 'warning',
    title: 'High memory pressure detected',
    description: 'Node pool us-east-1a showing 87% memory utilization',
    action: 'Review & Scale',
  },
  {
    type: 'info',
    title: '3 services need updates',
    description: 'Deprecated library versions detected in 3 services',
    action: 'View Details',
  },
  {
    type: 'success',
    title: 'All critical dependencies healthy',
    description: 'Database clusters and message queues operating nominally',
    action: 'View Graph',
  },
]

export function ClusterIntelligenceDrawer({ cluster, onClose }: ClusterIntelligenceDrawerProps) {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    if (!isOpen) {
      onClose()
    }
  }, [isOpen, onClose])

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-background border-l border-border shadow-xl transform transition-transform duration-300 z-50 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border p-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground">{cluster.name}</h2>
            <p className="text-xs text-muted-foreground">Intelligence Dashboard</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Health Score</p>
              <p className="text-2xl font-bold text-success mt-1">{cluster.health}%</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Incidents</p>
              <p className={`text-2xl font-bold mt-1 ${cluster.incidents > 0 ? 'text-destructive' : 'text-success'}`}>
                {cluster.incidents}
              </p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Capacity</p>
              <p className="text-2xl font-bold text-foreground mt-1">{cluster.capacity}%</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Critical Deps</p>
              <p className="text-2xl font-bold text-warning mt-1">{cluster.criticalDeps}</p>
            </Card>
          </div>

          {/* Health Trend Chart */}
          <div className="border border-border rounded-lg p-3">
            <h3 className="text-sm font-semibold text-foreground mb-3">24-Hour Health Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="time"
                  stroke="var(--muted-foreground)"
                  style={{ fontSize: '11px' }}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  style={{ fontSize: '11px' }}
                  domain={[80, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="health"
                  stroke="var(--primary)"
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Insights */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">AI Insights</h3>
            <div className="space-y-2">
              {insights.map((insight, idx) => (
                <Card key={idx} className="p-3 border-l-2 border-l-primary">
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {insight.type === 'warning' && (
                        <AlertTriangle className="w-4 h-4 text-warning" />
                      )}
                      {insight.type === 'info' && (
                        <Zap className="w-4 h-4 text-primary" />
                      )}
                      {insight.type === 'success' && (
                        <TrendingUp className="w-4 h-4 text-success" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{insight.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{insight.description}</p>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 mt-2 text-xs"
                      >
                        {insight.action} →
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Recommendations</h3>
            <div className="space-y-2">
              <Card className="p-3">
                <p className="text-sm text-foreground">Scale nodes in us-east-1a</p>
                <p className="text-xs text-muted-foreground mt-1">Memory pressure: 87%</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline">Dismiss</Button>
                  <Button size="sm">Execute</Button>
                </div>
              </Card>
              <Card className="p-3">
                <p className="text-sm text-foreground">Update Kubernetes version</p>
                <p className="text-xs text-muted-foreground mt-1">Current: v1.27.5 → Available: v1.28.2</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline">Dismiss</Button>
                  <Button size="sm">Schedule</Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

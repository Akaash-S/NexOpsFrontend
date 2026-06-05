'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, AlertTriangle, TrendingUp, Zap } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAppState } from '@/lib/hooks/use-app-state'

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

const initialInsights = [
  {
    id: 'insight-1',
    type: 'warning',
    title: 'High memory pressure detected',
    description: 'Node pool us-east-1a showing 87% memory utilization',
    action: 'Review & Scale',
  },
  {
    id: 'insight-2',
    type: 'info',
    title: '3 services need updates',
    description: 'Deprecated library versions detected in 3 services',
    action: 'View Details',
  },
  {
    id: 'insight-3',
    type: 'success',
    title: 'All critical dependencies healthy',
    description: 'Database clusters and message queues operating nominally',
    action: 'View Graph',
  },
]

const initialRecommendations = [
  {
    id: 'rec-1',
    title: 'Scale nodes in us-east-1a',
    reason: 'Memory pressure: 87%',
    actionText: 'Execute'
  },
  {
    id: 'rec-2',
    title: 'Update Kubernetes version',
    reason: 'Current: v1.27.5 → Available: v1.28.2',
    actionText: 'Schedule'
  }
]

export function ClusterIntelligenceDrawer({ cluster, onClose }: ClusterIntelligenceDrawerProps) {
  const [isOpen, setIsOpen] = useState(true)
  const { addNotification } = useAppState()

  const [activeInsights, setActiveInsights] = useState(initialInsights)
  const [activeRecommendations, setActiveRecommendations] = useState(initialRecommendations)

  useEffect(() => {
    if (!isOpen) {
      setTimeout(onClose, 300); // Wait for transition
    }
  }, [isOpen, onClose])

  const handleInsightAction = (insightId: string, title: string) => {
    addNotification({
      title: 'Opening Insight',
      description: `Viewing details for: ${title}`,
      type: 'info'
    })
    setActiveInsights((prev) => prev.filter(i => i.id !== insightId))
  }

  const handleRecommendationAction = (recId: string, title: string, isDismiss: boolean = false) => {
    if (isDismiss) {
      setActiveRecommendations((prev) => prev.filter(r => r.id !== recId))
      return;
    }

    addNotification({
      title: 'Action Initiated',
      description: `Started: ${title}`,
      type: 'success'
    })
    setActiveRecommendations((prev) => prev.filter(r => r.id !== recId))
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setIsOpen(false)}
      />

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
          {activeInsights.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">AI Insights</h3>
              <div className="space-y-2">
                {activeInsights.map((insight) => (
                  <Card key={insight.id} className="p-3 border-l-2 border-l-primary">
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
                          onClick={() => handleInsightAction(insight.id, insight.title)}
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
          )}

          {/* Recommendations */}
          {activeRecommendations.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Recommendations</h3>
              <div className="space-y-2">
                {activeRecommendations.map(rec => (
                  <Card key={rec.id} className="p-3">
                    <p className="text-sm text-foreground">{rec.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" onClick={() => handleRecommendationAction(rec.id, rec.title, true)}>Dismiss</Button>
                      <Button size="sm" onClick={() => handleRecommendationAction(rec.id, rec.title, false)}>{rec.actionText}</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

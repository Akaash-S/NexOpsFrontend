'use client'

import { X, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

interface Pipeline {
  id: string
  name: string
  repository: string
  status: 'healthy' | 'warning' | 'critical'
  successRate: number
  failureRate: number
  avgDuration: string
  lastRun: string
  runCount30d: number
  avgFailureTime: string
  reliability: number
}

interface PipelineDrawerProps {
  pipeline: Pipeline
  onClose: () => void
}

const EXECUTION_HISTORY = [
  { date: 'Today', time: '14:32', status: 'success', duration: '8m 24s' },
  { date: 'Today', time: '13:45', status: 'success', duration: '8m 18s' },
  { date: 'Today', time: '12:15', status: 'failed', duration: '2m 45s' },
  { date: 'Today', time: '11:30', status: 'success', duration: '8m 35s' },
  { date: 'Yesterday', time: '18:22', status: 'success', duration: '8m 20s' },
]

const RELIABILITY_TREND = [
  { week: 'W1', rate: 98 },
  { week: 'W2', rate: 96 },
  { week: 'W3', rate: 91 },
  { week: 'W4', rate: 98 },
]

const FAILURE_PATTERNS = [
  { pattern: 'Timeout in build stage', count: 3, lastSeen: '2 days ago' },
  { pattern: 'Integration test flakiness', count: 2, lastSeen: '5 days ago' },
  { pattern: 'Deployment timeout', count: 1, lastSeen: '1 week ago' },
]

const RECOMMENDATIONS = [
  {
    issue: 'High variance in build times',
    action: 'Implement parallel test execution',
    impact: 'Could reduce avg time by 30%',
  },
  {
    issue: 'Integration test flakiness',
    action: 'Add retry logic with exponential backoff',
    impact: 'Could improve reliability by 5%',
  },
  {
    issue: 'Dependency bottleneck',
    action: 'Cache external dependencies',
    impact: 'Could reduce avg time by 20%',
  },
]

export function PipelineDrawer({ pipeline, onClose }: PipelineDrawerProps) {
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
          "fixed right-0 top-16 h-[calc(100vh-64px)] w-96 bg-background border-l border-border z-50 flex flex-col transform transition-transform duration-300",
          isAnimatingOut ? "translate-x-full" : "translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-semibold text-lg">{pipeline.name}</h2>
            <p className="text-sm text-muted-foreground">{pipeline.repository}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6 space-y-6">
            {/* Key Metrics */}
            <div>
              <h3 className="font-semibold mb-4">Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <span className="text-sm">Success Rate</span>
                  <span className="font-semibold">{pipeline.successRate}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <span className="text-sm">Avg Duration</span>
                  <span className="font-semibold">{pipeline.avgDuration}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <span className="text-sm">Reliability</span>
                  <span className="font-semibold">{pipeline.reliability}%</span>
                </div>
              </div>
            </div>

            {/* Reliability Trend */}
            <div>
              <h3 className="font-semibold mb-4">Reliability Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={RELIABILITY_TREND}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Failure Patterns */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                Failure Patterns
              </h3>
              <div className="space-y-2">
                {FAILURE_PATTERNS.map((pattern) => (
                  <div key={pattern.pattern} className="p-3 bg-muted/50 rounded">
                    <p className="text-sm font-medium">{pattern.pattern}</p>
                    <p className="text-xs text-muted-foreground">Occurred {pattern.count}x ({pattern.lastSeen})</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Execution History */}
            <div>
              <h3 className="font-semibold mb-4">Recent Executions</h3>
              <div className="space-y-2">
                {EXECUTION_HISTORY.map((exec, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div>
                      <p className="text-sm font-medium">{exec.date} {exec.time}</p>
                      <p className="text-xs text-muted-foreground">{exec.duration}</p>
                    </div>
                    {exec.status === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="font-semibold mb-4">Recommendations</h3>
              <div className="space-y-3">
                {RECOMMENDATIONS.map((rec, idx) => (
                  <Card key={idx} className="p-3">
                    <p className="text-sm font-medium">{rec.issue}</p>
                    <p className="text-xs text-muted-foreground mt-1">Action: {rec.action}</p>
                    <p className="text-xs text-success mt-1">Impact: {rec.impact}</p>
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

'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, AlertCircle, TrendingDown, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Recommendation {
  id: string
  title: string
  issue: string
  impact: 'critical' | 'high' | 'medium' | 'low'
  confidence: number
  suggestedOwner?: string
  estimatedOutcome: string
  action: string
  relatedServices: string[]
}

const recommendations: Recommendation[] = [
  {
    id: 'REC-001',
    title: 'Rollback Auth Service deployment',
    issue: 'Auth Service v1.9.1 is causing 3.2% of requests to fail with 500 errors',
    impact: 'critical',
    confidence: 98,
    suggestedOwner: 'Sarah Chen',
    estimatedOutcome: 'Reduce API error rate from 2.1% to 0.3%',
    action: 'Rollback to v1.9.0',
    relatedServices: ['API Gateway', 'Auth Service', 'User Service', 'Payment Service'],
  },
  {
    id: 'REC-002',
    title: 'Apply security patch for log4j vulnerability',
    issue: 'Critical CVE-2024-1234 detected in 4 services running vulnerable log4j versions',
    impact: 'critical',
    confidence: 100,
    suggestedOwner: 'Marcus Johnson',
    estimatedOutcome: 'Eliminate exposure to remote code execution vulnerability',
    action: 'Apply patch and redeploy',
    relatedServices: ['Auth Service', 'User Service', 'Payment Service', 'Admin Panel'],
  },
  {
    id: 'REC-003',
    title: 'Scale Database connection pool',
    issue: 'Database connection pool at 87% capacity, approaching exhaustion threshold',
    impact: 'high',
    confidence: 92,
    suggestedOwner: 'Alex Rodriguez',
    estimatedOutcome: 'Prevent connection timeouts and improve latency by 15%',
    action: 'Increase max_connections from 500 to 750',
    relatedServices: ['Database Cluster'],
  },
  {
    id: 'REC-004',
    title: 'Investigate API Gateway latency spike',
    issue: 'P95 latency increased by 240% in last 30 minutes, still investigating root cause',
    impact: 'high',
    confidence: 78,
    suggestedOwner: 'Platform Team',
    estimatedOutcome: 'Identify and resolve performance bottleneck',
    action: 'Enable detailed tracing and analyze traces',
    relatedServices: ['API Gateway', 'Payment Service', 'Cache Service'],
  },
  {
    id: 'REC-005',
    title: 'Eliminate single point of failure',
    issue: 'Auth Service has no replica - outage affects all downstream services',
    impact: 'high',
    confidence: 88,
    suggestedOwner: 'Infrastructure Team',
    estimatedOutcome: 'Reduce critical incident risk by 65%',
    action: 'Deploy secondary replica with active-active configuration',
    relatedServices: ['Auth Service'],
  },
  {
    id: 'REC-006',
    title: 'Update stale dependency',
    issue: 'Service mesh using deprecated Envoy 1.24, latest is 1.28 with 12 security fixes',
    impact: 'medium',
    confidence: 85,
    suggestedOwner: 'DevOps Team',
    estimatedOutcome: 'Gain improved performance and security patches',
    action: 'Schedule upgrade during maintenance window',
    relatedServices: ['All Services'],
  },
]

const impactConfig = {
  critical: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Critical' },
  high: { bg: 'bg-warning/10', text: 'text-warning', label: 'High' },
  medium: { bg: 'bg-accent/10', text: 'text-accent', label: 'Medium' },
  low: { bg: 'bg-success/10', text: 'text-success', label: 'Low' },
}

function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn(
            'h-full transition-all',
            value >= 90 ? 'bg-success' : value >= 75 ? 'bg-warning' : 'bg-accent'
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-muted-foreground w-10 text-right">{value}%</span>
    </div>
  )
}

export function Recommendations() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Recommended Actions
          </h3>
          <p className="text-sm text-muted-foreground mt-1">AI-powered suggestions for next steps</p>
        </div>
        <Badge variant="default" className="bg-destructive">
          {recommendations.filter(r => r.impact === 'critical').length} Critical
        </Badge>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={cn(
              'p-4 rounded-lg border-2 transition-colors cursor-pointer hover:border-primary/50',
              impactConfig[rec.impact].bg,
              'border-current border-opacity-20'
            )}
          >
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className={cn('w-5 h-5 flex-shrink-0 mt-0.5', impactConfig[rec.impact].text)} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{rec.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{rec.issue}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4 ml-8">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">Confidence Score</p>
                <ConfidenceBar value={rec.confidence} />
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">Estimated Outcome</p>
                <p className="text-sm">{rec.estimatedOutcome}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Action</p>
                  <p className="text-sm font-medium">{rec.action}</p>
                </div>
                {rec.suggestedOwner && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Suggested Owner
                    </p>
                    <p className="text-sm font-medium">{rec.suggestedOwner}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Related Services</p>
                <div className="flex flex-wrap gap-2">
                  {rec.relatedServices.map((service) => (
                    <Badge key={service} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-8 pt-3 border-t border-current border-opacity-20">
              <button className="flex-1 px-3 py-2 rounded text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                Approve & Execute
              </button>
              <button className="flex-1 px-3 py-2 rounded text-xs font-semibold border border-current border-opacity-40 hover:bg-current hover:bg-opacity-5 transition-colors">
                Review & Schedule
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors text-sm font-medium">
        View All Recommendations →
      </button>
    </Card>
  )
}

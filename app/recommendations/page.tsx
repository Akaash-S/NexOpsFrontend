'use client'

import { useState } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertTriangle, TrendingUp, Zap } from 'lucide-react'

const RECOMMENDATIONS = [
  {
    id: 'rec-001',
    priority: 'critical',
    category: 'Performance',
    issue: 'High API Gateway latency (p99: 850ms)',
    action: 'Implement request caching and CDN',
    impact: 'Could reduce latency by 40-60%',
    confidence: 98,
    estimatedSavings: '$12,000/month',
    affectedServices: ['api-gateway', 'web-app'],
    owner: 'Platform Team',
    effort: 'medium',
  },
  {
    id: 'rec-002',
    priority: 'high',
    category: 'Reliability',
    issue: 'Database connection pool exhaustion',
    action: 'Increase pool size from 50 to 100 connections',
    impact: 'Reduce timeout errors by 85%',
    confidence: 95,
    estimatedSavings: 'Prevent 1-2 outages/month',
    affectedServices: ['database', 'api-gateway'],
    owner: 'Infrastructure Team',
    effort: 'low',
  },
  {
    id: 'rec-003',
    priority: 'high',
    category: 'Cost',
    issue: 'Idle compute resources in non-prod',
    action: 'Implement auto-shutdown for non-prod clusters',
    impact: 'Save 30% on compute costs',
    confidence: 92,
    estimatedSavings: '$8,500/month',
    affectedServices: ['staging', 'dev'],
    owner: 'Platform Team',
    effort: 'low',
  },
  {
    id: 'rec-004',
    priority: 'medium',
    category: 'Security',
    issue: 'Outdated dependencies in search service',
    action: 'Update to latest versions with security patches',
    impact: 'Fix 3 CVEs with CVSS > 7.0',
    confidence: 100,
    estimatedSavings: 'Risk reduction',
    affectedServices: ['search-service'],
    owner: 'Search Team',
    effort: 'low',
  },
  {
    id: 'rec-005',
    priority: 'medium',
    category: 'Observability',
    issue: 'Missing traces in notification service',
    action: 'Implement distributed tracing',
    impact: 'Enable root cause analysis for 90% of issues',
    confidence: 88,
    estimatedSavings: '4 hours/incident investigation',
    affectedServices: ['notification-service'],
    owner: 'DevOps Team',
    effort: 'high',
  },
]

const PRIORITY_CONFIG = {
  critical: { bg: 'bg-destructive/10', text: 'text-destructive', icon: AlertTriangle },
  high: { bg: 'bg-warning/10', text: 'text-warning', icon: TrendingUp },
  medium: { bg: 'bg-info/10', text: 'text-info', icon: Zap },
}

export default function RecommendationsPage() {
  const [selectedRec, setSelectedRec] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  const filteredRecs = RECOMMENDATIONS.filter(
    (rec) => priorityFilter === 'all' || rec.priority === priorityFilter
  )

  const criticalCount = RECOMMENDATIONS.filter((r) => r.priority === 'critical').length
  const potentialSavings = '$28,500/month'

  return (
    <>
      
      <>
        <PageContent>
          <PageHeader
            title="Recommendations"
            description="AI-powered decision support system with actionable intelligence prioritized by impact and confidence"
          />

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Active Recommendations</div>
              <div className="text-2xl font-bold">{RECOMMENDATIONS.length}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Critical Priority</div>
              <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Potential Savings</div>
              <div className="text-2xl font-bold text-success">{potentialSavings}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Avg Confidence</div>
              <div className="text-2xl font-bold">93%</div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-8">
            <h3 className="font-semibold mb-3">Filter by Priority</h3>
            <div className="flex gap-2">
              {['all', 'critical', 'high', 'medium'].map((priority) => (
                <Button
                  key={priority}
                  variant={priorityFilter === priority ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriorityFilter(priority)}
                  className="capitalize"
                >
                  {priority}
                </Button>
              ))}
            </div>
          </Card>

          {/* Recommendations Grid */}
          <div className="space-y-4">
            {filteredRecs.map((rec) => {
              const config = PRIORITY_CONFIG[rec.priority as keyof typeof PRIORITY_CONFIG]
              const Icon = config.icon

              return (
                <Card
                  key={rec.id}
                  className={`p-6 cursor-pointer transition-all hover:border-primary hover:ring-1 hover:ring-primary ${
                    selectedRec === rec.id ? 'border-primary ring-1 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedRec(rec.id)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Icon className={`w-5 h-5 ${config.text} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{rec.issue}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{rec.category}</p>
                      </div>
                    </div>
                    <Badge className={`${config.bg} ${config.text}`}>
                      {rec.priority}
                    </Badge>
                  </div>

                  {/* Action & Impact */}
                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <div className="mb-3">
                      <p className="text-sm font-semibold mb-1">Recommended Action</p>
                      <p className="text-sm">{rec.action}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1">Expected Outcome</p>
                      <p className="text-sm text-success">{rec.impact}</p>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Confidence</div>
                      <div className="font-semibold">{rec.confidence}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Savings</div>
                      <div className="font-semibold text-success text-sm">{rec.estimatedSavings}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Effort</div>
                      <div className="font-semibold capitalize text-sm">{rec.effort}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Owner</div>
                      <div className="font-semibold text-sm">{rec.owner}</div>
                    </div>
                  </div>

                  {/* Services & Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex gap-2">
                      {rec.affectedServices.map((service) => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                      <Button size="sm">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Implement
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </PageContent>
      </>
    </>
  )
}

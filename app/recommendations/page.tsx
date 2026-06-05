'use client'

import { useState, useMemo } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { RecommendationFilters } from '@/components/recommendations/recommendation-filters'
import { ImplementRecommendationDrawer } from '@/components/recommendations/implement-recommendation-drawer'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertTriangle, TrendingUp, Zap } from 'lucide-react'
import { RECOMMENDATIONS_DATA } from '@/lib/mock-data'
import { useAppState } from '@/lib/hooks/use-app-state'

const PRIORITY_CONFIG = {
  critical: { bg: 'bg-destructive/10', text: 'text-destructive', icon: AlertTriangle, border: 'border-destructive/20' },
  high: { bg: 'bg-warning/10', text: 'text-warning', icon: TrendingUp, border: 'border-warning/20' },
  medium: { bg: 'bg-info/10', text: 'text-info', icon: Zap, border: 'border-info/20' },
  low: { bg: 'bg-success/10', text: 'text-success', icon: CheckCircle2, border: 'border-success/20' },
}

export default function RecommendationsPage() {
  const { setImplementRecOpen } = useAppState()
  const [recommendations, setRecommendations] = useState<any[]>(RECOMMENDATIONS_DATA)

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    priority: 'all',
    effort: 'all',
    sortBy: 'confidence-desc',
  })

  // Filter and Sort Logic
  const filteredAndSortedRecs = useMemo(() => {
    return recommendations
      .filter((rec) => {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          rec.issue.toLowerCase().includes(searchLower) ||
          rec.action.toLowerCase().includes(searchLower) ||
          rec.category.toLowerCase().includes(searchLower)
          
        const matchesPriority = filters.priority === 'all' || rec.priority === filters.priority
        const matchesEffort = filters.effort === 'all' || rec.effort === filters.effort
        
        return matchesSearch && matchesPriority && matchesEffort
      })
      .sort((a, b) => {
        const priorityOrder: any = { critical: 4, high: 3, medium: 2, low: 1 }
        
        switch (filters.sortBy) {
          case 'confidence-desc':
            return b.confidence - a.confidence
          case 'confidence-asc':
            return a.confidence - b.confidence
          case 'savings-desc':
            // Simple string parse for mock data ($12,000/month -> 12000)
            const getSavings = (s: string) => parseInt(s.replace(/[^0-9]/g, '')) || 0
            return getSavings(b.estimatedSavings) - getSavings(a.estimatedSavings)
          case 'priority-desc':
            return priorityOrder[b.priority] - priorityOrder[a.priority]
          default:
            return 0
        }
      })
  }, [recommendations, filters])

  const criticalCount = recommendations.filter((r) => r.priority === 'critical').length
  const potentialSavings = '$28,500/month'

  const handleImplementationSuccess = (recId: string) => {
    // Optionally remove it from the list or mark it as implemented
    setRecommendations(prev => prev.filter(r => r.id !== recId))
  }

  return (
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
            <div className="text-2xl font-bold">{recommendations.length}</div>
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
        <RecommendationFilters filters={filters} setFilters={setFilters} />

        {/* Recommendations Grid */}
        <div className="space-y-4">
          {filteredAndSortedRecs.length > 0 ? (
            filteredAndSortedRecs.map((rec) => {
              const config = PRIORITY_CONFIG[rec.priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.low
              const Icon = config.icon

              return (
                <Card
                  key={rec.id}
                  className="p-6 transition-all hover:border-primary/50"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${config.bg}`}>
                        <Icon className={`w-5 h-5 ${config.text} flex-shrink-0`} />
                      </div>
                      <div className="flex-1 mt-0.5">
                        <h3 className="font-semibold text-lg">{rec.issue}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">{rec.category}</p>
                          <span className="text-muted-foreground text-xs">•</span>
                          <span className="text-sm text-muted-foreground">{rec.owner}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className={`${config.bg} ${config.text} ${config.border} capitalize`}>
                      {rec.priority} Priority
                    </Badge>
                  </div>

                  {/* Action & Impact */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recommended Action</div>
                      <p className="text-sm font-medium">{rec.action}</p>
                    </div>
                    <div className="bg-success/5 rounded-lg p-4 border border-success/20">
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-success">Expected Outcome</div>
                      <p className="text-sm font-medium text-success">{rec.impact}</p>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-4 mb-4 bg-muted/20 p-4 rounded-lg border border-border">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">AI Confidence</div>
                      <div className="font-semibold text-foreground">{rec.confidence}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">Estimated Savings</div>
                      <div className="font-semibold text-success">{rec.estimatedSavings}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">Implementation Effort</div>
                      <div className="font-semibold capitalize">{rec.effort}</div>
                    </div>
                  </div>

                  {/* Services & Actions */}
                  <div className="flex items-center justify-between pt-4 mt-2">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-muted-foreground mr-2 flex items-center">Affected:</span>
                      {rec.affectedServices.map((service: string) => (
                        <Badge key={service} variant="secondary" className="text-xs font-normal">
                          {service}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm">
                        View Analysis
                      </Button>
                      <Button size="sm" onClick={() => setImplementRecOpen(true, rec.id)}>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Implement
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })
          ) : (
            <div className="text-center p-12 text-muted-foreground border border-dashed rounded-lg bg-muted/20">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
              <p>No recommendations found matching your filters.</p>
            </div>
          )}
        </div>
      </PageContent>

      {/* Implement Wizard */}
      <ImplementRecommendationDrawer onSuccess={handleImplementationSuccess} />
    </>
  )
}

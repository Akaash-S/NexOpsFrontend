'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, AlertCircle, TrendingDown, Users } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { mockRecommendations } from '@/lib/mock-data'
import { useAppState } from '@/lib/hooks/use-app-state'

interface DisplayRecommendation {
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

// For display, we'll create some context around the mock recommendations
const createDisplayRecommendations = (): DisplayRecommendation[] => {
  return mockRecommendations.map((rec) => ({
    id: rec.id,
    title: rec.title,
    issue: rec.description,
    impact: rec.impact === 'high' ? 'high' : rec.impact === 'medium' ? 'medium' : 'low',
    confidence: rec.effort === 'low' ? 95 : rec.effort === 'medium' ? 85 : 75,
    suggestedOwner: undefined,
    estimatedOutcome: `Improve ${rec.category} by implementing ${rec.title.toLowerCase()}`,
    action: `Start implementation for ${rec.service}`,
    relatedServices: [rec.service],
  }));
};

const impactConfig = {
  critical: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Critical' },
  high: { bg: 'bg-warning/10', text: 'text-warning', label: 'High' },
  medium: { bg: 'bg-accent/10', text: 'text-accent', label: 'Medium' },
  low: { bg: 'bg-success/10', text: 'text-success', label: 'Low' },
  performance: { bg: 'bg-info/10', text: 'text-info', label: 'Performance' },
  reliability: { bg: 'bg-success/10', text: 'text-success', label: 'Reliability' },
  security: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Security' },
  cost: { bg: 'bg-warning/10', text: 'text-warning', label: 'Cost' },
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
  const [activeRecs, setActiveRecs] = useState<DisplayRecommendation[]>(() => createDisplayRecommendations().slice(0, 4));
  const { addNotification } = useAppState();

  const handleApprove = (e: React.MouseEvent, rec: DisplayRecommendation) => {
    e.preventDefault(); // prevent parent link click if this was wrapped
    addNotification({
      title: 'Executing Action',
      description: `Starting implementation for: ${rec.title}`,
      type: 'success'
    });
    // Remove from list
    setActiveRecs(prev => prev.filter(r => r.id !== rec.id));
  };

  const handleSchedule = (e: React.MouseEvent, rec: DisplayRecommendation) => {
    e.preventDefault();
    addNotification({
      title: 'Action Scheduled',
      description: `Scheduled review for: ${rec.title}`,
      type: 'info'
    });
    // Remove from list
    setActiveRecs(prev => prev.filter(r => r.id !== rec.id));
  };
  
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
        <Badge variant="default" className="bg-warning">
          {activeRecs.filter(r => r.impact === 'critical' || r.impact === 'high').length} Pending
        </Badge>
      </div>

      {activeRecs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Lightbulb className="w-8 h-8 mx-auto mb-3 opacity-20" />
          <p>No pending recommendations.</p>
          <p className="text-sm">Your infrastructure is fully optimized.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeRecs.map((rec) => (
            <div
              key={rec.id}
              className={cn(
                'p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50',
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
                <button 
                  onClick={(e) => handleApprove(e, rec)}
                  className="flex-1 px-3 py-2 rounded text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Approve & Execute
                </button>
                <button 
                  onClick={(e) => handleSchedule(e, rec)}
                  className="flex-1 px-3 py-2 rounded text-xs font-semibold border border-current border-opacity-40 hover:bg-current hover:bg-opacity-5 transition-colors"
                >
                  Review & Schedule
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link href="/recommendations" className="block text-center w-full mt-6 p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors text-sm font-medium">
        View All Recommendations →
      </Link>
    </Card>
  )
}

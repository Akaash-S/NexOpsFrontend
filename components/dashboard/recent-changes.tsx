'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Settings, AlertTriangle, Flame } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CHANGES_DATA } from '@/lib/mock-data'
import { getNodeById } from '@/lib/graph'

const typeConfig = {
  deployment: { icon: Package, label: 'Deploy', color: 'text-primary' },
  infrastructure: { icon: Settings, label: 'Infra', color: 'text-accent' },
}

function RiskPill({ score, basis }: { score: number; basis: string }) {
  const color =
    score >= 70 ? 'bg-destructive/10 text-destructive border-destructive/20' :
    score >= 40 ? 'bg-warning/10 text-warning border-warning/20' :
    'bg-success/10 text-success border-success/20'
  const label = score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low'

  return (
    <div className="mt-3 pt-3 border-t border-border/50">
      <div className="flex items-center gap-2 mb-1.5">
        <Flame className="w-3.5 h-3.5 text-warning flex-shrink-0" />
        <span className="text-xs font-semibold text-muted-foreground">Blast Radius</span>
        <Badge variant="outline" className={cn('text-xs ml-auto', color)}>
          {score} — {label} Risk
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground italic">{basis}</p>
    </div>
  )
}

export function RecentChanges() {
  const displayChanges = CHANGES_DATA.slice(0, 4)

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Recent Changes</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Deploy and infra change feed with blast radius and historical risk
        </p>
      </div>

      <div className="space-y-3">
        {displayChanges.map((change) => {
          const TypeIcon = (typeConfig[change.type as keyof typeof typeConfig] ?? typeConfig.deployment).icon
          const typeColor = (typeConfig[change.type as keyof typeof typeConfig] ?? typeConfig.deployment).color
          const blastRadius = (change as any).blastRadius
          const serviceName = (change as any).serviceName ?? change.service
          const directCount = blastRadius?.directServices?.length ?? 0
          const downstreamCount = blastRadius?.downstreamServices?.length ?? 0

          return (
            <div
              key={change.id}
              className={cn(
                'p-4 rounded-lg border border-border hover:border-primary/50 transition-colors',
                change.incidents > 0 && 'border-destructive/30 hover:border-destructive/50'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn('mt-0.5 flex-shrink-0', typeColor)}>
                  <TypeIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-sm">{serviceName}</span>
                    <span className="text-xs text-muted-foreground font-mono">{change.version}</span>
                    {change.incidents > 0 && (
                      <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20 gap-1">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        {change.incidents} incident
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">{change.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{(change as any).message}</p>

                  {/* Direct services affected — always visible */}
                  {blastRadius && directCount > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">Affects:</span>
                      {blastRadius.directServices.slice(0, 3).map((svc: string) => {
                        const node = getNodeById(svc)
                        return (
                          <Badge key={svc} variant="secondary" className="text-xs">
                            {node?.name ?? svc}
                          </Badge>
                        )
                      })}
                      {directCount > 3 && (
                        <span className="text-xs text-muted-foreground">+{directCount - 3} more</span>
                      )}
                      {downstreamCount > 0 && (
                        <span className="text-xs text-muted-foreground">
                          · {downstreamCount} downstream
                        </span>
                      )}
                    </div>
                  )}

                  {/* Risk score with basis text — always visible, never bare number */}
                  {blastRadius && (
                    <RiskPill score={blastRadius.riskScore} basis={blastRadius.riskBasis} />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Link
        href="/recent-changes"
        className="block text-center w-full mt-6 p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors text-sm font-medium"
      >
        View All Changes →
      </Link>
    </Card>
  )
}

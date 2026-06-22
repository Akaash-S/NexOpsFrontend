'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ScoreWithReasoningProps {
  score: number
  reasons: string[] | string
  variant?: 'match' | 'risk'
  label?: string
  className?: string
}

export function ScoreWithReasoning({
  score,
  reasons,
  variant = 'match',
  label,
  className,
}: ScoreWithReasoningProps) {
  const isRisk = variant === 'risk'
  const displayLabel = label ?? (isRisk ? 'Blast Radius Risk' : 'Correlation Match Score')

  const isHigh = score >= 80
  const isMedium = score >= 60 && score < 80

  const scoreColor = isHigh 
    ? 'text-destructive bg-destructive/10 border-destructive/20' 
    : isMedium 
      ? 'text-warning bg-warning/10 border-warning/20' 
      : 'text-muted-foreground bg-muted border-border'

  const barColor = isHigh ? 'bg-destructive' : isMedium ? 'bg-warning' : 'bg-success'
  const textColor = isHigh ? 'text-destructive' : isMedium ? 'text-warning' : 'text-success'
  const riskLabel = isHigh ? 'High' : isMedium ? 'Medium' : 'Low'

  return (
    <div className={cn("space-y-2", className)}>
      {isRisk ? (
        <div className="space-y-1.5">
          <div className="flex items-center">
            <span className="text-xs font-semibold text-muted-foreground">
              {displayLabel}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: `${score}%` }} />
            </div>
            <span className={cn('text-xs font-semibold w-14 text-right whitespace-nowrap', textColor)}>
              {score} — {riskLabel}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">
            {displayLabel}
          </span>
          <Badge variant="outline" className={cn('text-xs font-mono font-bold ml-auto', scoreColor)}>
            {score}/100
          </Badge>
        </div>
      )}

      {/* Reasoning list or single text block */}
      {Array.isArray(reasons) ? (
        <ul className="space-y-1 pl-1">
          {reasons.map((reason, i) => (
            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
              <span className="text-primary/75 mt-0.5 flex-shrink-0">›</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground italic mt-1.5">
          {reasons}
        </p>
      )}
    </div>
  )
}


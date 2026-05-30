'use client'

import { Handle, Position } from 'reactflow'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ServiceNodeProps {
  data: {
    label: string
    health: number
    status: 'healthy' | 'warning' | 'critical'
    criticality: string
    highlighted?: boolean
  }
  selected?: boolean
  isConnecting?: boolean
}

export function ServiceNode({ data, selected, isConnecting }: ServiceNodeProps) {
  const statusColors = {
    healthy: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
    critical: 'bg-destructive text-destructive-foreground',
  }

  const criticalityColors = {
    critical: 'bg-destructive/10 text-destructive border-destructive/20',
    high: 'bg-warning/10 text-warning border-warning/20',
    medium: 'bg-primary/10 text-primary border-primary/20',
    low: 'bg-muted text-muted-foreground border-border',
  }

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg border-2 transition-all duration-200 shadow-md',
        selected
          ? 'border-primary bg-primary/10'
          : 'border-border bg-background',
        data.highlighted && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
    >
      <Handle type="target" position={Position.Top} />

      <div className="text-center">
        {/* Service Name */}
        <p className="font-semibold text-sm text-foreground max-w-[150px] line-clamp-2">
          {data.label}
        </p>

        {/* Health Badge */}
        <div className="flex items-center justify-center gap-1 mt-2 mb-2">
          {data.status === 'healthy' && <CheckCircle className="w-3 h-3 text-success" />}
          {data.status !== 'healthy' && <AlertTriangle className="w-3 h-3 text-warning" />}
          <span className="text-xs font-semibold">{data.health}%</span>
        </div>

        {/* Criticality Badge */}
        <Badge
          variant="outline"
          className={cn('text-xs h-5', criticalityColors[data.criticality as keyof typeof criticalityColors])}
        >
          {data.criticality}
        </Badge>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

'use client'

import { Handle, Position } from 'reactflow'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ServiceNodeProps {
  data: {
    label: string
    health: number
    status: 'healthy' | 'warning' | 'critical' | 'disconnected'
    criticality: string
    highlighted?: boolean
  }
  selected?: boolean
  isConnecting?: boolean
}

export function ServiceNode({ data, selected }: ServiceNodeProps) {
  // Node card visual style keyed on health status
  const nodeStyle = {
    healthy: {
      border: 'border-green-500',
      bg: 'bg-green-950/60',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />,
      healthText: 'text-green-400',
      badgeBg: 'bg-green-500/15 text-green-400 border-green-500/30',
      label: 'Healthy',
    },
    warning: {
      border: 'border-yellow-500',
      bg: 'bg-yellow-950/50',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />,
      healthText: 'text-yellow-400',
      badgeBg: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
      label: 'Warning',
    },
    critical: {
      border: 'border-red-500',
      bg: 'bg-red-950/50',
      icon: <XCircle className="w-3.5 h-3.5 text-red-400" />,
      healthText: 'text-red-400',
      badgeBg: 'bg-red-500/15 text-red-400 border-red-500/30',
      label: 'Critical',
    },
    disconnected: {
      border: 'border-amber-500/60 border-dashed',
      bg: 'bg-amber-950/30 opacity-80',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
      healthText: 'text-amber-500',
      badgeBg: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
      label: 'Disconnected',
    },
  }

  const style = nodeStyle[data.status] || nodeStyle.healthy

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-xl border-2 transition-all duration-200 shadow-lg min-w-[150px]',
        style.border,
        style.bg,
        selected && 'ring-2 ring-white/40 ring-offset-1 ring-offset-transparent',
        data.highlighted && 'ring-2 ring-white/60 ring-offset-1 ring-offset-transparent scale-105'
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-500" />

      <div className="text-center space-y-1.5">
        {/* Service Name */}
        <p className="font-semibold text-sm text-white max-w-[150px] line-clamp-2 leading-tight">
          {data.label}
        </p>

        {/* Health % + icon */}
        <div className="flex items-center justify-center gap-1">
          {style.icon}
          <span className={cn('text-xs font-bold', style.healthText)}>
            {data.health}%
          </span>
        </div>

        {/* Status badge */}
        <Badge
          variant="outline"
          className={cn('text-[10px] h-4 px-1.5 font-semibold border', style.badgeBg)}
        >
          {style.label}
        </Badge>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-gray-500" />
    </div>
  )
}

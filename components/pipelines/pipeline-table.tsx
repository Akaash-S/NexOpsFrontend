'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react'

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

interface PipelineTableProps {
  pipelines: Pipeline[]
  selectedPipeline: string | null
  onSelectPipeline: (id: string) => void
}

const STATUS_CONFIG = {
  healthy: { bg: 'bg-success/10', text: 'text-success', icon: CheckCircle2 },
  warning: { bg: 'bg-warning/10', text: 'text-warning', icon: AlertCircle },
  critical: { bg: 'bg-destructive/10', text: 'text-destructive', icon: AlertCircle },
}

export function PipelineTable({
  pipelines,
  selectedPipeline,
  onSelectPipeline,
}: PipelineTableProps) {
  return (
    <div className="space-y-3">
      {pipelines.map((pipeline) => {
        const config = STATUS_CONFIG[pipeline.status]
        const Icon = config.icon

        return (
          <Card
            key={pipeline.id}
            className={`p-4 cursor-pointer transition-all hover:border-primary ${
              selectedPipeline === pipeline.id ? 'border-primary ring-1 ring-primary' : ''
            }`}
            onClick={() => onSelectPipeline(pipeline.id)}
          >
            <div className="grid grid-cols-12 gap-4 items-start">
              {/* Name & Status */}
              <div className="col-span-3">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${config.text}`} />
                  <h3 className="font-semibold">{pipeline.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{pipeline.repository}</p>
              </div>

              {/* Success Rate */}
              <div className="col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Success</span>
                  <span className="text-sm font-semibold">{pipeline.successRate}%</span>
                </div>
                <Progress value={pipeline.successRate} className="h-2" />
              </div>

              {/* Reliability */}
              <div className="col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Reliability</span>
                  <span className="text-sm font-semibold">{pipeline.reliability}%</span>
                </div>
                <Progress value={pipeline.reliability} className="h-2" />
              </div>

              {/* Metrics */}
              <div className="col-span-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{pipeline.avgDuration}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{pipeline.runCount30d}</div>
                    <div className="text-xs text-muted-foreground">runs (30d)</div>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="col-span-2 flex justify-end">
                <Badge variant="secondary" className={`${config.bg} ${config.text}`}>
                  {pipeline.status === 'healthy' ? 'Healthy' : 'Warning'}
                </Badge>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

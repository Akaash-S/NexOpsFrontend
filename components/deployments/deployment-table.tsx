'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react'

interface Deployment {
  id: string
  service: string
  version: string
  environment: string
  status: 'success' | 'pending' | 'rollback' | 'failed'
  riskScore: number
  confidence: number
  deployedAt: string
  duration: string
  changesCount: number
  affectedServices: number
  blastRadius: string
  rollbackReady: boolean
}

interface DeploymentTableProps {
  deployments: Deployment[]
  selectedDeployment: string | null
  onSelectDeployment: (id: string) => void
}

const STATUS_CONFIG = {
  success: { bg: 'bg-success/10', text: 'text-success', label: 'Success' },
  pending: { bg: 'bg-info/10', text: 'text-info', label: 'Pending' },
  rollback: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Rolled Back' },
  failed: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Failed' },
}

export function DeploymentTable({
  deployments,
  selectedDeployment,
  onSelectDeployment,
}: DeploymentTableProps) {
  return (
    <div className="space-y-3">
      {deployments.map((deployment) => {
        const statusConfig = STATUS_CONFIG[deployment.status]
        const riskColor = deployment.riskScore > 50 ? 'text-destructive' : deployment.riskScore > 25 ? 'text-warning' : 'text-success'

        return (
          <Card
            key={deployment.id}
            className={`p-4 cursor-pointer transition-all hover:border-primary ${
              selectedDeployment === deployment.id ? 'border-primary ring-1 ring-primary' : ''
            }`}
            onClick={() => onSelectDeployment(deployment.id)}
          >
            <div className="grid grid-cols-12 gap-4 items-start">
              {/* Service & Version */}
              <div className="col-span-3">
                <h3 className="font-semibold">{deployment.service}</h3>
                <p className="text-sm text-muted-foreground">{deployment.version}</p>
                <p className="text-xs text-muted-foreground mt-1">{deployment.environment}</p>
              </div>

              {/* Risk Score */}
              <div className="col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Risk</span>
                  <span className={`text-sm font-semibold ${riskColor}`}>{deployment.riskScore}</span>
                </div>
                <Progress value={Math.min(deployment.riskScore * 2, 100)} className="h-2" />
              </div>

              {/* Confidence */}
              <div className="col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Confidence</span>
                  <span className="text-sm font-semibold">{deployment.confidence}%</span>
                </div>
                <Progress value={deployment.confidence} className="h-2" />
              </div>

              {/* Metrics */}
              <div className="col-span-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{deployment.duration}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{deployment.affectedServices}</div>
                    <div className="text-xs text-muted-foreground">services</div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2 flex justify-end">
                <Badge variant="secondary" className={`${statusConfig.bg} ${statusConfig.text}`}>
                  {statusConfig.label}
                </Badge>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

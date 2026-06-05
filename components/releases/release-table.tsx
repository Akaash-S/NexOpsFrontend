'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle } from 'lucide-react'

interface Release {
  id: string
  service: string
  status: 'released' | 'staged' | 'draft' | 'archived'
  releaseDate: string
  changesCount: number
  deployments: number
  rollbacks: number
  health: number
  adoptionRate: number
  incidents: number
}

interface ReleaseTableProps {
  releases: Release[]
  selectedRelease: string | null
  onSelectRelease: (id: string) => void
}

const STATUS_CONFIG = {
  released: { bg: 'bg-success/10', text: 'text-success', label: 'Released' },
  staged: { bg: 'bg-info/10', text: 'text-info', label: 'Staged' },
  draft: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Draft' },
  archived: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Archived' },
}

export function ReleaseTable({
  releases,
  selectedRelease,
  onSelectRelease,
}: ReleaseTableProps) {
  return (
    <div className="space-y-3">
      {releases.map((release) => {
        const statusConfig = STATUS_CONFIG[release.status] || STATUS_CONFIG.draft

        return (
          <Card
            key={release.id}
            className={`p-4 cursor-pointer transition-all hover:border-primary ${
              selectedRelease === release.id ? 'border-primary ring-1 ring-primary' : ''
            }`}
            onClick={() => onSelectRelease(release.id)}
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-3">
                <h3 className="font-semibold">{release.service}</h3>
                <p className="text-sm text-muted-foreground">{release.id}</p>
              </div>

              <div className="col-span-2">
                <Badge variant="secondary" className={`${statusConfig.bg} ${statusConfig.text}`}>
                  {statusConfig.label}
                </Badge>
              </div>

              <div className="col-span-2 text-sm">
                <div className="font-semibold">{release.adoptionRate}%</div>
                <div className="text-xs text-muted-foreground">adoption</div>
              </div>

              <div className="col-span-2 text-sm">
                <div className="font-semibold">{release.health}%</div>
                <div className="text-xs text-muted-foreground">health</div>
              </div>

              <div className="col-span-3 flex items-center justify-end gap-3">
                {release.incidents > 0 && (
                  <div className="flex items-center gap-1 text-xs">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <span>{release.incidents} incident{release.incidents > 1 ? 's' : ''}</span>
                  </div>
                )}
                <span className="text-xs text-muted-foreground">{release.releaseDate}</span>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

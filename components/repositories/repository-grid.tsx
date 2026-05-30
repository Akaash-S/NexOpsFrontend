'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Github, AlertCircle, TrendingUp, Shield, Package } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface Repository {
  id: string
  name: string
  owner: string
  description: string
  health: number
  status: 'healthy' | 'warning' | 'critical'
  prs: number
  commits30d: number
  stars: number
  securityIssues: number
  dependencies: number
  codeQuality: number
  coverage: number
  lastUpdated: string
}

interface RepositoryGridProps {
  repositories: Repository[]
  selectedRepo: string | null
  onSelectRepo: (id: string) => void
}

const STATUS_CONFIG = {
  healthy: { bg: 'bg-success/10', text: 'text-success', label: 'Healthy' },
  warning: { bg: 'bg-warning/10', text: 'text-warning', label: 'Warning' },
  critical: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Critical' },
}

export function RepositoryGrid({
  repositories,
  selectedRepo,
  onSelectRepo,
}: RepositoryGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {repositories.map((repo) => (
        <Card
          key={repo.id}
          className={`p-6 cursor-pointer transition-all hover:border-primary ${
            selectedRepo === repo.id ? 'border-primary ring-1 ring-primary' : ''
          }`}
          onClick={() => onSelectRepo(repo.id)}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Github className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{repo.name}</h3>
                <p className="text-sm text-muted-foreground">{repo.owner}</p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className={`${STATUS_CONFIG[repo.status].bg} ${STATUS_CONFIG[repo.status].text}`}
            >
              {STATUS_CONFIG[repo.status].label}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {repo.description}
          </p>

          {/* Metrics */}
          <div className="space-y-4 mb-4">
            {/* Health */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Health</span>
                <span className="text-sm font-semibold">{repo.health}%</span>
              </div>
              <Progress value={repo.health} className="h-2" />
            </div>

            {/* Code Quality */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Code Quality</span>
                <span className="text-sm font-semibold">{repo.codeQuality}%</span>
              </div>
              <Progress value={repo.codeQuality} className="h-2" />
            </div>

            {/* Coverage */}
            {repo.coverage > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Test Coverage</span>
                  <span className="text-sm font-semibold">{repo.coverage}%</span>
                </div>
                <Progress value={repo.coverage} className="h-2" />
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-sm font-semibold">{repo.commits30d}</div>
              <div className="text-xs text-muted-foreground">Commits</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold">{repo.prs}</div>
              <div className="text-xs text-muted-foreground">PRs</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold flex items-center justify-center gap-1">
                {repo.securityIssues}
                {repo.securityIssues > 0 && (
                  <AlertCircle className="w-3 h-3 text-destructive" />
                )}
              </div>
              <div className="text-xs text-muted-foreground">Security</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold">{repo.dependencies}</div>
              <div className="text-xs text-muted-foreground">Dependencies</div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">Updated {repo.lastUpdated}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}

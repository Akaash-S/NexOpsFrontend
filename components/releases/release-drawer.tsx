'use client'

import { useState, useEffect } from 'react'
import { X, TrendingUp, AlertTriangle, Users, GitCommit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

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

interface ReleaseDrawerProps {
  release: Release
  onClose: () => void
}

const TIMELINE = [
  { time: '14:35', event: '100% Adoption reached', status: 'success' },
  { time: '12:00', event: 'Phased rollout to 50%', status: 'success' },
  { time: '09:00', event: 'Beta audience release', status: 'success' },
  { time: '08:00', event: 'Release candidate tagged', status: 'info' },
]

export function ReleaseDrawer({ release, onClose }: ReleaseDrawerProps) {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn("fixed inset-0 z-40 bg-black/50 transition-opacity duration-300", isAnimatingOut ? "opacity-0" : "opacity-100")}
        onClick={handleClose} 
      />

      {/* Drawer */}
      <div 
        className={cn(
          "fixed right-0 top-16 h-[calc(100vh-64px)] w-96 bg-background border-l border-border z-50 flex flex-col transform transition-transform duration-300",
          isAnimatingOut ? "translate-x-full" : "translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-semibold text-lg">{release.service}</h2>
            <p className="text-sm text-muted-foreground">{release.id}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6 space-y-6">
            {/* Impact Analysis */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Impact & Health
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Release Health</span>
                    <span className="font-semibold">{release.health}%</span>
                  </div>
                  <Progress value={release.health} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm flex items-center gap-2">
                      <Users className="w-3 h-3" /> Adoption Rate
                    </span>
                    <span className="font-semibold">{release.adoptionRate}%</span>
                  </div>
                  <Progress value={release.adoptionRate} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Card className="p-3 bg-muted/50 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Changes</div>
                    <div className="font-semibold flex items-center justify-center gap-1">
                      <GitCommit className="w-3 h-3 text-primary" />
                      {release.changesCount}
                    </div>
                  </Card>
                  <Card className="p-3 bg-muted/50 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Rollbacks</div>
                    <div className="font-semibold flex items-center justify-center gap-1">
                      <AlertTriangle className={release.rollbacks > 0 ? "w-3 h-3 text-destructive" : "w-3 h-3 text-muted-foreground"} />
                      <span className={release.rollbacks > 0 ? "text-destructive" : ""}>{release.rollbacks}</span>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Target Date / Status */}
            <div>
              <h3 className="font-semibold mb-3">Release Details</h3>
              <div className="space-y-3">
                <Card className="p-3 bg-muted/50 flex justify-between items-center">
                  <span className="text-sm">Target Date</span>
                  <span className="font-medium text-sm">{release.releaseDate}</span>
                </Card>
                <Card className="p-3 bg-muted/50 flex justify-between items-center">
                  <span className="text-sm">Status</span>
                  <Badge variant="outline" className="capitalize">
                    {release.status}
                  </Badge>
                </Card>
                <Card className="p-3 bg-muted/50 flex justify-between items-center">
                  <span className="text-sm">Active Incidents</span>
                  <Badge variant="secondary" className={release.incidents > 0 ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}>
                    {release.incidents}
                  </Badge>
                </Card>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="font-semibold mb-4">Rollout Timeline</h3>
              <div className="space-y-2 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {TIMELINE.map((item, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-background bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-border bg-background shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-foreground text-xs">{item.time}</div>
                      </div>
                      <div className="text-muted-foreground text-xs">{item.event}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}

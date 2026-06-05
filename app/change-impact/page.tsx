'use client'

import { useState, useMemo } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { ChangeImpactFilters } from '@/components/change-impact/change-impact-filters'
import { RunSimulationDrawer } from '@/components/change-impact/run-simulation-drawer'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, GitBranch, Package, AlertTriangle, FlaskConical } from 'lucide-react'
import { CHANGES_DATA, IMPACT_ANALYSIS_DATA } from '@/lib/mock-data'
import { useAppState } from '@/lib/hooks/use-app-state'

export default function ChangeImpactPage() {
  const { setRunSimulationOpen } = useAppState()
  
  const [changes, setChanges] = useState<any[]>(CHANGES_DATA)
  const [impactAnalysis, setImpactAnalysis] = useState<any[]>(IMPACT_ANALYSIS_DATA)

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    impact: 'all',
    sortBy: 'time-desc',
  })

  // Filter and Sort Logic for Changes
  const filteredAndSortedChanges = useMemo(() => {
    return changes
      .filter((c) => {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          (c.hash && c.hash.toLowerCase().includes(searchLower)) ||
          (c.message && c.message.toLowerCase().includes(searchLower)) ||
          (c.service && c.service.toLowerCase().includes(searchLower)) ||
          (c.change && c.change.toLowerCase().includes(searchLower))
          
        const matchesImpact = filters.impact === 'all' || c.impact === filters.impact
        return matchesSearch && matchesImpact
      })
      .sort((a, b) => {
        // Time sorting is somewhat simulated since we use relative times ('2 hours ago')
        // In a real app we'd use timestamps. For mock data, we just assume the array is originally sorted descending.
        // Let's implement a simple reverse if asc is chosen.
        if (filters.sortBy === 'time-asc') {
          return 1 // Fake reverse
        }
        return -1 // Keep descending
      })
  }, [changes, filters])

  const handleSimulationRun = (newResult: any) => {
    // We could add the result to the UI here if we had a history of simulations
  }

  return (
    <>
      <PageContent>
        <div className="flex items-center justify-between mb-6">
          <PageHeader
            title="Change Impact Analysis"
            description="Correlate what changed with what was affected across your infrastructure"
          />
          <Button onClick={() => setRunSimulationOpen(true)} className="gap-2">
            <FlaskConical className="w-4 h-4" />
            Run Simulation
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Today's Changes</div>
            <div className="text-2xl font-bold">24</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Affected Services</div>
            <div className="text-2xl font-bold">8</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Incident Correlation</div>
            <div className="text-2xl font-bold text-warning">1</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Avg Blast Radius</div>
            <div className="text-2xl font-bold">4.5k users</div>
          </Card>
        </div>

        {/* Filters */}
        <ChangeImpactFilters filters={filters} setFilters={setFilters} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Timeline */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Change Timeline</h3>
            <div className="space-y-3">
              {filteredAndSortedChanges.length > 0 ? (
                filteredAndSortedChanges.map((change) => (
                  <div key={change.id} className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="mt-1">
                        {change.type === 'commit' && (
                          <GitBranch className="w-5 h-5 text-primary" />
                        )}
                        {change.type === 'deployment' && (
                          <Package className="w-5 h-5 text-success" />
                        )}
                        {change.type === 'infrastructure' && (
                          <AlertTriangle className="w-5 h-5 text-warning" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="font-semibold text-sm">
                          {change.type === 'commit' && `${change.message} (${change.hash})`}
                          {change.type === 'deployment' && `Deployed ${change.version} - ${change.service}`}
                          {change.type === 'infrastructure' && change.change}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {change.type === 'commit' && `By ${change.author} • ${change.files} files`}
                          {change.type === 'deployment' && `To ${change.cluster}`}
                        </div>
                      </div>

                      {/* Impact & Time */}
                      <div className="text-right flex flex-col items-end">
                        <Badge
                          variant="outline"
                          className={`${
                            change.impact === 'high'
                              ? 'bg-destructive/10 text-destructive border-destructive/20'
                              : change.impact === 'medium'
                              ? 'bg-warning/10 text-warning border-warning/20'
                              : 'bg-success/10 text-success border-success/20'
                          }`}
                        >
                          {change.impact} impact
                        </Badge>
                        <div className="text-[10px] text-muted-foreground mt-2">{change.time}</div>
                      </div>
                    </div>

                    {/* Affected Services */}
                    <div className="flex flex-wrap gap-2 mt-3 ml-9">
                      {change.affectedServices.map((svc: string) => (
                        <Badge key={svc} variant="secondary" className="text-[10px] font-normal">
                          {svc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
                  No changes found matching your filters.
                </div>
              )}
            </div>
          </Card>

          {/* Impact Analysis */}
          <Card className="p-6 h-fit">
            <h3 className="font-semibold mb-4">Service Impact Matrix</h3>
            <div className="space-y-3">
              {impactAnalysis.map((item) => (
                <div key={item.service} className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm">{item.service}</h4>
                    <span className="text-xs font-medium text-muted-foreground bg-background px-2 py-1 rounded-full border">{item.users.toLocaleString()} users affected</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm mt-4">
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Change Risk</div>
                      <div className="font-semibold text-destructive">{item.risk}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Service Health</div>
                      <div className="font-semibold text-success">{item.health}%</div>
                    </div>
                    <div className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 gap-2 text-xs">
                        Analyze
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </PageContent>

      {/* Run Simulation Wizard */}
      <RunSimulationDrawer onSuccess={handleSimulationRun} />
    </>
  )
}

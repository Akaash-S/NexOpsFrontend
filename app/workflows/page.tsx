'use client'

import { useState, useMemo } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { WorkflowFilters } from '@/components/workflows/workflow-filters'
import { CreateWorkflowDrawer } from '@/components/workflows/create-workflow-drawer'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Plus, PlayCircle, Layers, ShieldAlert, Clock, Activity } from 'lucide-react'
import { WORKFLOWS_DATA } from '@/lib/mock-data'
import { useAppState } from '@/lib/hooks/use-app-state'

export default function WorkflowsPage() {
  const { setCreateWorkflowOpen } = useAppState()
  const [workflows, setWorkflows] = useState<any[]>(WORKFLOWS_DATA)

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: 'runs-desc',
  })

  // Filter and Sort Logic
  const filteredAndSortedWorkflows = useMemo(() => {
    return workflows
      .filter((wf) => {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = wf.name.toLowerCase().includes(searchLower)
        const matchesStatus = filters.status === 'all' || wf.status === filters.status
        
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'runs-desc':
            return b.runs - a.runs
          case 'success-desc':
            return b.successRate - a.successRate
          case 'name-asc':
            return a.name.localeCompare(b.name)
          default:
            return 0
        }
      })
  }, [workflows, filters])

  const activeCount = workflows.filter(wf => wf.status === 'active').length
  const totalRuns = workflows.reduce((sum, wf) => sum + wf.runs, 0)
  
  const handleCreateSuccess = (newWf: any) => {
    setWorkflows([newWf, ...workflows])
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-success/10 text-success border-success/20 capitalize">Active</Badge>
      case 'scheduled':
        return <Badge className="bg-info/10 text-info border-info/20 capitalize">Scheduled</Badge>
      default:
        return <Badge variant="outline" className="capitalize">Disabled</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active':
        return <Activity className="w-5 h-5 text-success" />
      case 'scheduled':
        return <Clock className="w-5 h-5 text-info" />
      default:
        return <PlayCircle className="w-5 h-5 text-muted-foreground" />
    }
  }

  return (
    <>
      <PageContent>
        <PageHeader
          title="Workflows"
          description="Orchestration and automation workflows for complex multi-step operations"
        />

        {/* Action Button */}
        <div className="mb-8 flex justify-between items-center">
          <Button className="gap-2" onClick={() => setCreateWorkflowOpen(true)}>
            <Plus className="w-4 h-4" />
            Create Workflow
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Active Workflows</div>
            <div className="text-2xl font-bold">{activeCount}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Runs</div>
            <div className="text-2xl font-bold">{totalRuns}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Global Success Rate</div>
            <div className="text-2xl font-bold text-success">98.8%</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Avg Duration</div>
            <div className="text-2xl font-bold">11m 21s</div>
          </Card>
        </div>

        {/* Filters */}
        <WorkflowFilters filters={filters} setFilters={setFilters} />

        {/* Workflows */}
        <div className="space-y-4">
          {filteredAndSortedWorkflows.length > 0 ? (
            filteredAndSortedWorkflows.map((workflow) => (
              <Card key={workflow.id} className="p-6 transition-all hover:border-primary/50">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${workflow.status === 'active' ? 'bg-success/10' : workflow.status === 'scheduled' ? 'bg-info/10' : 'bg-muted'}`}>
                        {getStatusIcon(workflow.status)}
                      </div>
                      <h3 className="font-semibold text-lg">{workflow.name}</h3>
                      {getStatusBadge(workflow.status)}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                      <Layers className="w-4 h-4" />
                      {workflow.steps} steps configured
                      <span className="text-muted-foreground/50">•</span>
                      <span>Last run {workflow.lastRun}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" className="gap-2" disabled={workflow.status === 'disabled'}>
                      <PlayCircle className="w-4 h-4" />
                      Run Now
                    </Button>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-6 bg-muted/20 p-4 rounded-lg border border-border">
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">Total Executions</div>
                    <div className="font-semibold text-foreground text-lg">{workflow.runs}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">Average Duration</div>
                    <div className="font-semibold text-foreground text-lg">{workflow.avgDuration}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-muted-foreground mb-1 flex justify-between">
                      <span>Success Rate</span>
                      <span className={workflow.successRate < 98 ? 'text-warning' : 'text-success'}>{workflow.successRate}%</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress 
                        value={workflow.successRate} 
                        className="h-2 flex-1 bg-muted-foreground/20" 
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center p-12 text-muted-foreground border border-dashed rounded-lg bg-muted/20">
              <ShieldAlert className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
              <p>No workflows found matching your criteria.</p>
            </div>
          )}
        </div>
      </PageContent>

      <CreateWorkflowDrawer onSuccess={handleCreateSuccess} />
    </>
  )
}

'use client'

import { PageContent, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Plus, PlayCircle, Clock } from 'lucide-react'

const WORKFLOWS = [
  {
    id: 'wf-1',
    name: 'Incident Response',
    status: 'active',
    runs: 145,
    lastRun: '5 minutes ago',
    avgDuration: '8m 42s',
    successRate: 98,
    steps: 8,
  },
  {
    id: 'wf-2',
    name: 'Deployment Preparation',
    status: 'active',
    runs: 87,
    lastRun: '2 hours ago',
    avgDuration: '3m 15s',
    successRate: 100,
    steps: 5,
  },
  {
    id: 'wf-3',
    name: 'Health Check & Recovery',
    status: 'active',
    runs: 234,
    lastRun: '1 minute ago',
    avgDuration: '2m 30s',
    successRate: 99,
    steps: 6,
  },
  {
    id: 'wf-4',
    name: 'Daily Backup & Archive',
    status: 'scheduled',
    runs: 30,
    lastRun: '1 day ago',
    avgDuration: '15m 20s',
    successRate: 100,
    steps: 4,
  },
  {
    id: 'wf-5',
    name: 'Security Scan & Report',
    status: 'active',
    runs: 56,
    lastRun: '12 hours ago',
    avgDuration: '25m 45s',
    successRate: 97,
    steps: 7,
  },
]

export default function WorkflowsPage() {
  return (
    <>
      
      <>
        <PageContent>
          <PageHeader
            title="Workflows"
            description="Orchestration and automation workflows for complex multi-step operations"
          />

          {/* Action Button */}
          <div className="mb-8">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Workflow
            </Button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Active Workflows</div>
              <div className="text-2xl font-bold">4</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Total Runs</div>
              <div className="text-2xl font-bold">522</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Success Rate</div>
              <div className="text-2xl font-bold text-success">98.8%</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Avg Duration</div>
              <div className="text-2xl font-bold">11m 21s</div>
            </Card>
          </div>

          {/* Workflows */}
          <div className="space-y-3">
            {WORKFLOWS.map((workflow) => (
              <Card key={workflow.id} className="p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <PlayCircle className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg">{workflow.name}</h3>
                      <Badge
                        variant="secondary"
                        className={`${
                          workflow.status === 'active'
                            ? 'bg-success/10 text-success'
                            : 'bg-info/10 text-info'
                        }`}
                      >
                        {workflow.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {workflow.steps} steps • Last run {workflow.lastRun}
                    </div>
                  </div>

                  <div className="text-right">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Total Runs</div>
                    <div className="font-semibold">{workflow.runs}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Avg Duration</div>
                    <div className="font-semibold">{workflow.avgDuration}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Success Rate</div>
                    <div className="flex items-center gap-2">
                      <Progress value={workflow.successRate} className="h-2 flex-1" />
                      <span className="font-semibold text-sm w-10 text-right">{workflow.successRate}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="ghost" className="gap-2">
                      <PlayCircle className="w-4 h-4" />
                      Run
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </PageContent>
      </>
    </>
  )
}

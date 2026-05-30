'use client'

import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Plus, Zap } from 'lucide-react'

const RULES = [
  {
    id: 'rule-1',
    name: 'Auto-scale on high CPU',
    trigger: 'CPU > 80% for 5 min',
    action: 'Scale cluster +20%',
    enabled: true,
    executions: 24,
    successRate: 98,
    lastExecution: '2 minutes ago',
  },
  {
    id: 'rule-2',
    name: 'Restart service on crash',
    trigger: 'Service exit code != 0',
    action: 'Restart service',
    enabled: true,
    executions: 15,
    successRate: 100,
    lastExecution: '1 hour ago',
  },
  {
    id: 'rule-3',
    name: 'Create incident on critical alert',
    trigger: 'Alert severity = critical',
    action: 'Create incident + notify team',
    enabled: true,
    executions: 8,
    successRate: 100,
    lastExecution: '2 days ago',
  },
  {
    id: 'rule-4',
    name: 'Snapshot before deployment',
    trigger: 'Deployment started',
    action: 'Create database snapshot',
    enabled: true,
    executions: 42,
    successRate: 99,
    lastExecution: '1 minute ago',
  },
  {
    id: 'rule-5',
    name: 'Cleanup old logs',
    trigger: 'Daily at 2 AM UTC',
    action: 'Delete logs > 30 days old',
    enabled: false,
    executions: 28,
    successRate: 100,
    lastExecution: '1 day ago',
  },
]

export default function RulesPage() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader
            title="Rules"
            description="Enterprise automation rules for operational governance and incident response"
          />

          {/* Action Button */}
          <div className="mb-8">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Rule
            </Button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Active Rules</div>
              <div className="text-2xl font-bold">4</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Total Executions</div>
              <div className="text-2xl font-bold">117</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Success Rate</div>
              <div className="text-2xl font-bold text-success">99.4%</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Failures</div>
              <div className="text-2xl font-bold">0</div>
            </Card>
          </div>

          {/* Rules List */}
          <div className="space-y-3">
            {RULES.map((rule) => (
              <Card key={rule.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">{rule.name}</h3>
                      {rule.enabled ? (
                        <Badge className="bg-success/10 text-success">Active</Badge>
                      ) : (
                        <Badge variant="outline">Disabled</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Trigger: {rule.trigger}</div>
                      <div>Action: {rule.action}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <Switch checked={rule.enabled} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border text-sm">
                  <div>
                    <div className="text-muted-foreground mb-1">Executions</div>
                    <div className="font-semibold">{rule.executions}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Success Rate</div>
                    <div className="font-semibold">{rule.successRate}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Last Execution</div>
                    <div className="font-semibold">{rule.lastExecution}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      </PageLayout>
    </>
  )
}

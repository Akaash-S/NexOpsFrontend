'use client'

import { useState, useMemo } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { RuleFilters } from '@/components/rules/rule-filters'
import { CreateRuleDrawer } from '@/components/rules/create-rule-drawer'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Plus, Zap, ShieldAlert } from 'lucide-react'
import { RULES_DATA } from '@/lib/mock-data'
import { useAppState } from '@/lib/hooks/use-app-state'

export default function RulesPage() {
  const { setCreateRuleOpen } = useAppState()
  const [rules, setRules] = useState<any[]>(RULES_DATA)

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: 'executions-desc',
  })

  // Filter and Sort Logic
  const filteredAndSortedRules = useMemo(() => {
    return rules
      .filter((rule) => {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          rule.name.toLowerCase().includes(searchLower) ||
          rule.trigger.toLowerCase().includes(searchLower) ||
          rule.action.toLowerCase().includes(searchLower)
          
        let matchesStatus = true
        if (filters.status === 'enabled') matchesStatus = rule.enabled === true
        if (filters.status === 'disabled') matchesStatus = rule.enabled === false
        
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'executions-desc':
            return b.executions - a.executions
          case 'success-desc':
            return b.successRate - a.successRate
          case 'name-asc':
            return a.name.localeCompare(b.name)
          default:
            return 0
        }
      })
  }, [rules, filters])

  const activeCount = rules.filter(r => r.enabled).length
  const totalExecutions = rules.reduce((sum, r) => sum + r.executions, 0)

  const handleRuleToggle = (ruleId: string) => {
    setRules(rules.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
  }

  const handleCreateSuccess = (newRule: any) => {
    setRules([newRule, ...rules])
  }

  return (
    <>
      <PageContent>
        <PageHeader
          title="Rules"
          description="Enterprise automation rules for operational governance and incident response"
        />

        {/* Action Button */}
        <div className="mb-8 flex justify-between items-center">
          <Button className="gap-2" onClick={() => setCreateRuleOpen(true)}>
            <Plus className="w-4 h-4" />
            Create Rule
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Active Rules</div>
            <div className="text-2xl font-bold">{activeCount}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Executions</div>
            <div className="text-2xl font-bold">{totalExecutions}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Global Success Rate</div>
            <div className="text-2xl font-bold text-success">99.4%</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Recent Failures</div>
            <div className="text-2xl font-bold">0</div>
          </Card>
        </div>

        {/* Filters */}
        <RuleFilters filters={filters} setFilters={setFilters} />

        {/* Rules List */}
        <div className="space-y-3">
          {filteredAndSortedRules.length > 0 ? (
            filteredAndSortedRules.map((rule) => (
              <Card key={rule.id} className={`p-5 transition-all ${rule.enabled ? 'border-primary/20' : 'opacity-75 grayscale'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${rule.enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                        <Zap className={`w-5 h-5 ${rule.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{rule.name}</h3>
                      </div>
                      {rule.enabled ? (
                        <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
                      ) : (
                        <Badge variant="outline">Disabled</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-2 mb-4">
                      <div className="bg-muted/30 p-3 rounded-lg border border-border">
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-1">Trigger Condition</span>
                        <span className="font-medium text-sm">{rule.trigger}</span>
                      </div>
                      <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                        <span className="text-[10px] uppercase font-semibold text-primary block mb-1">Automated Action</span>
                        <span className="font-medium text-sm">{rule.action}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right pt-2 pl-4 border-l border-border ml-2 flex flex-col items-end justify-between h-full min-h-[100px]">
                    <Switch checked={rule.enabled} onCheckedChange={() => handleRuleToggle(rule.id)} />
                    <Button variant="ghost" size="sm" className="mt-4">Edit Rule</Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-2 pt-4 border-t border-border text-sm bg-muted/10 p-3 rounded-b-lg -mx-5 -mb-5">
                  <div className="px-5">
                    <div className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">Total Executions</div>
                    <div className="font-semibold">{rule.executions}</div>
                  </div>
                  <div className="border-l border-border px-5">
                    <div className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">Success Rate</div>
                    <div className="font-semibold text-success">{rule.successRate}%</div>
                  </div>
                  <div className="border-l border-border px-5">
                    <div className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">Last Execution</div>
                    <div className="font-semibold">{rule.lastExecution}</div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center p-12 text-muted-foreground border border-dashed rounded-lg bg-muted/20">
              <ShieldAlert className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
              <p>No automation rules found matching your criteria.</p>
            </div>
          )}
        </div>
      </PageContent>

      <CreateRuleDrawer onSuccess={handleCreateSuccess} />
    </>
  )
}

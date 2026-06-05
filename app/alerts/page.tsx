'use client'

import { useState, useMemo } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { AlertsList } from '@/components/alerts/alerts-list'
import { AlertDrawer } from '@/components/alerts/alert-drawer'
import { AlertFilters } from '@/components/alerts/alert-filters'
import { CreateAlertRuleDrawer } from '@/components/alerts/create-alert-rule-drawer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ALERTS_DATA } from '@/lib/mock-data'
import { useAppState } from '@/lib/hooks/use-app-state'

export default function AlertsPage() {
  const { setCreateAlertRuleOpen } = useAppState()
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null)
  
  const [alerts, setAlerts] = useState<any[]>(ALERTS_DATA)

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    severity: 'all',
    status: 'all',
    sortBy: 'date-desc',
  })

  // Filter and Sort Logic
  const filteredAndSortedAlerts = useMemo(() => {
    return alerts
      .filter((alert) => {
        const matchesSearch =
          alert.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          alert.services.some((s: string) => s.toLowerCase().includes(filters.search.toLowerCase()))
        const matchesSeverity = filters.severity === 'all' || alert.severity === filters.severity
        const matchesStatus = filters.status === 'all' || alert.status === filters.status
        return matchesSearch && matchesSeverity && matchesStatus
      })
      .sort((a, b) => {
        const severityWeight: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 }
        switch (filters.sortBy) {
          case 'severity-desc':
            return severityWeight[b.severity] - severityWeight[a.severity]
          case 'severity-asc':
            return severityWeight[a.severity] - severityWeight[b.severity]
          case 'date-desc':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          case 'date-asc':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          default:
            return 0
        }
      })
  }, [alerts, filters])

  const selectedAlertData = alerts.find((a) => a.id === selectedAlert) as any
  const firingCount = alerts.filter((a) => a.status === 'firing').length
  const criticalCount = alerts.filter((a) => a.severity === 'critical' && a.status === 'firing').length

  const handleRuleCreated = (newAlertMock: any) => {
    setAlerts([newAlertMock, ...alerts])
  }

  return (
    <>
      <PageContent>
        <div className="flex items-center justify-between mb-6">
          <PageHeader
            title="Alerts"
            description="Operational signals with correlation, impact analysis, and intelligent routing"
          />
          <Button onClick={() => setCreateAlertRuleOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Alert Rule
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Active Alerts</div>
            <div className="text-2xl font-bold text-warning">{firingCount}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Critical</div>
            <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Correlated Clusters</div>
            <div className="text-2xl font-bold">3</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">MTTR (avg)</div>
            <div className="text-2xl font-bold">18m</div>
          </Card>
        </div>

        {/* Filters */}
        <AlertFilters filters={filters} setFilters={setFilters} />

        {/* Alerts List */}
        {filteredAndSortedAlerts.length > 0 ? (
          <AlertsList
            alerts={filteredAndSortedAlerts}
            selectedAlert={selectedAlert}
            onSelectAlert={setSelectedAlert}
          />
        ) : (
          <Card className="p-12 text-center text-muted-foreground">
            No alerts found matching your filters.
          </Card>
        )}
      </PageContent>

      {/* Alert Drawer */}
      {selectedAlertData && (
        <AlertDrawer
          alert={selectedAlertData}
          onClose={() => setSelectedAlert(null)}
        />
      )}

      {/* Create Alert Rule Wizard */}
      <CreateAlertRuleDrawer onSuccess={handleRuleCreated} />
    </>
  )
}

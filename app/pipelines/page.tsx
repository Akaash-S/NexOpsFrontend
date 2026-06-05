'use client'

import { useState, useMemo } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { PipelineTable } from '@/components/pipelines/pipeline-table'
import { PipelineDrawer } from '@/components/pipelines/pipeline-drawer'
import { PipelineFilters } from '@/components/pipelines/pipeline-filters'
import { ConnectPipelineDrawer } from '@/components/pipelines/connect-pipeline-drawer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { PIPELINES_DATA, PIPELINE_FAILURE_TREND } from '@/lib/mock-data'
import { useAppState } from '@/lib/hooks/use-app-state'

export default function PipelinesPage() {
  const { setConnectPipelineOpen } = useAppState()
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null)
  
  // Local state for dynamically added pipelines from wizard
  const [pipelines, setPipelines] = useState<any[]>(PIPELINES_DATA)

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: 'success-desc',
  })

  // Filter and Sort Logic
  const filteredAndSortedPipelines = useMemo(() => {
    return pipelines
      .filter((pipe) => {
        const matchesSearch =
          pipe.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          pipe.repository.toLowerCase().includes(filters.search.toLowerCase())
        const matchesStatus = filters.status === 'all' || pipe.status === filters.status
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'success-desc':
            return b.successRate - a.successRate
          case 'success-asc':
            return a.successRate - b.successRate
          case 'reliability-desc':
            return b.reliability - a.reliability
          case 'runs-desc':
            return b.runCount30d - a.runCount30d
          case 'name-asc':
            return a.name.localeCompare(b.name)
          default:
            return 0
        }
      })
  }, [pipelines, filters])

  const selectedPipelineData = pipelines.find((p) => p.id === selectedPipeline)

  const handlePipelinesImported = (newPipelines: any[]) => {
    setPipelines([...newPipelines, ...pipelines])
  }

  return (
    <>
      <PageContent>
        <div className="flex items-center justify-between mb-6">
          <PageHeader
            title="Pipelines"
            description="Delivery intelligence with failure trends, success rates, and reliability scoring"
          />
          <Button onClick={() => setConnectPipelineOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Connect Pipeline
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Avg Success Rate</div>
            <div className="text-2xl font-bold">95%</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Runs (30d)</div>
            <div className="text-2xl font-bold">341</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Failures (30d)</div>
            <div className="text-2xl font-bold">12</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Avg Duration</div>
            <div className="text-2xl font-bold">15m</div>
          </Card>
        </div>

        {/* Failure Trend Chart */}
        <Card className="p-6 mb-8">
          <h3 className="font-semibold mb-4">Failure Trend (Last 4 Weeks)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={PIPELINE_FAILURE_TREND}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="failures" fill="hsl(var(--destructive))" />
              <Bar dataKey="recovered" fill="hsl(var(--success))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Filters */}
        <PipelineFilters filters={filters} setFilters={setFilters} />

        {/* Pipelines Table */}
        {filteredAndSortedPipelines.length > 0 ? (
          <PipelineTable
            pipelines={filteredAndSortedPipelines}
            selectedPipeline={selectedPipeline}
            onSelectPipeline={setSelectedPipeline}
          />
        ) : (
          <Card className="p-12 text-center text-muted-foreground">
            No pipelines found matching your filters.
          </Card>
        )}
      </PageContent>

      {/* Details Drawer */}
      {selectedPipelineData && (
        <PipelineDrawer
          pipeline={selectedPipelineData}
          onClose={() => setSelectedPipeline(null)}
        />
      )}

      {/* Connect Pipeline Wizard */}
      <ConnectPipelineDrawer onSuccess={handlePipelinesImported} />
    </>
  )
}

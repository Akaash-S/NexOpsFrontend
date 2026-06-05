'use client'

import { useState, useMemo } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Rocket } from 'lucide-react'
import { RELEASES_DATA, ADOPTION_TREND, RELEASE_TREND } from '@/lib/mock-data'
import { useAppState } from '@/lib/hooks/use-app-state'
import { ReleaseFilters } from '@/components/releases/release-filters'
import { ReleaseTable } from '@/components/releases/release-table'
import { ReleaseDrawer } from '@/components/releases/release-drawer'
import { CreateReleaseDrawer } from '@/components/releases/create-release-drawer'

export default function ReleasesPage() {
  const { setCreateReleaseOpen } = useAppState()
  const [selectedRelease, setSelectedRelease] = useState<string | null>(null)
  
  const [releases, setReleases] = useState<any[]>(RELEASES_DATA)

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: 'date-desc',
  })

  // Filter and Sort Logic
  const filteredAndSortedReleases = useMemo(() => {
    return releases
      .filter((rel) => {
        const matchesSearch =
          rel.service.toLowerCase().includes(filters.search.toLowerCase()) ||
          rel.id.toLowerCase().includes(filters.search.toLowerCase())
        const matchesStatus = filters.status === 'all' || rel.status === filters.status
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'health-desc':
            return b.health - a.health
          case 'health-asc':
            return a.health - b.health
          case 'adoption-desc':
            return b.adoptionRate - a.adoptionRate
          case 'adoption-asc':
            return a.adoptionRate - b.adoptionRate
          case 'incidents-desc':
            return b.incidents - a.incidents
          case 'date-desc':
            return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
          case 'date-asc':
            return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
          default:
            return 0
        }
      })
  }, [releases, filters])

  const selectedReleaseData = releases.find((r) => r.id === selectedRelease) as any

  const handleReleaseCreated = (newRelease: any) => {
    setReleases([newRelease, ...releases])
  }

  return (
    <>
      <PageContent>
        <div className="flex items-center justify-between mb-6">
          <PageHeader
            title="Releases"
            description="Release management with version history, impact analysis, and adoption metrics"
          />
          <Button onClick={() => setCreateReleaseOpen(true)} className="gap-2">
            <Rocket className="w-4 h-4" />
            Create Release
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Releases</div>
            <div className="text-2xl font-bold">42</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">This Week</div>
            <div className="text-2xl font-bold">20</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Avg Adoption</div>
            <div className="text-2xl font-bold">44%</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Rollback Rate</div>
            <div className="text-2xl font-bold">2.4%</div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Release Activity</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={RELEASE_TREND}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="releases" fill="hsl(var(--primary))" />
                <Bar dataKey="rollbacks" fill="hsl(var(--destructive))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Adoption Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={ADOPTION_TREND}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Filters */}
        <ReleaseFilters filters={filters} setFilters={setFilters} />

        {/* Releases Table */}
        {filteredAndSortedReleases.length > 0 ? (
          <ReleaseTable
            releases={filteredAndSortedReleases}
            selectedRelease={selectedRelease}
            onSelectRelease={setSelectedRelease}
          />
        ) : (
          <Card className="p-12 text-center text-muted-foreground">
            No releases found matching your filters.
          </Card>
        )}
      </PageContent>

      {/* Release Details Drawer */}
      {selectedReleaseData && (
        <ReleaseDrawer
          release={selectedReleaseData}
          onClose={() => setSelectedRelease(null)}
        />
      )}

      {/* Create Release Wizard */}
      <CreateReleaseDrawer onSuccess={handleReleaseCreated} />
    </>
  )
}

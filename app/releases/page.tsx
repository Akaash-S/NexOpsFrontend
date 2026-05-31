'use client'

import { useState } from 'react'
import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { mockReleases } from '@/lib/mock-data'

// Transform mock releases to page format
const transformReleases = () => {
  const statusMap: { [key: string]: 'released' | 'staged' | 'draft' | 'archived' } = {
    'released': 'released',
    'scheduled': 'staged',
    'draft': 'draft',
    'archived': 'archived',
  };
  return mockReleases.slice(0, 5).map((rel) => ({
    id: rel.version,
    service: rel.services[0] || 'Unknown',
    status: statusMap[rel.status] || 'draft',
    releaseDate: new Date(rel.targetDate).toLocaleString(),
    changesCount: Math.floor(Math.random() * 30) + 5,
    deployments: Math.floor(Math.random() * 5),
    rollbacks: 0,
    health: 90 + Math.floor(Math.random() * 10),
    adoptionRate: Math.floor(Math.random() * 100),
    incidents: Math.floor(Math.random() * 3),
  }));
};

const RELEASES = transformReleases();

const ADOPTION_TREND = [
  { week: 'W1', rate: 12 },
  { week: 'W2', rate: 28 },
  { week: 'W3', rate: 54 },
  { week: 'W4', rate: 87 },
]

const RELEASE_TREND = [
  { date: 'Mon', releases: 3, rollbacks: 0 },
  { date: 'Tue', releases: 5, rollbacks: 1 },
  { date: 'Wed', releases: 4, rollbacks: 0 },
  { date: 'Thu', releases: 6, rollbacks: 0 },
  { date: 'Fri', releases: 2, rollbacks: 0 },
]

export default function ReleasesPage() {
  const [selectedRelease, setSelectedRelease] = useState<string | null>(null)

  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader
            title="Releases"
            description="Release management with version history, impact analysis, and adoption metrics"
          />

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

          {/* Releases List */}
          <div className="space-y-3">
            {RELEASES.map((release) => (
              <Card
                key={release.id}
                className={`p-4 cursor-pointer transition-all hover:border-primary ${
                  selectedRelease === release.id ? 'border-primary ring-1 ring-primary' : ''
                }`}
                onClick={() => setSelectedRelease(release.id)}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3">
                    <h3 className="font-semibold">{release.service}</h3>
                    <p className="text-sm text-muted-foreground">{release.id}</p>
                  </div>

                  <div className="col-span-2">
                    <Badge
                      variant="secondary"
                      className={`${
                        release.status === 'released'
                          ? 'bg-success/10 text-success'
                          : 'bg-info/10 text-info'
                      }`}
                    >
                      {release.status}
                    </Badge>
                  </div>

                  <div className="col-span-2 text-sm">
                    <div className="font-semibold">{release.adoptionRate}%</div>
                    <div className="text-xs text-muted-foreground">adoption</div>
                  </div>

                  <div className="col-span-2 text-sm">
                    <div className="font-semibold">{release.health}%</div>
                    <div className="text-xs text-muted-foreground">health</div>
                  </div>

                  <div className="col-span-3 flex items-center justify-end gap-3">
                    {release.incidents > 0 && (
                      <div className="flex items-center gap-1 text-xs">
                        <AlertCircle className="w-4 h-4 text-destructive" />
                        <span>{release.incidents} incident</span>
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">{release.releaseDate}</span>
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

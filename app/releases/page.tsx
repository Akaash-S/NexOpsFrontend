'use client'

import { useState } from 'react'
import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react'

const RELEASES = [
  {
    id: 'v2.4.1',
    service: 'API Gateway',
    status: 'released',
    releaseDate: '5 minutes ago',
    changesCount: 12,
    deployments: 3,
    rollbacks: 0,
    health: 98,
    adoptionRate: 87,
    incidents: 0,
  },
  {
    id: 'v1.8.5',
    service: 'Search Service',
    status: 'released',
    releaseDate: '45 minutes ago',
    changesCount: 24,
    deployments: 2,
    rollbacks: 0,
    health: 92,
    adoptionRate: 45,
    incidents: 1,
  },
  {
    id: 'v3.1.0',
    service: 'Notification Service',
    status: 'staged',
    releaseDate: 'pending',
    changesCount: 5,
    deployments: 0,
    rollbacks: 0,
    health: 100,
    adoptionRate: 0,
    incidents: 0,
  },
]

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

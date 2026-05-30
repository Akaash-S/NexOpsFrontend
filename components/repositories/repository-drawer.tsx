'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Repository {
  id: string
  name: string
  owner: string
  description: string
  health: number
  status: 'healthy' | 'warning' | 'critical'
  prs: number
  commits30d: number
  stars: number
  securityIssues: number
  dependencies: number
  codeQuality: number
  coverage: number
  lastUpdated: string
}

interface RepositoryDrawerProps {
  repository: Repository
  onClose: () => void
}

const QUALITY_TREND = [
  { date: '1w ago', quality: 85, coverage: 80 },
  { date: '6d ago', quality: 86, coverage: 81 },
  { date: '5d ago', quality: 87, coverage: 82 },
  { date: '4d ago', quality: 88, coverage: 83 },
  { date: '3d ago', quality: 89, coverage: 85 },
  { date: '2d ago', quality: 91, coverage: 87 },
  { date: 'Today', quality: 92, coverage: 91 },
]

const RECENT_COMMITS = [
  { hash: 'a3f4e2d', message: 'Fix: API response serialization', author: 'Sarah Chen', time: '2h ago' },
  { hash: 'b2e1c9f', message: 'Feat: Add caching layer', author: 'Marcus Johnson', time: '4h ago' },
  { hash: 'c1d8a5e', message: 'Chore: Update dependencies', author: 'Elena Rodriguez', time: '1d ago' },
]

const PULL_REQUESTS = [
  { id: 123, title: 'Add request validation middleware', author: 'James Liu', status: 'review', prs: 2 },
  { id: 121, title: 'Improve error handling', author: 'Lisa Wang', status: 'review', prs: 1 },
  { id: 119, title: 'Refactor database layer', author: 'Marcus Johnson', status: 'draft', prs: 0 },
]

const DEPENDENCIES = [
  { name: 'axios', version: '1.4.0', health: 'healthy', updates: 0 },
  { name: 'lodash', version: '4.17.21', health: 'healthy', updates: 2 },
  { name: 'zod', version: '3.21.4', health: 'warning', updates: 1 },
  { name: 'typescript', version: '5.0.0', health: 'healthy', updates: 0 },
]

const SECURITY_ISSUES = [
  { severity: 'Low', count: 0 },
  { severity: 'Medium', count: 0 },
  { severity: 'High', count: 0 },
  { severity: 'Critical', count: 0 },
]

export function RepositoryDrawer({ repository, onClose }: RepositoryDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-16 h-[calc(100vh-64px)] w-96 bg-background border-l border-border z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-semibold text-lg">{repository.name}</h2>
            <p className="text-sm text-muted-foreground">{repository.owner}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="rounded-none border-b border-border px-6" variant="underline">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="commits">Commits</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Pull Requests</h3>
                <div className="space-y-2">
                  {PULL_REQUESTS.map((pr) => (
                    <div key={pr.id} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{pr.title}</p>
                          <p className="text-xs text-muted-foreground">{pr.author}</p>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {pr.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Dependencies ({DEPENDENCIES.length})</h3>
                <div className="space-y-2">
                  {DEPENDENCIES.slice(0, 3).map((dep) => (
                    <div key={dep.name} className="flex items-center justify-between p-2 rounded text-sm">
                      <span>{dep.name}</span>
                      <span className="text-muted-foreground">{dep.version}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Quality Tab */}
            <TabsContent value="quality" className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Quality Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={QUALITY_TREND}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="quality" stroke="hsl(var(--primary))" />
                    <Line type="monotone" dataKey="coverage" stroke="hsl(var(--success))" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            {/* Commits Tab */}
            <TabsContent value="commits" className="p-6 space-y-4">
              {RECENT_COMMITS.map((commit) => (
                <div key={commit.hash} className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium">{commit.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">{commit.author}</p>
                    <span className="font-mono text-xs text-muted-foreground">{commit.hash}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{commit.time}</p>
                </div>
              ))}
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Security Status</h3>
                {SECURITY_ISSUES.map((issue) => (
                  <div key={issue.severity} className="flex items-center justify-between py-2">
                    <span className="text-sm">{issue.severity}</span>
                    <span className="font-semibold">{issue.count}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </>
  )
}

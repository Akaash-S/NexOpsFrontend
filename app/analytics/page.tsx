'use client'

import { useState, useEffect } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
  TrendingUp, TrendingDown, Activity, Shield, Rocket, AlertTriangle,
  GitCommitHorizontal, CheckCircle2, XCircle, Clock, Loader2,
  BarChart3, RefreshCw, Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Metric Card ────────────────────────────────────────────────────────────
function StatCard({
  label, value, unit = '', sub, trend, icon: Icon, color = 'text-primary', loading
}: {
  label: string; value: number | string; unit?: string; sub?: string
  trend?: 'up' | 'down' | 'neutral'; icon: any; color?: string; loading?: boolean
}) {
  return (
    <Card className="p-5 flex flex-col gap-3 hover:border-border/80 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        <div className={cn('p-2 rounded-lg bg-secondary/60', color)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      {loading ? (
        <div className="h-8 w-24 bg-secondary/60 rounded animate-pulse" />
      ) : (
        <div className="flex items-end gap-1.5">
          <span className="text-3xl font-bold tracking-tight text-foreground">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {unit && <span className="text-sm text-muted-foreground mb-1">{unit}</span>}
        </div>
      )}
      {sub && (
        <div className={cn('flex items-center gap-1 text-xs', trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground')}>
          {trend === 'up' && <TrendingUp className="w-3 h-3" />}
          {trend === 'down' && <TrendingDown className="w-3 h-3" />}
          <span>{sub}</span>
        </div>
      )}
    </Card>
  )
}

// ─── Chart tooltip ───────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-lg shadow-xl p-3 text-sm min-w-[140px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground capitalize">{p.name}</span>
          <span className="font-bold" style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

const CHART_COLORS = {
  commits: '#6366f1',
  issues:  '#f59e0b',
  deployed:'#10b981',
  success: '#10b981',
  failed:  '#ef4444',
  running: '#6366f1',
}

const HEALTH_COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444']

export default function AnalyticsPage() {
  const [stats, setStats]       = useState<any>(null)
  const [activity, setActivity] = useState<any[]>([])
  const [repos, setRepos]       = useState<any[]>([])
  const [deployments, setDeployments] = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function loadData(showRefresh = false) {
    if (showRefresh) setRefreshing(true)
    try {
      const { apiFetch } = await import('@/lib/api-client')
      const [statsData, activityData, reposData, deploymentsData] = await Promise.all([
        apiFetch('/analytics/dashboard'),
        apiFetch('/analytics/activity'),
        apiFetch('/repos'),
        apiFetch('/deployments'),
      ])
      setStats(statsData)
      setActivity(activityData?.data ?? [])
      setRepos(reposData ?? [])
      setDeployments(deploymentsData ?? [])
    } catch (err) {
      console.error('Failed to load analytics:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { loadData() }, [])

  // ── Derived metrics ────────────────────────────────────────────────────────
  const activeRepos    = repos.filter((r: any) => r.status !== 'disconnected')
  const disconnectedRepos = repos.filter((r: any) => r.status === 'disconnected')
  const totalCommits   = activity.reduce((s: number, d: any) => s + (d.commits ?? 0), 0)
  const totalDeployed  = activity.reduce((s: number, d: any) => s + (d.deployed ?? 0), 0)
  const totalIssues    = activity.reduce((s: number, d: any) => s + (d.issues ?? 0), 0)

  // 1a Fix: Safe extraction supporting both camelCase and snake_case API payloads
  const avgHealthVal   = stats ? (stats.avgHealth ?? stats.avg_health ?? 0) : 0
  const successRateVal = stats ? (stats.successRate ?? stats.success_rate ?? 0) : 0
  const vulnIndexVal   = stats ? (stats.vulnerabilityIndex ?? stats.vulnerability_index ?? 0) : 0

  // 1c Fix: Explicitly initialize all three deployment outcome categories (success, failed, running)
  const depByStatus: Record<string, number> = {
    success: 0,
    failed: 0,
    running: 0,
  }
  deployments.forEach((d: any) => {
    const st = (d.status || 'running').toLowerCase()
    if (st in depByStatus) {
      depByStatus[st] += 1
    } else {
      depByStatus[st] = 1
    }
  })

  const depPieData = Object.entries(depByStatus).map(([name, value]) => ({ name, value }))

  // Health band distribution for active repos
  const healthBands = {
    'Healthy (≥80)':  activeRepos.filter((r: any) => (r.health_score ?? r.healthScore ?? 0) >= 80).length,
    'Fair (60–79)':   activeRepos.filter((r: any) => { const h = r.health_score ?? r.healthScore ?? 0; return h >= 60 && h < 80 }).length,
    'Poor (40–59)':   activeRepos.filter((r: any) => { const h = r.health_score ?? r.healthScore ?? 0; return h >= 40 && h < 60 }).length,
    'Critical (<40)': activeRepos.filter((r: any) => (r.health_score ?? r.healthScore ?? 0) < 40).length,
  }
  const healthPieData = Object.entries(healthBands)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }))

  // Top repos by open issues
  const topIssueRepos = [...activeRepos]
    .sort((a: any, b: any) => (b.open_issues ?? b.openIssues ?? 0) - (a.open_issues ?? a.openIssues ?? 0))
    .slice(0, 6)
    .map((r: any) => ({
      name: r.name?.length > 14 ? r.name.slice(0, 14) + '…' : r.name,
      issues: r.open_issues ?? r.openIssues ?? 0,
      health: r.health_score ?? r.healthScore ?? 0,
    }))

  return (
    <PageContent>
      <div className="flex items-center justify-between mb-2">
        <PageHeader
          title="Analytics"
          description="7-day velocity, deployment outcomes, and repository health across your workspace"
        />
        <Button
          variant="outline" size="sm"
          onClick={() => loadData(true)}
          disabled={refreshing}
          className="gap-2 shrink-0"
        >
          <RefreshCw className={cn('w-3.5 h-3.5', refreshing && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* ── KPI Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Avg Health Score" value={Math.round(avgHealthVal)}
          unit="%" icon={Activity} color="text-primary"
          trend={avgHealthVal >= 75 ? 'up' : 'down'}
          sub={stats ? (avgHealthVal >= 75 ? 'Within healthy range' : 'Below target threshold') : ''}
          loading={loading}
        />
        <StatCard
          label="Deployment Success" value={Math.round(successRateVal)}
          unit="%" icon={Rocket} color="text-success"
          trend={successRateVal >= 80 ? 'up' : 'down'}
          sub={deployments.length > 0 ? `${deployments.length} total deployments` : 'No deployments yet'}
          loading={loading}
        />
        <StatCard
          label="Open Vulnerabilities" value={vulnIndexVal}
          icon={Shield} color="text-warning"
          trend={vulnIndexVal === 0 ? 'up' : 'down'}
          sub={vulnIndexVal === 0 ? 'No critical alerts' : 'Needs attention'}
          loading={loading}
        />
        <StatCard
          label="Active Repositories" value={activeRepos.length}
          icon={BarChart3} color="text-primary"
          trend="neutral"
          sub={`${disconnectedRepos.length} disconnected`}
          loading={loading}
        />
      </div>

      {/* ── 7-Day Velocity Chart ─────────────────────────────────────────── */}
      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-base text-foreground">7-Day Engineering Velocity</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Commits, open issues, and deployments per day
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#6366f1] inline-block" />Commits ({totalCommits})</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#f59e0b] inline-block" />Issues ({totalIssues})</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#10b981] inline-block" />Deployed ({totalDeployed})</span>
          </div>
        </div>

        {loading ? (
          <div className="h-64 bg-secondary/30 rounded-lg animate-pulse" />
        ) : activity.length === 0 ? (
          <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
            <div className="text-center">
              <Zap className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No event data yet — connect GitHub to start tracking velocity</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={activity} barCategoryGap="30%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="commits" fill={CHART_COLORS.commits} radius={[4, 4, 0, 0]} name="commits" />
              <Bar dataKey="issues"  fill={CHART_COLORS.issues}  radius={[4, 4, 0, 0]} name="issues" />
              <Bar dataKey="deployed" fill={CHART_COLORS.deployed} radius={[4, 4, 0, 0]} name="deployed" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* ── Bottom Row: Deployment Outcomes + Health Distribution + Top Repos ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Deployment Status Pie */}
        <Card className="p-5">
          <h2 className="font-semibold text-base text-foreground mb-1">Deployment Outcomes</h2>
          <p className="text-xs text-muted-foreground mb-5">All-time status breakdown</p>
          {loading ? (
            <div className="h-48 bg-secondary/30 rounded animate-pulse" />
          ) : depPieData.length === 0 ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm text-muted-foreground text-center">No deployment data yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={depPieData} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                    paddingAngle={3} strokeWidth={0}
                  >
                    {depPieData.map((entry, i) => (
                      <Cell key={i} fill={
                        entry.name === 'success' ? CHART_COLORS.success :
                        entry.name === 'failed'  ? CHART_COLORS.failed  :
                        CHART_COLORS.running
                      } />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {depPieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-2 h-2 rounded-full inline-block" style={{
                      background: d.name === 'success' ? CHART_COLORS.success : d.name === 'failed' ? CHART_COLORS.failed : CHART_COLORS.running
                    }} />
                    <span className="capitalize">{d.name}</span>
                    <span className="font-semibold text-foreground">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* Health Distribution Pie */}
        <Card className="p-5">
          <h2 className="font-semibold text-base text-foreground mb-1">Repository Health</h2>
          <p className="text-xs text-muted-foreground mb-5">Distribution across active repos</p>
          {loading ? (
            <div className="h-48 bg-secondary/30 rounded animate-pulse" />
          ) : healthPieData.length === 0 ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm text-muted-foreground text-center">No repository data yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={healthPieData} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                    paddingAngle={3} strokeWidth={0}
                  >
                    {healthPieData.map((_, i) => (
                      <Cell key={i} fill={HEALTH_COLORS[i % HEALTH_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {healthPieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: HEALTH_COLORS[i % HEALTH_COLORS.length] }} />
                    <span>{d.name}</span>
                    <span className="font-semibold text-foreground">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* Top Repos by Open Issues */}
        <Card className="p-5">
          <h2 className="font-semibold text-base text-foreground mb-1">Open Issues by Repo</h2>
          <p className="text-xs text-muted-foreground mb-5">Top 6 repos by issue backlog</p>
          {loading ? (
            <div className="space-y-2">{Array.from({length: 5}).map((_, i) => (
              <div key={i} className="h-6 bg-secondary/30 rounded animate-pulse" />
            ))}</div>
          ) : topIssueRepos.length === 0 ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm text-muted-foreground text-center">No repositories tracked yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topIssueRepos.map((r: any, i: number) => {
                const maxIssues = Math.max(...topIssueRepos.map((x: any) => x.issues), 1)
                const pct = (r.issues / maxIssues) * 100
                const hColor = r.health >= 80 ? 'text-success' : r.health >= 60 ? 'text-warning' : 'text-destructive'
                return (
                  <div key={i} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground truncate max-w-[120px]" title={r.name}>{r.name}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={cn('text-xs font-semibold', hColor)}>{Math.round(r.health)}%</span>
                        <Badge variant="outline" className="text-xs px-1.5 py-0">{r.issues} issues</Badge>
                      </div>
                    </div>
                    <div className="h-1.5 bg-secondary/60 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: r.health >= 80 ? '#10b981' : r.health >= 60 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      {/* ── Repo Health Table ───────────────────────────────────────────── */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-base text-foreground">Repository Health Details</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Workspace repositories with CI status and health score</p>
          </div>
          <Badge variant="secondary" className="text-xs font-mono">
            {repos.length} total ({activeRepos.length} active, {disconnectedRepos.length} disconnected)
          </Badge>
        </div>

        {loading ? (
          <div className="space-y-2">{Array.from({length: 5}).map((_, i) => (
            <div key={i} className="h-12 bg-secondary/30 rounded animate-pulse" />
          ))}</div>
        ) : repos.length === 0 ? (
          <div className="flex items-center justify-center h-32 border border-dashed border-border rounded-lg">
            <p className="text-sm text-muted-foreground">No repositories — sync GitHub to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs text-muted-foreground font-medium pb-3 pr-4">Repository</th>
                  <th className="text-left text-xs text-muted-foreground font-medium pb-3 pr-4">Language</th>
                  <th className="text-left text-xs text-muted-foreground font-medium pb-3 pr-4">CI / Connection Status</th>
                  <th className="text-right text-xs text-muted-foreground font-medium pb-3 pr-4">Health</th>
                  <th className="text-right text-xs text-muted-foreground font-medium pb-3 pr-4">Open Issues</th>
                  <th className="text-right text-xs text-muted-foreground font-medium pb-3">Activity</th>
                </tr>
              </thead>
              <tbody>
                {[...repos]
                  .sort((a: any, b: any) => (a.health_score ?? a.healthScore ?? 0) - (b.health_score ?? b.healthScore ?? 0))
                  .map((r: any, i: number) => {
                    const isDisconnected = r.status === 'disconnected'
                    const health = isDisconnected ? 0 : (r.health_score ?? r.healthScore ?? 0)
                    const hColor = isDisconnected ? 'text-muted-foreground' : health >= 80 ? 'text-success' : health >= 60 ? 'text-warning' : 'text-destructive'
                    const ci = r.ci_status ?? r.ciStatus ?? 'unknown'
                    const ciColor = ci === 'passing' ? 'text-success' : ci === 'failing' ? 'text-destructive' : 'text-muted-foreground'
                    return (
                      <tr key={i} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                        <td className="py-3 pr-4 font-medium text-foreground max-w-[160px] truncate">{r.name}</td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          <Badge variant="outline" className="text-xs">{r.language || '—'}</Badge>
                        </td>
                        <td className="py-3 pr-4">
                          {isDisconnected ? (
                            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] font-semibold">
                              Disconnected
                            </Badge>
                          ) : (
                            <span className={cn('flex items-center gap-1.5 text-xs font-medium capitalize', ciColor)}>
                              {ci === 'passing' && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {ci === 'failing' && <XCircle className="w-3.5 h-3.5" />}
                              {ci !== 'passing' && ci !== 'failing' && <Clock className="w-3.5 h-3.5" />}
                              {ci}
                            </span>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <span className={cn('font-bold', hColor)}>{isDisconnected ? 'N/A' : `${Math.round(health)}%`}</span>
                        </td>
                        <td className="py-3 pr-4 text-right text-muted-foreground">
                          {r.open_issues ?? r.openIssues ?? 0}
                        </td>
                        <td className="py-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            {Array.from({length: 7}).map((_, wi) => {
                              const act = isDisconnected ? 0 : (r.activity ?? 0)
                              const lit = Math.random() * 100 < act
                              return (
                                <div
                                  key={wi}
                                  className={cn('w-2 h-2 rounded-sm', lit ? 'bg-primary' : 'bg-secondary/60')}
                                />
                              )
                            })}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </PageContent>
  )
}

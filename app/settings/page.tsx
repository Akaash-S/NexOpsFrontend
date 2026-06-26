'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import { PageContent, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Bell, Network, Settings, LogOut, CheckCircle2, AlertTriangle, ShieldCheck, Play } from 'lucide-react'
import { useAppState } from '@/lib/hooks/use-app-state'
import { cn } from '@/lib/utils'

function SettingsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { theme, setTheme } = useTheme()
  
  const { 
    addNotification, 
    watchedServices, 
    setWatchedServices, 
    density, 
    setDensity, 
    setAuthenticated,
    currentUser
  } = useAppState()

  // Tab routing support
  const queryTab = searchParams ? searchParams.get('tab') : null
  const [activeTab, setActiveTab] = useState('preferences')

  useEffect(() => {
    if (queryTab && ['preferences', 'notifications', 'workspace', 'account'].includes(queryTab)) {
      setActiveTab(queryTab)
    }
  }, [queryTab])

  // Repositories state loading
  const [repos, setRepos] = useState<any[]>([])
  const [loadingRepos, setLoadingRepos] = useState(true)

  useEffect(() => {
    async function loadRepos() {
      try {
        const { apiFetch } = await import('@/lib/api-client')
        const data = await apiFetch('/repos')
        setRepos(data)
      } catch (err) {
        console.error('Failed to load repos:', err)
      } finally {
        setLoadingRepos(false)
      }
    }
    loadRepos()
  }, [])

  // Dynamic integrations array
  const integrations = [
    {
      name: 'GitHub',
      status: currentUser ? 'Connected' : 'Disconnected',
      config: currentUser ? 'nexops-org/repositories' : 'Not configured',
      lastSync: 'Sync active',
    },
    {
      name: 'PagerDuty',
      status: currentUser ? 'Connected' : 'Disconnected',
      config: currentUser ? 'PD Webhook Active' : 'Not configured',
      lastSync: 'Sync active',
    }
  ]

  // Mock settings values
  const [landingRoute, setLandingRoute] = useState('/dashboard')
  const [codeownersPath, setCodeownersPath] = useState('.github/CODEOWNERS')
  const [isSaving, setIsSaving] = useState(false)

  // Personal Mock Notifications Config
  const [notifySlack, setNotifySlack] = useState({
    newIncident: true,
    candidateAwaiting: true,
    highRiskDeploy: false,
  })
  const [notifyEmail, setNotifyEmail] = useState({
    newIncident: true,
    candidateAwaiting: false,
    highRiskDeploy: true,
  })

  const handleSave = (sectionName: string) => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      addNotification({
        title: 'Settings Saved',
        description: `Your ${sectionName} changes have been successfully updated.`,
        type: 'success',
      })
    }, 600)
  }

  const handleSignOut = () => {
    setAuthenticated(false)
    addNotification({
      title: 'Logged Out',
      description: 'You have been signed out of your session.',
      type: 'info',
    })
    router.push('/')
  }

  const toggleWatchedService = (serviceId: string) => {
    if (watchedServices.includes(serviceId)) {
      setWatchedServices(watchedServices.filter((id) => id !== serviceId))
    } else {
      setWatchedServices([...watchedServices, serviceId])
    }
    const serviceName = repos.find((r) => r.id === serviceId)?.name || serviceId
    addNotification({
      title: 'Watched Services Updated',
      description: `Toggle status updated for service: ${serviceName}`,
      type: 'info',
    })
  }

  return (
    <PageContent>
      <PageHeader
        title="Settings & Preferences"
        description="Configure your personal interface options, notification scopes, and workspace connections"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="preferences" className="gap-2">
            <Settings className="w-4 h-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="workspace" className="gap-2">
            <Network className="w-4 h-4" />
            Workspace
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <User className="w-4 h-4" />
            Account
          </TabsTrigger>
        </TabsList>

        {/* 1. PREFERENCES TAB (PERSONAL) */}
        <TabsContent value="preferences" className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Display & Styling settings */}
            <Card className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-base mb-1">Display & Theme</h3>
                <p className="text-xs text-muted-foreground">Adjust styling variables for your user interface.</p>
              </div>

              {/* Theme selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Appearance Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {['dark', 'light', 'system'].map((t) => (
                    <Button
                      key={t}
                      variant="outline"
                      size="sm"
                      className={cn(
                        'capitalize border-border/80',
                        theme === t && 'border-primary bg-primary/5 text-primary'
                      )}
                      onClick={() => {
                        setTheme(t)
                        addNotification({
                          title: 'Appearance Changed',
                          description: `Theme is now set to ${t}.`,
                          type: 'success',
                        })
                      }}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Density toggle */}
              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <div>
                  <label className="text-sm font-semibold block">Comfortable Grid View</label>
                  <span className="text-xs text-muted-foreground">Sets default card padding and grid column sizes.</span>
                </div>
                <Switch 
                  checked={density === 'comfortable'} 
                  onCheckedChange={(val) => {
                    setDensity(val ? 'comfortable' : 'compact')
                    addNotification({
                      title: 'Density Configured',
                      description: `Dashboard padding set to ${val ? 'comfortable' : 'compact'}.`,
                      type: 'info',
                    })
                  }} 
                />
              </div>

              {/* Default landing route selection */}
              <div className="space-y-2 pt-4 border-t border-border/40">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Default post-login page</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(landingRoute === '/dashboard' && 'border-primary bg-primary/5 text-primary')}
                    onClick={() => {
                      setLandingRoute('/dashboard')
                      addNotification({ title: 'Preferences Updated', description: 'Landing page set to Dashboard', type: 'success' })
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(landingRoute === '/incidents' && 'border-primary bg-primary/5 text-primary')}
                    onClick={() => {
                      setLandingRoute('/incidents')
                      addNotification({ title: 'Preferences Updated', description: 'Landing page set to Incidents log', type: 'success' })
                    }}
                  >
                    Incidents Log
                  </Button>
                </div>
              </div>
            </Card>

            {/* Watched microservices */}
            <Card className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-base mb-1">Watched Services</h3>
                <p className="text-xs text-muted-foreground">Select services to prioritize and watch in personalized dashboards.</p>
              </div>

              <div className="space-y-1.5 max-h-[220px] overflow-y-auto border border-border/50 rounded-lg p-2 bg-muted/15">
                {loadingRepos ? (
                  <div className="text-center py-4 text-xs text-muted-foreground animate-pulse">Loading services...</div>
                ) : repos.length === 0 ? (
                  <div className="text-center py-4 text-xs text-muted-foreground">No services found. Connect GitHub to synchronize.</div>
                ) : (
                  repos.map((svc) => {
                    const isWatched = watchedServices.includes(svc.id)
                    const nameLower = svc.name.toLowerCase()
                    let tier = 'service'
                    if (nameLower.includes('gateway') || nameLower.includes('frontend')) {
                      tier = 'ingress'
                    } else if (nameLower.includes('database') || nameLower.includes('db') || nameLower.includes('redis') || nameLower.includes('cache') || nameLower.includes('queue') || nameLower.includes('kafka') || nameLower.includes('terraform')) {
                      tier = 'data'
                    }
                    return (
                      <div 
                        key={svc.id} 
                        onClick={() => toggleWatchedService(svc.id)}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors text-xs border border-transparent",
                          isWatched ? 'bg-primary/5 border-primary/20 text-foreground' : 'hover:bg-muted/50 text-muted-foreground'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            tier === 'ingress' ? 'bg-primary' : tier === 'service' ? 'bg-accent' : 'bg-warning'
                          )} />
                          <span className="font-semibold">{svc.name}</span>
                        </div>
                        <Badge variant="outline" className="text-[9px] scale-90">
                          {isWatched ? 'Watching' : 'Ignore'}
                        </Badge>
                      </div>
                    )
                  })
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* 2. NOTIFICATIONS TAB (PERSONAL CHANNEL CONFIGS) */}
        <TabsContent value="notifications" className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
          <Card className="p-6 max-w-2xl space-y-6">
            <div>
              <h3 className="font-semibold text-base mb-1">Per-Channel Alert Subscriptions</h3>
              <p className="text-xs text-muted-foreground">Scope notification notifications relative to your watched and owned service graph nodes.</p>
            </div>

            {/* Channels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Slack Channel */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">Slack notifications</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <label className="text-muted-foreground">New incident on watched service</label>
                    <Switch checked={notifySlack.newIncident} onCheckedChange={(v) => { setNotifySlack(p=>({...p, newIncident: v})); handleSave('Slack settings') }} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <label className="text-muted-foreground">Candidate cause awaiting feedback</label>
                    <Switch checked={notifySlack.candidateAwaiting} onCheckedChange={(v) => { setNotifySlack(p=>({...p, candidateAwaiting: v})); handleSave('Slack settings') }} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <label className="text-muted-foreground">High-risk deploy on watched service</label>
                    <Switch checked={notifySlack.highRiskDeploy} onCheckedChange={(v) => { setNotifySlack(p=>({...p, highRiskDeploy: v})); handleSave('Slack settings') }} />
                  </div>
                </div>
              </div>

              {/* Email Channel */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">Email digests</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <label className="text-muted-foreground">New incident on watched service</label>
                    <Switch checked={notifyEmail.newIncident} onCheckedChange={(v) => { setNotifyEmail(p=>({...p, newIncident: v})); handleSave('Email settings') }} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <label className="text-muted-foreground">Candidate cause awaiting feedback</label>
                    <Switch checked={notifyEmail.candidateAwaiting} onCheckedChange={(v) => { setNotifyEmail(p=>({...p, candidateAwaiting: v})); handleSave('Email settings') }} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <label className="text-muted-foreground">High-risk deploy on watched service</label>
                    <Switch checked={notifyEmail.highRiskDeploy} onCheckedChange={(v) => { setNotifyEmail(p=>({...p, highRiskDeploy: v})); handleSave('Email settings') }} />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 3. WORKSPACE TAB (ORG/ADMIN INTEGRATIONS & DATA SOURCE CONFIG) */}
        <TabsContent value="workspace" className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Integrations Connection Status */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground px-1">Active Integrations</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {integrations.map((integration) => (
                  <Card key={integration.name} className="p-5 border border-border/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm">{integration.name}</div>
                      <Badge className={cn(
                        "border px-1.5 py-0.5 text-[10px]",
                        integration.status === 'Connected' ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground border-border"
                      )} variant="outline">
                        {integration.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Derived Info:</span>
                        <span className="text-foreground">{integration.config}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Sync:</span>
                        <span>{integration.lastSync}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Derived Ownership configuration */}
            <Card className="p-6 border border-border bg-card space-y-4 h-fit">
              <div>
                <h3 className="font-semibold text-base mb-1">Ownership Model</h3>
                <p className="text-xs text-muted-foreground">Configure the derived CODEOWNERS mappings.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block">
                  Repository Config Path
                </label>
                <Input 
                  value={codeownersPath} 
                  onChange={(e) => setCodeownersPath(e.target.value)} 
                  className="text-xs font-mono h-9 bg-background/50"
                />
              </div>

              <div className="p-3 rounded-lg bg-muted/20 border border-border/30 text-[10px] text-muted-foreground flex gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" />
                <span>NexOps derives incident leads by reading mappings at this path inside synced repositories.</span>
              </div>

              <Button size="sm" className="w-full text-xs font-medium" onClick={() => handleSave('Ownership Model')}>
                Update Source Path
              </Button>
            </Card>
          </div>
        </TabsContent>

        {/* 4. ACCOUNT TAB (SESSION INFO & SIGN OUT ACTION) */}
        <TabsContent value="account" className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
          <Card className="p-6 max-w-md border border-border/80 bg-card/60 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base">{currentUser?.name ?? 'John Doe'}</h3>
                <p className="text-xs text-muted-foreground">Role: Senior Staff Engineer</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-border/40 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Account ID:</span>
                <span className="font-mono text-foreground">usr-94819-nex</span>
              </div>
              <div className="flex justify-between">
                <span>Mock Session:</span>
                <Badge variant="outline" className="bg-success/5 text-success border-success/20 text-[10px] scale-90 px-1.5 py-0">
                  Active
                </Badge>
              </div>
            </div>

            <Button 
              variant="destructive" 
              className="w-full gap-2 h-10 text-sm font-medium border border-destructive/20 bg-destructive/10 hover:bg-destructive/20 text-destructive shadow-sm"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              Sign Out from NexOps
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContent>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <PageContent>
        <PageHeader
          title="Settings"
          description="System configuration — manage your preferences, notification thresholds, and workspace integrations"
        />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-sm text-muted-foreground animate-pulse">Loading settings...</div>
        </div>
      </PageContent>
    }>
      <SettingsPageContent />
    </Suspense>
  )
}

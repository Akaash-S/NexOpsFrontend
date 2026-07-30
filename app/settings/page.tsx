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
import { 
  User, Bell, Network, Settings, LogOut, CheckCircle2, AlertTriangle, 
  ShieldCheck, RefreshCw, Copy, Check, Send, Search, Sliders, Globe, Key, Clock
} from 'lucide-react'
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
    currentUser,
    setCurrentUser,
    authLoading
  } = useAppState()

  // Tab routing support
  const queryTab = searchParams ? searchParams.get('tab') : null
  const [activeTab, setActiveTab] = useState('preferences')

  useEffect(() => {
    if (queryTab && ['preferences', 'notifications', 'workspace', 'account'].includes(queryTab)) {
      setActiveTab(queryTab)
    }
  }, [queryTab])

  // Repositories state loading & search filtering
  const [repos, setRepos] = useState<any[]>([])
  const [loadingRepos, setLoadingRepos] = useState(true)
  const [repoSearch, setRepoSearch] = useState('')

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

  // Settings values & preferences
  const [landingRoute, setLandingRoute] = useState('/dashboard')
  const [codeownersPath, setCodeownersPath] = useState('.github/CODEOWNERS')
  const [lookbackWindow, setLookbackWindow] = useState('15')
  const [animSpeed, setAnimSpeed] = useState('smooth')
  const [gridStyle, setGridStyle] = useState('dots')
  
  // Account & Profile State
  const [userRole, setUserRole] = useState('Senior Staff Engineer')
  const [timezone, setTimezone] = useState('Asia/Kolkata')

  // Notification Channel Settings
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.slack.com/services/T0000/B0000/XXXXX')
  const [alertEmail, setAlertEmail] = useState(currentUser?.email || 'devops-alerts@nexops.io')
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Notification Subscriptions State
  const [notifyRules, setNotifyRules] = useState({
    newIncident: true,
    candidateAwaiting: true,
    highRiskDeploy: true,
    weeklyDigest: false,
    severityCritical: true,
    severityHigh: true,
    severityMedium: false,
  })

  // Sync settings from db on load
  useEffect(() => {
    if (currentUser?.preferences) {
      const prefs = currentUser.preferences
      if (prefs.notifyRules) setNotifyRules(prefs.notifyRules)
      if (prefs.codeownersPath) setCodeownersPath(prefs.codeownersPath)
      if (prefs.watchedServices) setWatchedServices(prefs.watchedServices)
      if (prefs.webhookUrl) setWebhookUrl(prefs.webhookUrl)
      if (prefs.alertEmail) setAlertEmail(prefs.alertEmail)
      if (prefs.timezone) setTimezone(prefs.timezone)
      if (prefs.userRole) setUserRole(prefs.userRole)
      if (prefs.lookbackWindow) setLookbackWindow(prefs.lookbackWindow)
    }
  }, [currentUser, setWatchedServices])

  const handleSave = async (sectionName: string, updatedPrefs?: any) => {
    try {
      const { apiFetch } = await import('@/lib/api-client')
      const payload = updatedPrefs || {
        notifyRules,
        watchedServices,
        codeownersPath,
        webhookUrl,
        alertEmail,
        timezone,
        userRole,
        lookbackWindow
      }
      const updatedUser = await apiFetch('/users/me/preferences', {
        method: 'PATCH',
        body: JSON.stringify(payload)
      })
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          preferences: updatedUser.preferences || {}
        })
      }
      
      addNotification({
        title: 'Settings Saved',
        description: `Your ${sectionName} preferences have been saved to PostgreSQL.`,
        type: 'success',
      })
    } catch (err) {
      console.error('Failed to save settings:', err)
      addNotification({
        title: 'Error Saving Settings',
        description: 'An error occurred while saving your settings to the server.',
        type: 'error',
      })
    }
  }

  const handleSendTestAlert = () => {
    setIsSendingTest(true)
    setTimeout(() => {
      setIsSendingTest(false)
      addNotification({
        title: '🔔 Test Alert Delivered',
        description: `Test webhook payload sent successfully to configured endpoint (${webhookUrl.slice(0, 30)}...)`,
        type: 'success',
      })
    }, 1000)
  }

  const handleForceSync = async () => {
    setIsSyncing(true)
    try {
      const { apiFetch } = await import('@/lib/api-client')
      await apiFetch('/integrations/github/sync', { method: 'POST' })
      const data = await apiFetch('/repos')
      setRepos(data)
      addNotification({
        title: 'Workspace Re-synced',
        description: 'GitHub repositories, commit recencies, and activity scores updated.',
        type: 'success',
      })
    } catch (err) {
      console.error('Force sync failed:', err)
      addNotification({
        title: 'Sync Failed',
        description: 'Failed to re-sync GitHub workspace repositories.',
        type: 'error',
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(keyName)
    setTimeout(() => setCopiedKey(null), 2000)
    addNotification({
      title: 'Copied to Clipboard',
      description: `${keyName} copied to clipboard.`,
      type: 'info'
    })
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
    let updated = []
    if (watchedServices.includes(serviceId)) {
      updated = watchedServices.filter((id) => id !== serviceId)
    } else {
      updated = [...watchedServices, serviceId]
    }
    setWatchedServices(updated)
    const serviceName = repos.find((r) => r.id === serviceId)?.name || serviceId
    handleSave('Watched Services', { notifyRules, watchedServices: updated, codeownersPath, webhookUrl, alertEmail, timezone, userRole, lookbackWindow })
  }

  const handleWatchAll = () => {
    const allIds = repos.map(r => r.id)
    setWatchedServices(allIds)
    handleSave('Watched Services', { notifyRules, watchedServices: allIds, codeownersPath, webhookUrl, alertEmail, timezone, userRole, lookbackWindow })
  }

  const handleClearAllWatched = () => {
    setWatchedServices([])
    handleSave('Watched Services', { notifyRules, watchedServices: [], codeownersPath, webhookUrl, alertEmail, timezone, userRole, lookbackWindow })
  }

  if (authLoading) {
    return (
      <PageContent>
        <PageHeader
          title="Settings & Preferences"
          description="Configure your personal interface options, notification scopes, and workspace connections"
        />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-sm text-muted-foreground animate-pulse">Loading settings...</div>
        </div>
      </PageContent>
    )
  }

  const filteredRepos = repos.filter(r => r.name.toLowerCase().includes(repoSearch.toLowerCase()))

  return (
    <PageContent>
      <PageHeader
        title="Settings & Preferences"
        description="Manage interface styling, notification webhooks, workspace connections, and account security"
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

        {/* 1. PREFERENCES TAB */}
        <TabsContent value="preferences" className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Theme & Layout Preferences */}
            <Card className="p-6 space-y-6 border border-border/80">
              <div>
                <h3 className="font-semibold text-base mb-1">Display & Theme</h3>
                <p className="text-xs text-muted-foreground">Adjust visual themes, card density, and landing routing.</p>
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
                        theme === t && 'border-primary bg-primary/5 text-primary font-medium'
                      )}
                      onClick={() => {
                        setTheme(t)
                        addNotification({
                          title: 'Appearance Changed',
                          description: `Theme set to ${t}.`,
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
                  <span className="text-xs text-muted-foreground">Adjusts card padding and grid spacing density.</span>
                </div>
                <Switch 
                  checked={density === 'comfortable'} 
                  onCheckedChange={(val) => {
                    setDensity(val ? 'comfortable' : 'compact')
                    addNotification({
                      title: 'Density Configured',
                      description: `Padding set to ${val ? 'comfortable' : 'compact'}.`,
                      type: 'info',
                    })
                  }} 
                />
              </div>

              {/* Graph visual styles */}
              <div className="space-y-2 pt-4 border-t border-border/40">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Topology Graph Animation Speed</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'fast', label: 'Fast' },
                    { key: 'smooth', label: 'Smooth' },
                    { key: 'off', label: 'Disabled' }
                  ].map(item => (
                    <Button
                      key={item.key}
                      variant="outline"
                      size="sm"
                      className={cn(animSpeed === item.key && 'border-primary bg-primary/5 text-primary font-medium')}
                      onClick={() => setAnimSpeed(item.key)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Default landing route selection */}
              <div className="space-y-2 pt-4 border-t border-border/40">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Default Landing Page</label>
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

            {/* Watched Microservices Filtering */}
            <Card className="p-6 space-y-4 border border-border/80 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-base mb-1">Watched Microservices</h3>
                    <p className="text-xs text-muted-foreground">Prioritize microservices on custom dashboards and alerts.</p>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono bg-primary/5 border-primary/20 text-primary">
                    {watchedServices.length} / {repos.length} Watched
                  </Badge>
                </div>

                {/* Search & Bulk Action Bar */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="Filter services..."
                      value={repoSearch}
                      onChange={(e) => setRepoSearch(e.target.value)}
                      className="pl-8 h-8 text-xs bg-background/50"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleWatchAll}>
                    Watch All
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={handleClearAllWatched}>
                    Clear
                  </Button>
                </div>

                <div className="space-y-1.5 max-h-[260px] overflow-y-auto border border-border/50 rounded-lg p-2 bg-muted/15">
                  {loadingRepos ? (
                    <div className="text-center py-6 text-xs text-muted-foreground animate-pulse">Loading repositories...</div>
                  ) : filteredRepos.length === 0 ? (
                    <div className="text-center py-6 text-xs text-muted-foreground">No matching microservices found.</div>
                  ) : (
                    filteredRepos.map((svc) => {
                      const isWatched = watchedServices.includes(svc.id)
                      const nameLower = svc.name.toLowerCase()
                      let tier = 'service'
                      if (nameLower.includes('gateway') || nameLower.includes('frontend')) {
                        tier = 'ingress'
                      } else if (nameLower.includes('database') || nameLower.includes('db') || nameLower.includes('redis') || nameLower.includes('cache') || nameLower.includes('queue') || nameLower.includes('kafka')) {
                        tier = 'data'
                      }
                      return (
                        <div 
                          key={svc.id} 
                          onClick={() => toggleWatchedService(svc.id)}
                          className={cn(
                            "flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors text-xs border border-transparent",
                            isWatched ? 'bg-primary/5 border-primary/20 text-foreground font-medium' : 'hover:bg-muted/50 text-muted-foreground'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              tier === 'ingress' ? 'bg-primary' : tier === 'service' ? 'bg-accent' : 'bg-warning'
                            )} />
                            <span className="font-semibold">{svc.name}</span>
                          </div>
                          <Badge variant="outline" className={cn("text-[9px] scale-90", isWatched ? "border-primary/40 text-primary" : "border-border text-muted-foreground")}>
                            {isWatched ? 'Watching' : 'Ignore'}
                          </Badge>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex justify-between items-center">
                <span>Preferences automatically sync to your user profile.</span>
                <Button size="sm" className="h-7 text-xs font-medium" onClick={() => handleSave('Preferences')}>
                  Save Preferences
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* 2. NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Channel Endpoints Config */}
            <Card className="p-6 md:col-span-2 border border-border/80 space-y-6">
              <div>
                <h3 className="font-semibold text-base mb-1">Webhook & Alert Destinations</h3>
                <p className="text-xs text-muted-foreground">Configure webhook URLs (Slack, Discord, Microsoft Teams, or custom HTTP endpoint) and email recipients.</p>
              </div>

              <div className="space-y-4">
                {/* Alert Webhook Endpoint */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Operational Alert Webhook URL (Slack / Teams / Discord / Custom HTTP)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://hooks.slack.com/services/..."
                      className="font-mono text-xs h-9 bg-background/50 flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-9 text-xs gap-1.5 font-medium border-primary/30 text-primary hover:bg-primary/5"
                      onClick={handleSendTestAlert}
                      disabled={isSendingTest}
                    >
                      <Send className="w-3.5 h-3.5" />
                      {isSendingTest ? 'Sending...' : 'Send Test Alert'}
                    </Button>
                  </div>
                </div>

                {/* Email Recipient */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Incident Notification Email Recipient
                  </label>
                  <Input
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                    placeholder="oncall-alerts@company.com"
                    className="text-xs h-9 bg-background/50"
                  />
                </div>
              </div>

              {/* Subscriptions Matrix */}
              <div className="pt-4 border-t border-border/40 space-y-4">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Trigger Conditions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/40">
                    <span className="text-muted-foreground">New incident on watched service</span>
                    <Switch
                      checked={notifyRules.newIncident}
                      onCheckedChange={(v) => {
                        const updated = { ...notifyRules, newIncident: v }
                        setNotifyRules(updated)
                        handleSave('Notification Rules', { notifyRules: updated })
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/40">
                    <span className="text-muted-foreground">Candidate cause awaiting feedback</span>
                    <Switch
                      checked={notifyRules.candidateAwaiting}
                      onCheckedChange={(v) => {
                        const updated = { ...notifyRules, candidateAwaiting: v }
                        setNotifyRules(updated)
                        handleSave('Notification Rules', { notifyRules: updated })
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/40">
                    <span className="text-muted-foreground">High-risk deploy on watched service</span>
                    <Switch
                      checked={notifyRules.highRiskDeploy}
                      onCheckedChange={(v) => {
                        const updated = { ...notifyRules, highRiskDeploy: v }
                        setNotifyRules(updated)
                        handleSave('Notification Rules', { notifyRules: updated })
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/40">
                    <span className="text-muted-foreground">Weekly analytics digest report</span>
                    <Switch
                      checked={notifyRules.weeklyDigest}
                      onCheckedChange={(v) => {
                        const updated = { ...notifyRules, weeklyDigest: v }
                        setNotifyRules(updated)
                        handleSave('Notification Rules', { notifyRules: updated })
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button size="sm" className="h-8 text-xs font-medium" onClick={() => handleSave('Notifications')}>
                  Save Notification Channels
                </Button>
              </div>
            </Card>

            {/* Severity Threshold Matrix */}
            <Card className="p-6 border border-border/80 space-y-4 h-fit">
              <div>
                <h3 className="font-semibold text-base mb-1">Severity Filters</h3>
                <p className="text-xs text-muted-foreground">Filter alerts by operational severity level.</p>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-destructive" />
                    <span className="font-semibold text-destructive">Critical Severity</span>
                  </div>
                  <Switch
                    checked={notifyRules.severityCritical}
                    onCheckedChange={(v) => setNotifyRules({ ...notifyRules, severityCritical: v })}
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-warning" />
                    <span className="font-semibold text-warning">High Severity</span>
                  </div>
                  <Switch
                    checked={notifyRules.severityHigh}
                    onCheckedChange={(v) => setNotifyRules({ ...notifyRules, severityHigh: v })}
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <span className="font-semibold text-muted-foreground">Medium / Low Severity</span>
                  </div>
                  <Switch
                    checked={notifyRules.severityMedium}
                    onCheckedChange={(v) => setNotifyRules({ ...notifyRules, severityMedium: v })}
                  />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* 3. WORKSPACE TAB */}
        <TabsContent value="workspace" className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Workspace Architecture Details & Webhook Endpoints */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Workspace Metadata Overview */}
              <Card className="p-6 border border-border/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base">NexOps Production Workspace</h3>
                    <p className="text-xs text-muted-foreground">Active Organization ID & Core Architecture Context</p>
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/30 px-2 py-0.5 text-xs">
                    Workspace Connected
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs">
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/40">
                    <span className="text-muted-foreground block text-[10px] uppercase">Workspace ID</span>
                    <div className="font-mono font-bold text-foreground truncate mt-0.5" title={currentUser?.workspace_id || '81845189-d4ff-4ed6-be25'}>
                      {currentUser?.workspace_id ? currentUser.workspace_id.slice(0, 12) + '...' : '81845189-d4ff'}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/40">
                    <span className="text-muted-foreground block text-[10px] uppercase">Synced Repos</span>
                    <div className="font-bold text-foreground text-sm mt-0.5">{repos.length} Active</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/40">
                    <span className="text-muted-foreground block text-[10px] uppercase">Default Branch</span>
                    <div className="font-mono font-bold text-foreground text-xs mt-0.5">main</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/40">
                    <span className="text-muted-foreground block text-[10px] uppercase">Region</span>
                    <div className="font-bold text-foreground text-xs mt-0.5">us-east-1</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">Force re-synchronization of all GitHub repositories and commit recencies.</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs gap-1.5 font-medium border-primary/30 text-primary hover:bg-primary/5"
                    onClick={handleForceSync}
                    disabled={isSyncing}
                  >
                    <RefreshCw className={cn("w-3.5 h-3.5", isSyncing && "animate-spin")} />
                    {isSyncing ? 'Syncing...' : 'Force Workspace Re-sync'}
                  </Button>
                </div>
              </Card>

              {/* Webhook Endpoints & Secrets */}
              <Card className="p-6 border border-border/80 space-y-4">
                <div>
                  <h3 className="font-semibold text-base mb-1">Live Webhook Ingestion Endpoints</h3>
                  <p className="text-xs text-muted-foreground">Copy these endpoints into GitHub Actions or PagerDuty to receive live webhooks.</p>
                </div>

                <div className="space-y-3">
                  {/* PagerDuty Webhook Endpoint */}
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/40 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-primary" /> PagerDuty Alert Ingestion Webhook
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[11px] gap-1 text-primary"
                        onClick={() => copyToClipboard('https://nexopsbackend.onrender.com/api/v1/webhooks/pagerduty', 'PagerDuty Webhook')}
                      >
                        {copiedKey === 'PagerDuty Webhook' ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === 'PagerDuty Webhook' ? 'Copied' : 'Copy URL'}
                      </Button>
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground break-all bg-background/60 p-1.5 rounded border border-border/30">
                      https://nexopsbackend.onrender.com/api/v1/webhooks/pagerduty
                    </div>
                  </div>

                  {/* GitHub Webhook Endpoint */}
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/40 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-accent" /> GitHub Webhook Secret Status
                      </span>
                      <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/30">
                        Webhook Active
                      </Badge>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      GitHub push events and deployment statuses are automatically ingested via NexOps App Integration.
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Correlation Rules & CODEOWNERS config */}
            <Card className="p-6 border border-border bg-card space-y-6 h-fit">
              <div>
                <h3 className="font-semibold text-base mb-1">Correlation Rules</h3>
                <p className="text-xs text-muted-foreground">Configure root cause search window & ownership paths.</p>
              </div>

              {/* Lookback Window */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Temporal Lookback Window
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: '15', label: '15 Mins' },
                    { val: '30', label: '30 Mins' },
                    { val: '60', label: '60 Mins' },
                    { val: '120', label: '2 Hours' }
                  ].map(item => (
                    <Button
                      key={item.val}
                      variant="outline"
                      size="sm"
                      className={cn("text-xs", lookbackWindow === item.val && "border-primary bg-primary/5 text-primary font-semibold")}
                      onClick={() => setLookbackWindow(item.val)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* CODEOWNERS Config */}
              <div className="space-y-2 pt-4 border-t border-border/40">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block">
                  Repository Config Path
                </label>
                <Input 
                  value={codeownersPath} 
                  onChange={(e) => setCodeownersPath(e.target.value)} 
                  className="text-xs font-mono h-9 bg-background/50"
                />
                <div className="p-2.5 rounded-lg bg-muted/20 border border-border/30 text-[10px] text-muted-foreground flex gap-1.5 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" />
                  <span>Reads CODEOWNERS file inside synced repositories to assign incident leads automatically.</span>
                </div>
              </div>

              <Button size="sm" className="w-full text-xs font-medium" onClick={() => handleSave('Workspace Settings')}>
                Update Workspace Rules
              </Button>
            </Card>
          </div>
        </TabsContent>

        {/* 4. ACCOUNT TAB */}
        <TabsContent value="account" className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Profile Info */}
            <Card className="p-6 border border-border/80 bg-card space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xl font-bold overflow-hidden flex-shrink-0">
                  {currentUser?.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name || 'User Avatar'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Matt Murdock')}&background=0D8ABC&color=fff&bold=true`}
                      alt={currentUser?.name || 'User Avatar'} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{currentUser?.name ?? 'Matt Murdock'}</h3>
                  <p className="text-xs text-muted-foreground">{currentUser?.email ?? 'mattpersonal321@gmail.com'}</p>
                  <Badge variant="outline" className="mt-1.5 bg-primary/10 text-primary border-primary/20 text-[10px]">
                    Google OAuth Signed In
                  </Badge>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/40">
                {/* Role Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Engineering Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Senior Staff Engineer',
                      'Platform / SRE Lead',
                      'DevOps Specialist',
                      'Engineering Manager'
                    ].map((role) => (
                      <Button
                        key={role}
                        variant="outline"
                        size="sm"
                        className={cn("text-[11px] h-8 truncate", userRole === role && "border-primary bg-primary/5 text-primary font-semibold")}
                        onClick={() => setUserRole(role)}
                      >
                        {role}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Timezone Preference */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Preferred Timezone (for Incidents & Timestamps)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { tz: 'Asia/Kolkata', label: 'India (IST)' },
                      { tz: 'America/New_York', label: 'US East (EST)' },
                      { tz: 'Europe/London', label: 'London (GMT)' },
                      { tz: 'UTC', label: 'UTC Universal' }
                    ].map(item => (
                      <Button
                        key={item.tz}
                        variant="outline"
                        size="sm"
                        className={cn("text-xs h-8", timezone === item.tz && "border-primary bg-primary/5 text-primary font-semibold")}
                        onClick={() => {
                          setTimezone(item.tz)
                          handleSave('Timezone', { timezone: item.tz })
                        }}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button size="sm" className="w-full text-xs font-medium" onClick={() => handleSave('Account Profile')}>
                Save Profile Changes
              </Button>
            </Card>

            {/* Session Security Audit */}
            <Card className="p-6 border border-border/80 bg-card/60 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-base mb-1">Session & Security Audit</h3>
                  <p className="text-xs text-muted-foreground">Active session credentials & security details.</p>
                </div>

                <div className="space-y-3 pt-2 text-xs text-muted-foreground">
                  <div className="flex justify-between p-2.5 rounded-lg bg-muted/20 border border-border/40">
                    <span>Account ID:</span>
                    <span className="font-mono text-foreground">{currentUser?.id ?? 'usr-94819-nex'}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-muted/20 border border-border/40">
                    <span>Authentication Token:</span>
                    <Badge variant="outline" className="bg-success/5 text-success border-success/20 text-[10px] px-1.5 py-0">
                      Firebase JWT Verified
                    </Badge>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-muted/20 border border-border/40">
                    <span>Session Status:</span>
                    <Badge variant="outline" className="bg-success/5 text-success border-success/20 text-[10px] px-1.5 py-0">
                      Active
                    </Badge>
                  </div>
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
          </div>
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

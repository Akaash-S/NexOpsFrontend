'use client'

import { useState, useMemo } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Lock, Bell, Globe, Shield, Search, Loader2 } from 'lucide-react'
import { AUDIT_LOGS_DATA } from '@/lib/mock-data'
import { useAppState } from '@/lib/hooks/use-app-state'

export default function SettingsPage() {
  const { addNotification } = useAppState()
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  // Search State for Audit Logs
  const [searchAudit, setSearchAudit] = useState('')

  // Settings State
  const [settings, setSettings] = useState({
    workspaceName: 'NexOps Engineering',
    timezone: 'UTC',
    currency: 'USD',
    twoFactor: true,
    ipWhitelist: false,
    sessionTimeout: true,
    enforceHttps: true,
    alertCritical: true,
    alertHigh: true,
    alertMedium: false,
    dailyDigest: true,
  })

  const filteredLogs = useMemo(() => {
    if (!searchAudit) return AUDIT_LOGS_DATA
    const searchLower = searchAudit.toLowerCase()
    return AUDIT_LOGS_DATA.filter(log => 
      log.user.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower) ||
      log.type.toLowerCase().includes(searchLower)
    )
  }, [searchAudit])

  const handleSave = (sectionName: string) => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      addNotification({
        title: 'Settings Saved',
        description: `Your ${sectionName} settings have been updated successfully.`,
        type: 'success',
      })
    }, 800)
  }

  const updateSetting = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <>
      <PageContent>
        <PageHeader
          title="Settings"
          description="Workspace configuration, security policies, and administrative controls"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="general" className="gap-2">
              <Globe className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <Lock className="w-4 h-4" />
              Audit Logs
            </TabsTrigger>
          </TabsList>

          {/* General */}
          <TabsContent value="general" className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
            <Card className="p-6 max-w-2xl">
              <h3 className="font-semibold mb-4 text-lg">Workspace Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Workspace Name</label>
                  <Input 
                    value={settings.workspaceName} 
                    onChange={(e) => updateSetting('workspaceName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Timezone</label>
                  <Input 
                    value={settings.timezone} 
                    onChange={(e) => updateSetting('timezone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Currency</label>
                  <Input 
                    value={settings.currency} 
                    onChange={(e) => updateSetting('currency', e.target.value)}
                  />
                </div>
                <div className="pt-4 border-t border-border">
                  <Button onClick={() => handleSave('General')} disabled={isSaving}>
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 text-lg">Security Policies</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Two-Factor Authentication Required</label>
                    <Switch checked={settings.twoFactor} onCheckedChange={(v) => { updateSetting('twoFactor', v); handleSave('Security') }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">IP Whitelist Enabled</label>
                    <Switch checked={settings.ipWhitelist} onCheckedChange={(v) => { updateSetting('ipWhitelist', v); handleSave('Security') }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Session Timeout (30 min)</label>
                    <Switch checked={settings.sessionTimeout} onCheckedChange={(v) => { updateSetting('sessionTimeout', v); handleSave('Security') }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Enforce HTTPS</label>
                    <Switch checked={settings.enforceHttps} onCheckedChange={(v) => { updateSetting('enforceHttps', v); handleSave('Security') }} />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4 text-lg">API Security</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Rate Limiting</span>
                    <span className="text-sm font-semibold">1000 req/min</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Token Expiration</span>
                    <span className="text-sm font-semibold">90 days</span>
                  </div>
                  <div className="pt-4 mt-2 border-t border-border">
                    <Button variant="outline" className="w-full">Manage API Keys</Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
            <Card className="p-6 max-w-2xl">
              <h3 className="font-semibold mb-4 text-lg">Notification Preferences</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-2 rounded hover:bg-muted/30 transition-colors">
                  <div>
                    <label className="text-sm font-medium block">Critical Alerts</label>
                    <span className="text-xs text-muted-foreground">Instant delivery via SMS and PagerDuty</span>
                  </div>
                  <Switch checked={settings.alertCritical} onCheckedChange={(v) => { updateSetting('alertCritical', v); handleSave('Notifications') }} />
                </div>
                <div className="flex items-center justify-between p-2 rounded hover:bg-muted/30 transition-colors">
                  <div>
                    <label className="text-sm font-medium block">High Priority</label>
                    <span className="text-xs text-muted-foreground">Immediate delivery via Email and Slack</span>
                  </div>
                  <Switch checked={settings.alertHigh} onCheckedChange={(v) => { updateSetting('alertHigh', v); handleSave('Notifications') }} />
                </div>
                <div className="flex items-center justify-between p-2 rounded hover:bg-muted/30 transition-colors">
                  <div>
                    <label className="text-sm font-medium block">Medium Priority</label>
                    <span className="text-xs text-muted-foreground">Batched delivery via Email every 1 hour</span>
                  </div>
                  <Switch checked={settings.alertMedium} onCheckedChange={(v) => { updateSetting('alertMedium', v); handleSave('Notifications') }} />
                </div>
                <div className="flex items-center justify-between p-2 rounded hover:bg-muted/30 transition-colors">
                  <div>
                    <label className="text-sm font-medium block">Daily Digest</label>
                    <span className="text-xs text-muted-foreground">Summary of all operations sent at 8:00 AM</span>
                  </div>
                  <Switch checked={settings.dailyDigest} onCheckedChange={(v) => { updateSetting('dailyDigest', v); handleSave('Notifications') }} />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Audit Logs */}
          <TabsContent value="audit" className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Audit Log</h3>
                  <p className="text-sm text-muted-foreground mt-1">A verifiable record of all administrative actions taken in the workspace.</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search logs..." 
                    className="pl-9 w-full"
                    value={searchAudit}
                    onChange={(e) => setSearchAudit(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map(log => (
                    <div key={log.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 rounded-lg border border-border transition-colors">
                      <div className="flex items-center gap-3 mb-2 sm:mb-0">
                        <div className={`w-2 h-2 rounded-full ${
                          log.type === 'security' ? 'bg-destructive' : 
                          log.type === 'infrastructure' ? 'bg-primary' : 
                          log.type === 'integration' ? 'bg-info' : 'bg-muted-foreground'
                        }`} />
                        <div>
                          <span className="font-semibold text-sm mr-2">{log.user}</span>
                          <span className="text-sm text-muted-foreground">{log.action}</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground flex shrink-0 sm:ml-4 bg-background px-2 py-1 rounded-md border border-border">
                        {log.time}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg bg-muted/20">
                    <p>No audit logs found matching your search.</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button variant="outline" disabled>Load More Events</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </PageContent>
    </>
  )
}

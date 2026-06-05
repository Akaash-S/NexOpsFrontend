'use client'

import { PageContent, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Lock, Bell, Globe, Shield } from 'lucide-react'

export default function SettingsPage() {
  return (
    <>
      
      <>
        <PageContent>
          <PageHeader
            title="Settings"
            description="Workspace configuration, security policies, and administrative controls"
          />

          <Tabs defaultValue="general" className="space-y-6">
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
            <TabsContent value="general" className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Workspace Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Workspace Name</label>
                    <Input defaultValue="NexOps Engineering" className="mt-2" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Timezone</label>
                    <Input defaultValue="UTC" className="mt-2" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Currency</label>
                    <Input defaultValue="USD" className="mt-2" />
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security" className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Security Policies</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Two-Factor Authentication Required</label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">IP Whitelist Enabled</label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Session Timeout (30 min)</label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Enforce HTTPS</label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">API Security</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <span className="text-sm">Rate Limiting</span>
                    <span className="text-sm font-semibold">1000 req/min</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <span className="text-sm">Token Expiration</span>
                    <span className="text-sm font-semibold">90 days</span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Critical Alerts (Instant)</label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">High Priority (Email + Slack)</label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Medium Priority (Email)</label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Daily Digest</label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Audit Logs */}
            <TabsContent value="audit" className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Audit Log</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded text-sm">
                    <span>Sarah Chen enabled two-factor authentication</span>
                    <span className="text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded text-sm">
                    <span>Marcus Johnson invited Elena Rodriguez</span>
                    <span className="text-muted-foreground">5 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded text-sm">
                    <span>Integration configured: GitHub Enterprise</span>
                    <span className="text-muted-foreground">1 day ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded text-sm">
                    <span>Security policy updated by Admin</span>
                    <span className="text-muted-foreground">3 days ago</span>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </PageContent>
      </>
    </>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { X, ArrowLeft, ArrowRight, CheckCircle2, Plug, Key, Shield, Activity, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAppState } from '@/lib/hooks/use-app-state'
import { cn } from '@/lib/utils'

interface ConnectIntegrationDrawerProps {
  onSuccess: (integrationData: any) => void
}

const STEPS = [
  { id: 1, title: 'Provider', desc: 'Select Tool' },
  { id: 2, title: 'Auth', desc: 'Credentials' },
  { id: 3, title: 'Scope', desc: 'Permissions' },
  { id: 4, title: 'Test', desc: 'Verify & Connect' },
]

const PROVIDERS = [
  { id: 'github', name: 'GitHub', category: 'Source Control' },
  { id: 'gitlab', name: 'GitLab', category: 'Source Control' },
  { id: 'aws', name: 'AWS', category: 'Cloud Provider' },
  { id: 'gcp', name: 'Google Cloud', category: 'Cloud Provider' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'Infrastructure' },
  { id: 'datadog', name: 'Datadog', category: 'Monitoring' },
  { id: 'slack', name: 'Slack', category: 'Communication' },
  { id: 'pagerduty', name: 'PagerDuty', category: 'Incident Management' },
]

export function ConnectIntegrationDrawer({ onSuccess }: ConnectIntegrationDrawerProps) {
  const { isConnectIntegrationOpen, setConnectIntegrationOpen, addNotification } = useAppState()
  const [step, setStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    providerId: '',
    apiKey: '',
    apiSecret: '',
    scope: 'read_write',
  })

  useEffect(() => {
    if (isConnectIntegrationOpen) {
      document.body.style.overflow = 'hidden'
      setStep(1)
      setIsSuccess(false)
      setIsExecuting(false)
      setIsAnimatingOut(false)
      setFormData({
        providerId: '',
        apiKey: '',
        apiSecret: '',
        scope: 'read_write',
      })
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isConnectIntegrationOpen])

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setConnectIntegrationOpen(false)
      setIsAnimatingOut(false)
    }, 300)
  }

  const handleExecute = () => {
    setIsExecuting(true)
    
    // Fake execution delay
    setTimeout(() => {
      setIsExecuting(false)
      setIsSuccess(true)
      
      const provider = PROVIDERS.find(p => p.id === formData.providerId)
      onSuccess({
        id: `int-new-${Date.now()}`,
        name: provider?.name || 'New Integration',
        status: 'connected',
        lastSync: 'just now',
        health: 'healthy',
        config: 'Newly configured scope',
      })
      
      addNotification({
        title: 'Integration Connected',
        description: `Successfully connected to ${provider?.name || 'the service'} and validated credentials.`,
        type: 'success'
      })
    }, 2000)
  }

  const isNextDisabled = () => {
    if (step === 1 && !formData.providerId) return true
    if (step === 2 && (!formData.apiKey || !formData.apiSecret)) return true
    return false
  }

  if (!isConnectIntegrationOpen && !isAnimatingOut) return null

  return (
    <>
      <div
        className={cn("fixed inset-0 bg-black/50 z-40 transition-opacity duration-300", isAnimatingOut ? "opacity-0" : "opacity-100")}
        onClick={handleClose}
      />

      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[700px] lg:w-[800px] bg-background border-l border-border shadow-xl transform transition-transform duration-300 z-50 flex flex-col",
          (isConnectIntegrationOpen && !isAnimatingOut) ? "translate-x-0" : "translate-x-full"
        )}
      >
        {!isSuccess ? (
          <>
            <div className="bg-background border-b border-border p-6 pb-0">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                    <Plug className="w-6 h-6 text-primary" /> Connect Integration
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                    Link external tools to NexOps for central observability and automation.
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center justify-between pb-6 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-muted -z-10" />
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-primary -z-10 transition-all duration-300"
                  style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
                />
                
                {STEPS.map((s) => {
                  const isActive = step === s.id;
                  const isCompleted = step > s.id;
                  
                  return (
                    <div key={s.id} className="flex flex-col items-center gap-2">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 border-2",
                        isActive || isCompleted ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted text-muted-foreground"
                      )}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                      </div>
                      <div className="text-center hidden sm:block">
                        <p className={cn("text-xs font-semibold", isActive ? "text-foreground" : "text-muted-foreground")}>{s.title}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <ScrollArea className="flex-1 min-h-0 bg-muted/20">
              <div className="p-6">
                {step === 1 && <StepProvider formData={formData} setFormData={setFormData} />}
                {step === 2 && <StepAuth formData={formData} setFormData={setFormData} />}
                {step === 3 && <StepScope formData={formData} setFormData={setFormData} />}
                {step === 4 && <StepTest formData={formData} isExecuting={isExecuting} />}
              </div>
            </ScrollArea>

            <div className="bg-background border-t border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={step === 1 ? handleClose : () => setStep(step - 1)} disabled={isExecuting}>
                  {step === 1 ? 'Cancel' : (
                    <>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </>
                  )}
                </Button>
              </div>
              
              <Button 
                onClick={step === STEPS.length ? handleExecute : () => setStep(step + 1)}
                className="gap-2"
                disabled={isExecuting || isNextDisabled()}
              >
                {step === STEPS.length ? (isExecuting ? 'Connecting...' : 'Connect') : 'Continue'}
                {step !== STEPS.length && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </>
        ) : (
          <SuccessState handleClose={handleClose} />
        )}
      </div>
    </>
  )
}

function StepProvider({ formData, setFormData }: any) {
  const [search, setSearch] = useState('')
  
  const filtered = PROVIDERS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-4">Select Provider</h3>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search providers..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {filtered.map(p => (
              <div 
                key={p.id}
                onClick={() => setFormData({...formData, providerId: p.id})}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-colors flex items-center gap-3",
                  formData.providerId === p.id ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 text-foreground"
                )}
              >
                <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0 font-bold text-lg">
                  {p.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-sm">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

function StepAuth({ formData, setFormData }: any) {
  const provider = PROVIDERS.find(p => p.id === formData.providerId)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
              {provider?.name[0]}
            </div>
            <div>
              <h3 className="font-semibold text-lg">Authenticate with {provider?.name}</h3>
              <p className="text-sm text-muted-foreground">Provide API credentials to establish a secure connection.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1.5 block">API Key / Client ID <span className="text-destructive">*</span></label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Enter API Key" 
                  className="pl-9"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">API Secret / Access Token <span className="text-destructive">*</span></label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="password"
                  placeholder="Enter Secret" 
                  className="pl-9"
                  value={formData.apiSecret}
                  onChange={(e) => setFormData({...formData, apiSecret: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Shield className="w-3 h-3" /> Credentials are encrypted at rest using AES-256.
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function StepScope({ formData, setFormData }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-1">Authorization Scope</h3>
          <p className="text-sm text-muted-foreground mb-6">Define what NexOps is allowed to do with this integration.</p>
          
          <div className="space-y-3">
            {[
              { id: 'read_only', label: 'Read Only', desc: 'Allows NexOps to fetch data and metrics, but not make any changes.' },
              { id: 'read_write', label: 'Read & Write', desc: 'Allows NexOps to fetch data and execute automated actions.' },
              { id: 'admin', label: 'Full Admin', desc: 'Grants NexOps full administrative control over the target resource.' }
            ].map(s => (
              <div 
                key={s.id}
                onClick={() => setFormData({...formData, scope: s.id})}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-colors flex items-start gap-3",
                  formData.scope === s.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                )}
              >
                <div className={cn("w-4 h-4 rounded-full mt-0.5 shrink-0 border", formData.scope === s.id ? "border-primary bg-primary" : "border-muted-foreground")} />
                <div>
                  <div className={cn("font-semibold text-sm", formData.scope === s.id ? "text-primary" : "text-foreground")}>{s.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

function StepTest({ formData, isExecuting }: any) {
  const provider = PROVIDERS.find(p => p.id === formData.providerId)

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto space-y-6">
      <Card className="overflow-hidden border-primary/20 shadow-sm p-0 gap-0">
        <div className="bg-primary/5 p-6 border-b border-primary/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            {isExecuting ? (
              <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Activity className="w-6 h-6" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{isExecuting ? 'Testing Connection...' : 'Ready to Connect'}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isExecuting ? `Validating credentials with ${provider?.name}...` : `NexOps will now verify the connection to ${provider?.name}.`}
            </p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Provider</span>
              <span className="font-medium text-foreground text-lg">{provider?.name}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Scope</span>
              <span className="font-medium text-foreground capitalize">{formData.scope.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function SuccessState({ handleClose }: any) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6 border-4 border-success/20">
        <CheckCircle2 className="w-10 h-10 text-success" />
      </div>
      <h2 className="text-3xl font-bold mb-3">Connection Successful</h2>
      <p className="text-muted-foreground mb-10 max-w-md mx-auto">
        NexOps has successfully authenticated and verified the integration. Data synchronization will begin momentarily.
      </p>

      <div className="space-y-3 w-full max-w-sm">
        <Button className="w-full" onClick={handleClose}>
          Done
        </Button>
      </div>
    </div>
  )
}

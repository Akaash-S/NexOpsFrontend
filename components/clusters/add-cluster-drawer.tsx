'use client'

import { useState, useEffect } from 'react'
import { X, ArrowLeft, ArrowRight, CheckCircle2, Circle, Plus, Check, Settings2, Shield, Activity, Database, GitBranch, Github, Slack, Blocks, Zap, Search, GripVertical, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAppState } from '@/lib/hooks/use-app-state'
import { mockServices } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface AddClusterDrawerProps {
  onSuccess: (newCluster: any) => void
}

const STEPS = [
  { id: 1, title: 'Details', desc: 'Identity' },
  { id: 2, title: 'Ownership', desc: 'Responsibility' },
  { id: 3, title: 'Services', desc: 'Attach services' },
  { id: 4, title: 'Integrations', desc: 'Connect systems' },
  { id: 5, title: 'Intelligence', desc: 'Behavior' },
  { id: 6, title: 'Review', desc: 'Final check' },
]

export function AddClusterDrawer({ onSuccess }: AddClusterDrawerProps) {
  const { isAddClusterOpen, setAddClusterOpen, addNotification } = useAppState()
  const [step, setStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'Product Domain',
    description: '',
    color: 'bg-primary/20 text-primary',
    environments: ['Development', 'Staging', 'Production'],
    
    ownerTeam: '',
    clusterLead: '',
    notificationChannel: '',
    onCallGroup: '',
    visibility: 'Workspace',
    
    selectedServices: [] as any[],
    
    integrations: {
      github: 'connected',
      datadog: 'connect',
      aws: 'connected',
      slack: 'connect',
    },

    healthModel: 'Balanced',
    incidentSensitivity: 50,
    riskAnalysis: true,
    dependencyTracking: true,
    recommendations: true,
    alertAggregation: true,
  })

  // Close animation state
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  useEffect(() => {
    if (isAddClusterOpen) {
      setStep(1)
      setIsSuccess(false)
      setIsAnimatingOut(false)
    }
  }, [isAddClusterOpen])

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setAddClusterOpen(false)
      setIsAnimatingOut(false)
    }, 300)
  }

  const handleCreate = () => {
    setIsSuccess(true)
    const newCluster = {
      id: `cluster-${Date.now()}`,
      name: formData.name || 'New Engineering Domain',
      region: 'global',
      provider: 'custom',
      health: 100,
      status: 'healthy',
      nodes: 0,
      services: formData.selectedServices.length,
      incidents: 0,
      lastSync: 'Just now',
      capacity: 50,
      version: '1.0.0',
      criticalDeps: 0,
    }
    onSuccess(newCluster)
    addNotification({
      title: 'Cluster Created',
      description: `Successfully created ${newCluster.name}`,
      type: 'success'
    })
  }

  if (!isAddClusterOpen && !isAnimatingOut) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn("fixed inset-0 bg-black/50 z-40 transition-opacity duration-300", isAnimatingOut ? "opacity-0" : "opacity-100")}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[700px] lg:w-[800px] bg-background border-l border-border shadow-xl transform transition-transform duration-300 z-50 flex flex-col",
          (isAddClusterOpen && !isAnimatingOut) ? "translate-x-0" : "translate-x-full"
        )}
      >
        {!isSuccess ? (
          <>
            {/* Header */}
            <div className="bg-background border-b border-border p-6 pb-0">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Create Cluster</h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                    Create a new engineering domain to organize services, ownership, health, deployments, and intelligence.
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Progress Indicator */}
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
                        isActive ? "bg-primary text-primary-foreground border-primary" : 
                        isCompleted ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted text-muted-foreground"
                      )}>
                        {isCompleted ? <Check className="w-4 h-4" /> : s.id}
                      </div>
                      <div className="text-center hidden sm:block">
                        <p className={cn("text-xs font-semibold", isActive ? "text-foreground" : "text-muted-foreground")}>{s.title}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1 min-h-0 bg-muted/20">
              <div className="p-6">
                {step === 1 && <StepDetails formData={formData} setFormData={setFormData} />}
                {step === 2 && <StepOwnership formData={formData} setFormData={setFormData} />}
                {step === 3 && <StepServices formData={formData} setFormData={setFormData} />}
                {step === 4 && <StepIntegrations formData={formData} setFormData={setFormData} />}
                {step === 5 && <StepIntelligence formData={formData} setFormData={setFormData} />}
                {step === 6 && <StepReview formData={formData} />}
              </div>
            </ScrollArea>

            {/* Footer Actions */}
            <div className="bg-background border-t border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={step === 1 ? handleClose : () => setStep(step - 1)}>
                  {step === 1 ? 'Cancel' : (
                    <>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </>
                  )}
                </Button>
                <Button variant="ghost" onClick={handleClose}>
                  Save Draft
                </Button>
              </div>
              
              <Button 
                onClick={step === 6 ? handleCreate : () => setStep(step + 1)}
                className="gap-2"
              >
                {step === 6 ? 'Create Cluster' : 'Continue'}
                {step !== 6 && <ArrowRight className="w-4 h-4" />}
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

function StepDetails({ formData, setFormData }: any) {
  const types = ['Product Domain', 'Platform', 'Infrastructure', 'Data', 'Security', 'Custom']
  const envs = ['Development', 'Staging', 'Production']

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold mb-1.5 block">Cluster Name <span className="text-destructive">*</span></label>
          <Input 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            placeholder="e.g. Frontend Platform" 
            className="max-w-md"
          />
        </div>
        
        <div>
          <label className="text-sm font-semibold mb-1.5 block">Cluster Type <span className="text-destructive">*</span></label>
          <div className="flex flex-wrap gap-2">
            {types.map(t => (
              <Badge 
                key={t}
                variant={formData.type === t ? 'default' : 'outline'}
                className="cursor-pointer text-sm py-1.5 px-3"
                onClick={() => setFormData({...formData, type: t})}
              >
                {t}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-1.5 block">Description</label>
          <textarea 
            className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 max-w-xl"
            placeholder="Describe responsibilities and operational ownership..."
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div>
          <label className="text-sm font-semibold mb-1.5 block">Environment Scope</label>
          <div className="flex flex-wrap gap-2">
            {envs.map(env => {
              const isSelected = formData.environments.includes(env);
              return (
                <div 
                  key={env}
                  onClick={() => {
                    const newEnvs = isSelected 
                      ? formData.environments.filter((e: string) => e !== env)
                      : [...formData.environments, env];
                    setFormData({...formData, environments: newEnvs});
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer transition-colors text-sm font-medium",
                    isSelected ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  <div className={cn("w-4 h-4 rounded border flex items-center justify-center", isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground")}>
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                  {env}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function StepOwnership({ formData, setFormData }: any) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Owner Team <span className="text-destructive">*</span></label>
            <Input 
              value={formData.ownerTeam} 
              onChange={e => setFormData({...formData, ownerTeam: e.target.value})} 
              placeholder="Search teams..." 
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Cluster Lead</label>
            <Input 
              value={formData.clusterLead} 
              onChange={e => setFormData({...formData, clusterLead: e.target.value})} 
              placeholder="Select user..." 
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Notification Channel</label>
            <Input 
              value={formData.notificationChannel} 
              onChange={e => setFormData({...formData, notificationChannel: e.target.value})} 
              placeholder="#alerts-platform" 
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Visibility</label>
            <div className="flex gap-4">
              {['Private', 'Workspace', 'Public'].map(v => (
                <label key={v} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input 
                    type="radio" 
                    name="visibility" 
                    checked={formData.visibility === v}
                    onChange={() => setFormData({...formData, visibility: v})}
                    className="text-primary focus:ring-primary h-4 w-4"
                  />
                  {v}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div>
          <label className="text-sm font-semibold mb-1.5 block text-muted-foreground">Preview</label>
          <Card className="p-4 border-dashed bg-transparent">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">{formData.name || 'Untitled Cluster'}</p>
                <p className="text-xs text-muted-foreground">{formData.type}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team</span>
                <span className="font-medium">{formData.ownerTeam || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lead</span>
                <span className="font-medium">{formData.clusterLead || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Alerts</span>
                <span className="font-medium">{formData.notificationChannel || 'None'}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StepServices({ formData, setFormData }: any) {
  const toggleService = (service: any) => {
    const isSelected = formData.selectedServices.find((s: any) => s.id === service.id);
    if (isSelected) {
      setFormData({
        ...formData,
        selectedServices: formData.selectedServices.filter((s: any) => s.id !== service.id)
      })
    } else {
      setFormData({
        ...formData,
        selectedServices: [...formData.selectedServices, service]
      })
    }
  }

  return (
    <div className="h-[400px] flex gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Available Services */}
      <div className="flex-1 flex flex-col border border-border rounded-lg bg-background overflow-hidden">
        <div className="p-3 border-b border-border bg-muted/20">
          <h3 className="font-semibold text-sm mb-2">Available Services</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="h-8 pl-8 text-xs" placeholder="Search services..." />
          </div>
        </div>
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {mockServices.map(service => {
              const isSelected = formData.selectedServices.find((s: any) => s.id === service.id);
              if (isSelected) return null;
              return (
                <div 
                  key={service.id}
                  onClick={() => toggleService(service)}
                  className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer group"
                >
                  <div>
                    <p className="text-sm font-medium">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.team}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Selected Services */}
      <div className="flex-1 flex flex-col border border-primary/20 rounded-lg bg-background overflow-hidden">
        <div className="p-3 border-b border-border bg-primary/5 flex items-center justify-between">
          <h3 className="font-semibold text-sm">Selected Services ({formData.selectedServices.length})</h3>
          <Button variant="link" size="sm" className="h-auto p-0 text-xs">Create New</Button>
        </div>
        <ScrollArea className="flex-1 p-2 bg-primary/5">
          {formData.selectedServices.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
              <Blocks className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-sm font-medium">No services attached</p>
              <p className="text-xs mt-1">Select services from the left or create a new one.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {formData.selectedServices.map((service: any) => (
                <div 
                  key={service.id}
                  className="flex items-center gap-2 p-2 bg-background border border-border rounded shadow-sm group"
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab opacity-50 hover:opacity-100" />
                  <div className="flex-1">
                    <p className="text-sm font-medium flex items-center gap-2">
                      {service.name}
                      <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-success/30 text-success bg-success/10">Healthy</Badge>
                    </p>
                    <p className="text-xs text-muted-foreground">{service.environment}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => toggleService(service)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}

function StepIntegrations({ formData, setFormData }: any) {
  const integrations = [
    { id: 'github', name: 'GitHub', desc: 'Source code & PRs', icon: Github, status: formData.integrations.github },
    { id: 'datadog', name: 'Datadog', desc: 'Metrics & Monitors', icon: Activity, status: formData.integrations.datadog },
    { id: 'aws', name: 'AWS', desc: 'Infrastructure', icon: Blocks, status: formData.integrations.aws },
    { id: 'slack', name: 'Slack', desc: 'Alerts & ChatOps', icon: Slack, status: formData.integrations.slack },
    { id: 'kubernetes', name: 'Kubernetes', desc: 'Container orchestration', icon: Blocks, status: 'connect' },
    { id: 'gitlab', name: 'GitLab', desc: 'CI/CD Pipelines', icon: GitBranch, status: 'connect' },
  ];

  const toggleIntegration = (id: string) => {
    setFormData({
      ...formData,
      integrations: {
        ...formData.integrations,
        [id]: formData.integrations[id] === 'connected' ? 'connect' : 'connected'
      }
    })
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map(integ => (
          <Card key={integ.id} className={cn("p-4 transition-all", integ.status === 'connected' ? "border-primary/50 bg-primary/5" : "border-border")}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded bg-background border border-border flex items-center justify-center">
                <integ.icon className="w-5 h-5" />
              </div>
              {integ.status === 'connected' ? (
                <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs">Connected</Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-muted-foreground">Not Configured</Badge>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-sm">{integ.name}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{integ.desc}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-border/50">
              <Button 
                variant={integ.status === 'connected' ? 'outline' : 'default'} 
                size="sm" 
                className="w-full text-xs h-8"
                onClick={() => toggleIntegration(integ.id)}
              >
                {integ.status === 'connected' ? 'Configure' : 'Connect'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function StepIntelligence({ formData, setFormData }: any) {
  return (
    <div className="grid grid-cols-5 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="col-span-3 space-y-6">
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-3">Health Model</h3>
          <div className="grid grid-cols-2 gap-3">
            {['Balanced', 'Delivery Focused', 'Reliability Focused', 'Custom'].map(model => (
              <div 
                key={model}
                onClick={() => setFormData({...formData, healthModel: model})}
                className={cn(
                  "border rounded-md p-3 cursor-pointer transition-colors",
                  formData.healthModel === model ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/30 text-muted-foreground"
                )}
              >
                <p className="text-sm font-medium">{model}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">Incident Sensitivity</h3>
              <p className="text-xs text-muted-foreground">How aggressively AI opens incidents.</p>
            </div>
            <span className="text-sm font-bold text-primary">{formData.incidentSensitivity}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            value={formData.incidentSensitivity}
            onChange={(e) => setFormData({...formData, incidentSensitivity: parseInt(e.target.value)})}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Lenient</span>
            <span>Aggressive</span>
          </div>
        </Card>

        <div className="space-y-3">
          {[
            { id: 'riskAnalysis', label: 'Risk Analysis', desc: 'Score deployment risks automatically' },
            { id: 'dependencyTracking', label: 'Dependency Tracking', desc: 'Map cross-cluster service dependencies' },
            { id: 'recommendations', label: 'AI Recommendations', desc: 'Generate actionable improvement steps' },
            { id: 'alertAggregation', label: 'Alert Aggregation', desc: 'Group related alerts into incidents' },
          ].map(toggle => (
            <div key={toggle.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
              <div>
                <p className="text-sm font-medium">{toggle.label}</p>
                <p className="text-xs text-muted-foreground">{toggle.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={(formData as any)[toggle.id]}
                  onChange={(e) => setFormData({...formData, [toggle.id]: e.target.checked})}
                />
                <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-2">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Live Preview</h3>
        <Card className="p-4 bg-muted/30">
          <div className="flex items-center gap-2 mb-4 text-sm font-medium text-warning">
            <AlertTriangle className="w-4 h-4" />
            Simulated Incident Response
          </div>
          <div className="space-y-3 text-xs">
            <div className="p-2 bg-background border border-border rounded">
              <span className="text-muted-foreground block mb-1">Trigger:</span>
              High latency on {formData.selectedServices[0]?.name || 'Service A'}
            </div>
            <div className="flex justify-center text-muted-foreground">↓</div>
            <div className="p-2 bg-background border border-primary/50 rounded">
              <span className="text-primary block mb-1 font-medium">Action:</span>
              {formData.alertAggregation ? 'Aggregates 3 alerts into 1 Incident' : 'Fires 3 separate alerts'}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function StepReview({ formData }: any) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto space-y-6">
      <Card className="overflow-hidden border-primary/20 shadow-sm">
        <div className="bg-primary/5 p-6 border-b border-primary/10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary mt-1">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{formData.name || 'Unnamed Cluster'}</h2>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="outline" className="bg-background">{formData.type}</Badge>
              <span className="text-sm text-muted-foreground">{formData.environments.join(', ')}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-3">{formData.description || 'No description provided.'}</p>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Ownership</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Team</span>
                <span className="font-medium">{formData.ownerTeam || '—'}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Lead</span>
                <span className="font-medium">{formData.clusterLead || '—'}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Alerts</span>
                <span className="font-medium">{formData.notificationChannel || '—'}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Configuration</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Services</span>
                <span className="font-medium">{formData.selectedServices.length} Attached</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Integrations</span>
                <span className="font-medium">{Object.values(formData.integrations).filter(v => v === 'connected').length} Connected</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Health Model</span>
                <span className="font-medium">{formData.healthModel}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="bg-accent/10 text-accent p-4 rounded-lg flex gap-3 text-sm border border-accent/20">
        <Zap className="w-5 h-5 flex-shrink-0" />
        <p>Creating this cluster will immediately initialize its intelligence models and sync with connected integrations. This process takes a few seconds.</p>
      </div>
    </div>
  )
}

function SuccessState({ handleClose }: any) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-6 border-4 border-success/30">
        <CheckCircle2 className="w-10 h-10 text-success" />
      </div>
      <h2 className="text-3xl font-bold mb-3">Cluster Created</h2>
      <p className="text-muted-foreground mb-10 max-w-sm mx-auto">
        Your new engineering domain has been successfully provisioned and intelligence models are now analyzing data.
      </p>

      <div className="space-y-3 w-full max-w-sm">
        <Button className="w-full" onClick={handleClose}>
          Open Cluster Dashboard
        </Button>
        <Button variant="outline" className="w-full" onClick={handleClose}>
          Add Another Service
        </Button>
        <Button variant="ghost" className="w-full text-muted-foreground" onClick={handleClose}>
          Dismiss
        </Button>
      </div>
    </div>
  )
}

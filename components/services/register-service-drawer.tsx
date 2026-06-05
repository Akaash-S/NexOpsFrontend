'use client'

import { useState, useEffect } from 'react'
import { X, ArrowLeft, ArrowRight, CheckCircle2, Shield, Search, Check, Github, GitBranch, Database, Globe, Box, TerminalSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAppState } from '@/lib/hooks/use-app-state'
import { mockServices } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface RegisterServiceDrawerProps {
  onSuccess: (newService: any) => void
}

const STEPS = [
  { id: 1, title: 'Details', desc: 'Identity' },
  { id: 2, title: 'Ownership', desc: 'Responsibility' },
  { id: 3, title: 'Repository', desc: 'Source Code' },
  { id: 4, title: 'Dependencies', desc: 'Connections' },
  { id: 5, title: 'Review', desc: 'Final check' },
]

export function RegisterServiceDrawer({ onSuccess }: RegisterServiceDrawerProps) {
  const { isRegisterServiceOpen, setRegisterServiceOpen, addNotification } = useAppState()
  const [step, setStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'Backend',
    description: '',
    environments: ['Development', 'Staging', 'Production'],
    
    ownerTeam: '',
    serviceOwner: '',
    slackChannel: '',
    
    repoUrl: '',
    mainBranch: 'main',
    buildCommand: 'npm run build',
    startCommand: 'npm start',

    selectedDependencies: [] as any[],
  })

  // Close animation state
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  useEffect(() => {
    if (isRegisterServiceOpen) {
      document.body.style.overflow = 'hidden'
      setStep(1)
      setIsSuccess(false)
      setIsAnimatingOut(false)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isRegisterServiceOpen])

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setRegisterServiceOpen(false)
      setIsAnimatingOut(false)
    }, 300)
  }

  const handleCreate = () => {
    setIsSuccess(true)
    const newService = {
      id: `service-${Date.now()}`,
      name: formData.name || 'New Service',
      team: formData.ownerTeam || 'Unassigned',
      health: 100,
      status: 'healthy',
      deployments: 0,
      dependencies: formData.selectedDependencies.map(d => d.name),
      dependents: [],
      lastDeployed: 'Just now',
      owner: formData.serviceOwner || 'Unassigned',
      criticality: 'medium',
      changeFailureRate: 0,
      deploymentFrequency: 'daily',
      mttr: '0 min',
      incidents30d: 0,
    }
    onSuccess(newService)
    addNotification({
      title: 'Service Registered',
      description: `Successfully registered ${newService.name}`,
      type: 'success'
    })
  }

  if (!isRegisterServiceOpen && !isAnimatingOut) return null;

  return (
    <>
      <div
        className={cn("fixed inset-0 bg-black/50 z-40 transition-opacity duration-300", isAnimatingOut ? "opacity-0" : "opacity-100")}
        onClick={handleClose}
      />

      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[700px] lg:w-[800px] bg-background border-l border-border shadow-xl transform transition-transform duration-300 z-50 flex flex-col",
          (isRegisterServiceOpen && !isAnimatingOut) ? "translate-x-0" : "translate-x-full"
        )}
      >
        {!isSuccess ? (
          <>
            <div className="bg-background border-b border-border p-6 pb-0">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Register Service</h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                    Add a new microservice to the catalog to track deployments, health, and operational readiness.
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

            <ScrollArea className="flex-1 min-h-0 bg-muted/20">
              <div className="p-6">
                {step === 1 && <StepDetails formData={formData} setFormData={setFormData} />}
                {step === 2 && <StepOwnership formData={formData} setFormData={setFormData} />}
                {step === 3 && <StepRepository formData={formData} setFormData={setFormData} />}
                {step === 4 && <StepDependencies formData={formData} setFormData={setFormData} />}
                {step === 5 && <StepReview formData={formData} />}
              </div>
            </ScrollArea>

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
              </div>
              
              <Button 
                onClick={step === 5 ? handleCreate : () => setStep(step + 1)}
                className="gap-2"
              >
                {step === 5 ? 'Register Service' : 'Continue'}
                {step !== 5 && <ArrowRight className="w-4 h-4" />}
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
  const types = [
    { name: 'Backend API', icon: TerminalSquare },
    { name: 'Frontend', icon: Globe },
    { name: 'Database', icon: Database },
    { name: 'Worker', icon: Box }
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold mb-1.5 block">Service Name <span className="text-destructive">*</span></label>
          <Input 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            placeholder="e.g. auth-service" 
            className="max-w-md"
          />
        </div>
        
        <div>
          <label className="text-sm font-semibold mb-3 block">Service Type <span className="text-destructive">*</span></label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
            {types.map(t => (
              <div 
                key={t.name}
                onClick={() => setFormData({...formData, type: t.name})}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-colors flex flex-col items-center gap-2 text-center",
                  formData.type === t.name ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 text-muted-foreground"
                )}
              >
                <t.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{t.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-1.5 block">Description</label>
          <textarea 
            className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring max-w-xl"
            placeholder="What does this service do?"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>
      </div>
    </div>
  )
}

function StepOwnership({ formData, setFormData }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-md">
      <div>
        <label className="text-sm font-semibold mb-1.5 block">Owner Team <span className="text-destructive">*</span></label>
        <Input 
          value={formData.ownerTeam} 
          onChange={e => setFormData({...formData, ownerTeam: e.target.value})} 
          placeholder="e.g. Identity Team" 
        />
      </div>
      <div>
        <label className="text-sm font-semibold mb-1.5 block">Service Owner (Individual)</label>
        <Input 
          value={formData.serviceOwner} 
          onChange={e => setFormData({...formData, serviceOwner: e.target.value})} 
          placeholder="e.g. Jane Doe" 
        />
      </div>
      <div>
        <label className="text-sm font-semibold mb-1.5 block">Slack Channel</label>
        <Input 
          value={formData.slackChannel} 
          onChange={e => setFormData({...formData, slackChannel: e.target.value})} 
          placeholder="#team-identity-alerts" 
        />
      </div>
    </div>
  )
}

function StepRepository({ formData, setFormData }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-xl">
      <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-background">
        <div className="p-2 bg-muted rounded-md">
          <Github className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <Input 
            value={formData.repoUrl} 
            onChange={e => setFormData({...formData, repoUrl: e.target.value})} 
            placeholder="github.com/organization/repo-name" 
            className="border-none bg-transparent shadow-none px-0 focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-semibold mb-1.5 block">Main Branch</label>
          <div className="relative">
            <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              value={formData.mainBranch} 
              onChange={e => setFormData({...formData, mainBranch: e.target.value})} 
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        <div>
          <label className="text-sm font-semibold mb-1.5 block">Build Command</label>
          <Input 
            value={formData.buildCommand} 
            onChange={e => setFormData({...formData, buildCommand: e.target.value})} 
            className="font-mono text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-semibold mb-1.5 block">Start Command</label>
          <Input 
            value={formData.startCommand} 
            onChange={e => setFormData({...formData, startCommand: e.target.value})} 
            className="font-mono text-sm"
          />
        </div>
      </div>
    </div>
  )
}

function StepDependencies({ formData, setFormData }: any) {
  const toggleDependency = (service: any) => {
    const isSelected = formData.selectedDependencies.find((s: any) => s.id === service.id);
    if (isSelected) {
      setFormData({
        ...formData,
        selectedDependencies: formData.selectedDependencies.filter((s: any) => s.id !== service.id)
      })
    } else {
      setFormData({
        ...formData,
        selectedDependencies: [...formData.selectedDependencies, service]
      })
    }
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <p className="text-sm text-muted-foreground mb-4">Select services that this service relies on to function correctly.</p>
      
      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search for existing services..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl">
        {mockServices.map(service => {
          const isSelected = formData.selectedDependencies.find((s: any) => s.id === service.id);
          return (
            <div 
              key={service.id}
              onClick={() => toggleDependency(service)}
              className={cn(
                "p-3 border rounded-lg cursor-pointer transition-all flex items-center justify-between",
                isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-background hover:border-primary/30"
              )}
            >
              <div>
                <p className="font-medium text-sm">{service.name}</p>
                <p className="text-xs text-muted-foreground">{service.team}</p>
              </div>
              <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center transition-colors", isSelected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground")}>
                {isSelected && <Check className="w-3 h-3" />}
              </div>
            </div>
          )
        })}
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
            <h2 className="text-2xl font-bold">{formData.name || 'Unnamed Service'}</h2>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="outline" className="bg-background">{formData.type}</Badge>
              <Badge variant="secondary">{formData.ownerTeam || 'No Team'}</Badge>
            </div>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Repository</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">URL</span>
                <span className="font-medium truncate max-w-[150px]">{formData.repoUrl || '—'}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Branch</span>
                <span className="font-medium">{formData.mainBranch}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Architecture</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Dependencies</span>
                <span className="font-medium">{formData.selectedDependencies.length} Services</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Environments</span>
                <span className="font-medium">{formData.environments.length} Targets</span>
              </div>
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
      <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-6 border-4 border-success/30">
        <CheckCircle2 className="w-10 h-10 text-success" />
      </div>
      <h2 className="text-3xl font-bold mb-3">Service Registered</h2>
      <p className="text-muted-foreground mb-10 max-w-sm mx-auto">
        Your service has been added to the catalog and is now being analyzed for health and deployments.
      </p>

      <div className="space-y-3 w-full max-w-sm">
        <Button className="w-full" onClick={handleClose}>
          View Service Dashboard
        </Button>
        <Button variant="ghost" className="w-full text-muted-foreground" onClick={handleClose}>
          Dismiss
        </Button>
      </div>
    </div>
  )
}

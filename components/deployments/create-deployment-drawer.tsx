'use client'

import { useState, useEffect } from 'react'
import { X, ArrowLeft, ArrowRight, CheckCircle2, Server, GitCommit, Settings, Check, Cloud, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAppState } from '@/lib/hooks/use-app-state'
import { cn } from '@/lib/utils'

interface CreateDeploymentDrawerProps {
  onSuccess: (newDeployment: any) => void
}

const STEPS = [
  { id: 1, title: 'Target', desc: 'Environment' },
  { id: 2, title: 'Service', desc: 'Select Service' },
  { id: 3, title: 'Strategy', desc: 'Deployment Type' },
  { id: 4, title: 'Review', desc: 'Confirm' },
]

export function CreateDeploymentDrawer({ onSuccess }: CreateDeploymentDrawerProps) {
  const { isCreateDeploymentOpen, setCreateDeploymentOpen, addNotification } = useAppState()
  const [step, setStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    environment: 'production',
    cluster: 'prod-us-east-1',
    service: '',
    version: '',
    strategy: 'rolling',
  })

  // Close animation state
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  useEffect(() => {
    if (isCreateDeploymentOpen) {
      document.body.style.overflow = 'hidden'
      setStep(1)
      setIsSuccess(false)
      setIsAnimatingOut(false)
      setFormData({
        environment: 'production',
        cluster: 'prod-us-east-1',
        service: '',
        version: '',
        strategy: 'rolling',
      })
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isCreateDeploymentOpen])

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setCreateDeploymentOpen(false)
      setIsAnimatingOut(false)
    }, 300)
  }

  const handleCreate = () => {
    setIsSuccess(true)
    
    const newDeployment = {
      id: `dep-${Date.now()}`,
      service: formData.service || 'Unknown Service',
      version: formData.version || 'v1.0.0',
      environment: formData.environment,
      status: 'success',
      riskScore: 12,
      confidence: 98,
      deployedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      duration: '45s',
      changesCount: 3,
      affectedServices: 1,
      blastRadius: 'low',
      rollbackReady: true,
    }
    
    onSuccess(newDeployment)
    
    addNotification({
      title: 'Deployment Triggered',
      description: `Successfully initiated ${formData.strategy} deployment of ${newDeployment.service} to ${formData.environment}`,
      type: 'success'
    })
  }

  if (!isCreateDeploymentOpen && !isAnimatingOut) return null;

  return (
    <>
      <div
        className={cn("fixed inset-0 bg-black/50 z-40 transition-opacity duration-300", isAnimatingOut ? "opacity-0" : "opacity-100")}
        onClick={handleClose}
      />

      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[700px] lg:w-[800px] bg-background border-l border-border shadow-xl transform transition-transform duration-300 z-50 flex flex-col",
          (isCreateDeploymentOpen && !isAnimatingOut) ? "translate-x-0" : "translate-x-full"
        )}
      >
        {!isSuccess ? (
          <>
            <div className="bg-background border-b border-border p-6 pb-0">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">New Deployment</h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                    Deploy a service to an environment safely.
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
                {step === 1 && <StepTarget formData={formData} setFormData={setFormData} />}
                {step === 2 && <StepService formData={formData} setFormData={setFormData} />}
                {step === 3 && <StepStrategy formData={formData} setFormData={setFormData} />}
                {step === 4 && <StepReview formData={formData} />}
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
                onClick={step === 4 ? handleCreate : () => setStep(step + 1)}
                className="gap-2"
                disabled={step === 2 && (!formData.service || !formData.version)}
              >
                {step === 4 ? 'Deploy Now' : 'Continue'}
                {step !== 4 && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </>
        ) : (
          <SuccessState handleClose={handleClose} service={formData.service} environment={formData.environment} />
        )}
      </div>
    </>
  )
}

function StepTarget({ formData, setFormData }: any) {
  const environments = [
    { id: 'production', name: 'Production', icon: Cloud, risk: 'High Risk' },
    { id: 'staging', name: 'Staging', icon: Server, risk: 'Medium Risk' },
    { id: 'qa', name: 'QA', icon: Server, risk: 'Low Risk' },
    { id: 'development', name: 'Development', icon: Server, risk: 'Minimal Risk' },
  ]

  const clusters = [
    { id: 'prod-us-east-1', name: 'US East 1', type: 'Primary' },
    { id: 'prod-eu-west-1', name: 'EU West 1', type: 'Replica' },
    { id: 'global-edge', name: 'Global Edge', type: 'CDN' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Environment</h3>
        <div className="grid grid-cols-2 gap-4">
          {environments.map(env => (
            <div 
              key={env.id}
              onClick={() => setFormData({...formData, environment: env.id})}
              className={cn(
                "border rounded-xl p-4 cursor-pointer transition-colors flex items-center gap-4",
                formData.environment === env.id ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 text-muted-foreground bg-background"
              )}
            >
              <div className={cn("p-2 rounded-lg", formData.environment === env.id ? "bg-primary/10" : "bg-muted")}>
                <env.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground capitalize mb-1">{env.name}</h4>
                <p className="text-xs">{env.risk}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Select Target Cluster</h3>
        <div className="space-y-2">
          {clusters.map(cluster => (
            <div 
              key={cluster.id}
              onClick={() => setFormData({...formData, cluster: cluster.id})}
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-colors flex items-center justify-between",
                formData.cluster === cluster.id ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 text-muted-foreground bg-background"
              )}
            >
              <div className="flex items-center gap-3">
                <Server className="w-4 h-4" />
                <span className="font-medium text-foreground">{cluster.name}</span>
                <span className="text-xs text-muted-foreground">({cluster.id})</span>
              </div>
              <Badge variant="outline">{cluster.type}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepService({ formData, setFormData }: any) {
  const mockServices = [
    'API Gateway',
    'User Service',
    'Auth Service',
    'Payment Processor',
    'Notification Service',
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-xl mx-auto">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Service</h3>
        <div className="grid grid-cols-1 gap-2">
          {mockServices.map(svc => (
            <div 
              key={svc}
              onClick={() => setFormData({...formData, service: svc})}
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-colors flex items-center justify-between",
                formData.service === svc ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 text-muted-foreground bg-background"
              )}
            >
              <span className="font-medium text-foreground">{svc}</span>
              {formData.service === svc && <CheckCircle2 className="w-4 h-4" />}
            </div>
          ))}
        </div>
      </div>

      <Card className="p-6 bg-background space-y-4">
        <div>
          <label className="text-sm font-semibold mb-2 flex items-center gap-2">
            <GitCommit className="w-4 h-4" />
            Version / Tag / Commit
          </label>
          <Input 
            placeholder="e.g., v1.4.2 or 7f8a9c2"
            value={formData.version}
            onChange={(e) => setFormData({...formData, version: e.target.value})}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Specify the exact immutable artifact version to deploy.
          </p>
        </div>
      </Card>
    </div>
  )
}

function StepStrategy({ formData, setFormData }: any) {
  const strategies = [
    { id: 'rolling', name: 'Rolling Update', desc: 'Gradually replace old instances with new ones. Zero downtime.', risk: 'Low' },
    { id: 'canary', name: 'Canary Release', desc: 'Route a small percentage of traffic to the new version before scaling up.', risk: 'Medium' },
    { id: 'blue-green', name: 'Blue/Green', desc: 'Deploy to a parallel idle environment, then switch traffic instantly.', risk: 'Low' },
    { id: 'recreate', name: 'Recreate', desc: 'Terminate all old instances before spinning up new ones. Has downtime.', risk: 'High' },
  ]

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">Deployment Strategy</h3>
      <div className="grid grid-cols-1 gap-3">
        {strategies.map(strat => (
          <div 
            key={strat.id}
            onClick={() => setFormData({...formData, strategy: strat.id})}
            className={cn(
              "border rounded-xl p-5 cursor-pointer transition-colors flex items-start gap-4",
              formData.strategy === strat.id ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50 bg-background"
            )}
          >
            <div className={cn("mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0", formData.strategy === strat.id ? "border-primary" : "border-muted-foreground")}>
              {formData.strategy === strat.id && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-foreground">{strat.name}</h4>
                <Badge variant="outline" className={strat.risk === 'High' ? 'text-destructive border-destructive' : strat.risk === 'Medium' ? 'text-warning border-warning' : 'text-success border-success'}>
                  {strat.risk} Risk
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{strat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepReview({ formData }: any) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto space-y-6">
      <Card className="overflow-hidden border-primary/20 shadow-sm">
        <div className="bg-primary/5 p-6 border-b border-primary/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Review Deployment</h2>
            <p className="text-sm text-muted-foreground mt-1">Please confirm the parameters before launching.</p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Service</span>
              <span className="font-medium text-sm text-foreground">{formData.service}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Version</span>
              <Badge variant="secondary" className="font-mono">{formData.version}</Badge>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Target Environment</span>
              <span className="font-medium text-sm text-foreground capitalize">{formData.environment}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Cluster</span>
              <span className="font-medium text-sm text-foreground">{formData.cluster}</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Strategy</span>
              <span className="font-medium text-sm text-foreground capitalize">{formData.strategy.replace('-', ' ')}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/20 rounded-lg text-warning">
        <Settings className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="text-sm">
          <strong>Notice:</strong> This action will mutate state in the {formData.environment} environment. Automated health checks will monitor the rollout.
        </p>
      </div>
    </div>
  )
}

function SuccessState({ handleClose, service, environment }: any) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-6 border-4 border-success/30">
        <Rocket className="w-10 h-10 text-success" />
      </div>
      <h2 className="text-3xl font-bold mb-3">Deployment Initiated!</h2>
      <p className="text-muted-foreground mb-10 max-w-md mx-auto">
        <strong>{service}</strong> is now rolling out to <strong>{environment}</strong>.
        You can track the progress in the deployments table.
      </p>

      <div className="space-y-3 w-full max-w-sm">
        <Button className="w-full" onClick={handleClose}>
          View Deployment Status
        </Button>
      </div>
    </div>
  )
}

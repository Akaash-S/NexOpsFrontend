'use client'

import { useState, useEffect } from 'react'
import { X, ArrowLeft, ArrowRight, CheckCircle2, FlaskConical, Network, Globe2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppState } from '@/lib/hooks/use-app-state'
import { cn } from '@/lib/utils'

interface RunSimulationDrawerProps {
  onSuccess: (simulationResult: any) => void
}

const STEPS = [
  { id: 1, title: 'Target', desc: 'Select Component' },
  { id: 2, title: 'Scope', desc: 'Traversal Depth' },
  { id: 3, title: 'Environment', desc: 'Select Cluster' },
  { id: 4, title: 'Review', desc: 'Run Analysis' },
]

export function RunSimulationDrawer({ onSuccess }: RunSimulationDrawerProps) {
  const { isRunSimulationOpen, setRunSimulationOpen, addNotification } = useAppState()
  const [step, setStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    targetType: 'service', // service, infrastructure, deployment
    targetName: '',
    scopeDepth: 'immediate', // immediate, tier-1, full
    environment: 'prod-us-east-1',
  })

  // Close animation state
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  useEffect(() => {
    if (isRunSimulationOpen) {
      document.body.style.overflow = 'hidden'
      setStep(1)
      setIsSuccess(false)
      setIsSimulating(false)
      setIsAnimatingOut(false)
      setFormData({
        targetType: 'service',
        targetName: '',
        scopeDepth: 'immediate',
        environment: 'prod-us-east-1',
      })
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isRunSimulationOpen])

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setRunSimulationOpen(false)
      setIsAnimatingOut(false)
    }, 300)
  }

  const handleCreate = () => {
    setIsSimulating(true)
    
    // Fake simulation delay
    setTimeout(() => {
      setIsSimulating(false)
      setIsSuccess(true)
      
      const newResult = {
        target: formData.targetName,
        affected: Math.floor(Math.random() * 5) + 1,
        riskScore: Math.floor(Math.random() * 100),
      }
      
      onSuccess(newResult)
      
      addNotification({
        title: 'Simulation Complete',
        description: `Impact analysis for ${formData.targetName} completed. High risk identified.`,
        type: 'info'
      })
    }, 2000)
  }

  if (!isRunSimulationOpen && !isAnimatingOut) return null;

  return (
    <>
      <div
        className={cn("fixed inset-0 bg-black/50 z-40 transition-opacity duration-300", isAnimatingOut ? "opacity-0" : "opacity-100")}
        onClick={handleClose}
      />

      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[700px] lg:w-[800px] bg-background border-l border-border shadow-xl transform transition-transform duration-300 z-50 flex flex-col",
          (isRunSimulationOpen && !isAnimatingOut) ? "translate-x-0" : "translate-x-full"
        )}
      >
        {!isSuccess ? (
          <>
            <div className="bg-background border-b border-border p-6 pb-0">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                    <FlaskConical className="w-6 h-6 text-primary" /> Run Impact Simulation
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                    Analyze the potential blast radius of a planned change across your infrastructure.
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
                {step === 1 && <StepTarget formData={formData} setFormData={setFormData} />}
                {step === 2 && <StepScope formData={formData} setFormData={setFormData} />}
                {step === 3 && <StepEnvironment formData={formData} setFormData={setFormData} />}
                {step === 4 && <StepReview formData={formData} isSimulating={isSimulating} />}
              </div>
            </ScrollArea>

            <div className="bg-background border-t border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={step === 1 ? handleClose : () => setStep(step - 1)} disabled={isSimulating}>
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
                disabled={
                  (step === 1 && (!formData.targetType || !formData.targetName)) ||
                  (step === 2 && (!formData.scopeDepth)) ||
                  (step === 3 && (!formData.environment)) ||
                  isSimulating
                }
              >
                {step === 4 ? (isSimulating ? 'Running Simulation...' : 'Run Analysis') : 'Continue'}
                {step !== 4 && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </>
        ) : (
          <SuccessState handleClose={handleClose} targetName={formData.targetName} />
        )}
      </div>
    </>
  )
}

function StepTarget({ formData, setFormData }: any) {
  const targetTypes = [
    { id: 'service', label: 'Service Deployment', desc: 'Analyze deploying a new version of a service' },
    { id: 'infrastructure', label: 'Infrastructure Change', desc: 'Analyze changes to databases, caches, or networking' },
    { id: 'configuration', label: 'Configuration Change', desc: 'Analyze modifying feature flags or env vars' },
  ]

  const services = ['API Gateway', 'User Service', 'Payment Processor', 'Search Service', 'Database', 'Cache Layer']

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <label className="text-sm font-semibold mb-2 block">Change Type</label>
          <div className="grid grid-cols-1 gap-3">
            {targetTypes.map(t => (
              <div 
                key={t.id}
                onClick={() => setFormData({...formData, targetType: t.id})}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-colors",
                  formData.targetType === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-background"
                )}
              >
                <h4 className={cn("font-medium", formData.targetType === t.id ? "text-primary" : "text-foreground")}>{t.label}</h4>
                <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Target Component</label>
          <Select value={formData.targetName} onValueChange={(val) => setFormData({...formData, targetName: val})}>
            <SelectTrigger>
              <SelectValue placeholder="Select component to analyze..." />
            </SelectTrigger>
            <SelectContent>
              {services.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>
    </div>
  )
}

function StepScope({ formData, setFormData }: any) {
  const scopes = [
    { id: 'immediate', label: 'Immediate Dependencies', desc: 'Only analyze services directly communicating with the target.' },
    { id: 'tier-1', label: 'Tier-1 Transitive', desc: 'Analyze immediate dependencies and their direct upstream callers.' },
    { id: 'full', label: 'Full Graph Traversal', desc: 'Trace the entire impact chain to all downstream user-facing endpoints.' },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <label className="text-sm font-semibold mb-2 block">Dependency Traversal Depth</label>
          <div className="grid grid-cols-1 gap-3">
            {scopes.map(s => (
              <div 
                key={s.id}
                onClick={() => setFormData({...formData, scopeDepth: s.id})}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-colors flex items-start gap-3",
                  formData.scopeDepth === s.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-background"
                )}
              >
                <div className={cn("mt-0.5", formData.scopeDepth === s.id ? "text-primary" : "text-muted-foreground")}>
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={cn("font-medium", formData.scopeDepth === s.id ? "text-primary" : "text-foreground")}>{s.label}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

function StepEnvironment({ formData, setFormData }: any) {
  const environments = ['prod-us-east-1', 'prod-eu-west-1', 'staging-us-east-1', 'dev-cluster-1']

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <label className="text-sm font-semibold mb-2 block">Target Environment</label>
          <p className="text-sm text-muted-foreground mb-4">
            Select the environment cluster where the simulation should be run. Topology and current load will be pulled from this environment.
          </p>
          <div className="grid grid-cols-1 gap-2">
            {environments.map(c => (
              <div 
                key={c}
                onClick={() => setFormData({...formData, environment: c})}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-colors flex items-center justify-between",
                  formData.environment === c ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 text-muted-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4" />
                  <span className="font-medium">{c}</span>
                </div>
                {formData.environment === c && <CheckCircle2 className="w-5 h-5" />}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

function StepReview({ formData, isSimulating }: any) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto space-y-6">
      <Card className="overflow-hidden border-primary/20 shadow-sm p-0 gap-0">
        <div className="bg-primary/5 p-6 border-b border-primary/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            {isSimulating ? (
              <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <FlaskConical className="w-6 h-6" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{isSimulating ? 'Simulating Impact...' : 'Review Simulation'}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isSimulating ? 'Analyzing dependency graphs and calculating blast radius.' : 'Ready to analyze the blast radius. Please confirm.'}
            </p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Target Component</span>
              <span className="font-medium text-foreground">{formData.targetName}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Change Type</span>
              <Badge variant="outline" className="capitalize">{formData.targetType}</Badge>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Scope Depth</span>
              <span className="font-medium text-sm text-foreground capitalize">{formData.scopeDepth.replace('-', ' ')}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Environment</span>
              <span className="font-medium text-sm text-foreground">{formData.environment}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function SuccessState({ handleClose, targetName }: any) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6 border-4 border-success/20">
        <ShieldCheck className="w-10 h-10 text-success" />
      </div>
      <h2 className="text-3xl font-bold mb-3">Analysis Complete</h2>
      <p className="text-muted-foreground mb-10 max-w-md mx-auto">
        Impact simulation for <strong>{targetName}</strong> has completed. 3 downstream services will be affected.
      </p>

      <div className="space-y-3 w-full max-w-sm">
        <Button className="w-full" onClick={handleClose}>
          View Report
        </Button>
      </div>
    </div>
  )
}

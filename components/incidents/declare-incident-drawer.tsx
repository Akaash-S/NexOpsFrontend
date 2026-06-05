'use client'

import { useState, useEffect } from 'react'
import { X, ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert, Target, Info, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAppState } from '@/lib/hooks/use-app-state'
import { cn } from '@/lib/utils'

interface DeclareIncidentDrawerProps {
  onSuccess: (newIncident: any) => void
}

const STEPS = [
  { id: 1, title: 'Details', desc: 'Title & Summary' },
  { id: 2, title: 'Impact', desc: 'Scope' },
  { id: 3, title: 'Severity', desc: 'Criticality' },
  { id: 4, title: 'Review', desc: 'Confirm' },
]

export function DeclareIncidentDrawer({ onSuccess }: DeclareIncidentDrawerProps) {
  const { isDeclareIncidentOpen, setDeclareIncidentOpen, addNotification } = useAppState()
  const [step, setStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    cluster: 'prod-us-east-1',
    services: [] as string[],
    severity: 'high',
  })

  // Close animation state
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  useEffect(() => {
    if (isDeclareIncidentOpen) {
      document.body.style.overflow = 'hidden'
      setStep(1)
      setIsSuccess(false)
      setIsAnimatingOut(false)
      setFormData({
        title: '',
        summary: '',
        cluster: 'prod-us-east-1',
        services: [],
        severity: 'high',
      })
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isDeclareIncidentOpen])

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setDeclareIncidentOpen(false)
      setIsAnimatingOut(false)
    }, 300)
  }

  const handleCreate = () => {
    setIsSuccess(true)
    
    const newIncident = {
      id: `INC-${Math.floor(Math.random() * 10000)}`,
      title: formData.title || 'Untitled Incident',
      severity: formData.severity,
      status: 'investigating',
      startTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      duration: '0m',
      durationMins: 0,
      lead: 'Unassigned',
      affectedServices: formData.services.length > 0 ? formData.services : ['Unknown'],
      affectedClusters: [formData.cluster],
      rootCause: formData.summary || 'Investigation pending',
      impactedUsers: Math.floor(Math.random() * 5000),
      relatedDeployments: [],
      relatedAlerts: 0,
      timeline: [
        {
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          event: 'Incident manually declared',
          status: 'info' as const,
        }
      ],
      resolutionNotes: '',
    }
    
    onSuccess(newIncident)
    
    addNotification({
      title: 'Incident Declared',
      description: `${newIncident.id} has been created and assigned to triage.`,
      type: 'error'
    })
  }

  if (!isDeclareIncidentOpen && !isAnimatingOut) return null;

  return (
    <>
      <div
        className={cn("fixed inset-0 bg-black/50 z-40 transition-opacity duration-300", isAnimatingOut ? "opacity-0" : "opacity-100")}
        onClick={handleClose}
      />

      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[700px] lg:w-[800px] bg-background border-l border-border shadow-xl transform transition-transform duration-300 z-50 flex flex-col",
          (isDeclareIncidentOpen && !isAnimatingOut) ? "translate-x-0" : "translate-x-full"
        )}
      >
        {!isSuccess ? (
          <>
            <div className="bg-background border-b border-border p-6 pb-0">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-destructive" /> Declare Incident
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                    Manually report an operational failure or degradation to alert the on-call team.
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
                {step === 1 && <StepDetails formData={formData} setFormData={setFormData} />}
                {step === 2 && <StepImpact formData={formData} setFormData={setFormData} />}
                {step === 3 && <StepSeverity formData={formData} setFormData={setFormData} />}
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
                className={cn("gap-2", step === 4 ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : "")}
                disabled={
                  (step === 1 && (!formData.title)) ||
                  (step === 2 && (formData.services.length === 0))
                }
              >
                {step === 4 ? 'Declare Incident' : 'Continue'}
                {step !== 4 && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </>
        ) : (
          <SuccessState handleClose={handleClose} title={formData.title} />
        )}
      </div>
    </>
  )
}

function StepDetails({ formData, setFormData }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-xl mx-auto">
      <Card className="p-6 bg-background space-y-4">
        <div>
          <label className="text-sm font-semibold mb-2 block">Incident Title</label>
          <Input 
            placeholder="e.g., API Gateway Latency Spike"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>
        <div>
          <label className="text-sm font-semibold mb-2 block">Summary (Optional)</label>
          <Input 
            placeholder="Brief description of the observed behavior..."
            value={formData.summary}
            onChange={(e) => setFormData({...formData, summary: e.target.value})}
          />
        </div>
      </Card>
    </div>
  )
}

function StepImpact({ formData, setFormData }: any) {
  const mockServices = [
    'API Gateway',
    'User Service',
    'Auth Service',
    'Payment Processor',
    'Database Cluster',
  ]

  const toggleService = (svc: string) => {
    if (formData.services.includes(svc)) {
      setFormData({...formData, services: formData.services.filter((s: string) => s !== svc)})
    } else {
      setFormData({...formData, services: [...formData.services, svc]})
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-xl mx-auto">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-muted-foreground" />
          Select Impacted Services
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {mockServices.map(svc => (
            <div 
              key={svc}
              onClick={() => toggleService(svc)}
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-colors flex items-center justify-between",
                formData.services.includes(svc) ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 text-muted-foreground bg-background"
              )}
            >
              <span className="font-medium">{svc}</span>
              <div className={cn("w-5 h-5 rounded flex items-center justify-center border", formData.services.includes(svc) ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground")}>
                {formData.services.includes(svc) && <CheckCircle2 className="w-3 h-3" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepSeverity({ formData, setFormData }: any) {
  const severities = [
    { id: 'critical', name: 'Critical (SEV-1)', desc: 'Complete outage or severe degradation affecting many users. Immediate action required.' },
    { id: 'high', name: 'High (SEV-2)', desc: 'Partial outage or significant degradation. Core features impacted.' },
    { id: 'medium', name: 'Medium (SEV-3)', desc: 'Minor degradation or non-critical feature failure. Workarounds exist.' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <div>
        <h3 className="text-lg font-semibold mb-4">Set Incident Severity</h3>
        <div className="grid grid-cols-1 gap-4">
          {severities.map(sev => (
            <div 
              key={sev.id}
              onClick={() => setFormData({...formData, severity: sev.id})}
              className={cn(
                "border rounded-xl p-4 cursor-pointer transition-colors",
                formData.severity === sev.id 
                  ? sev.id === 'critical' ? 'border-destructive bg-destructive/5 text-destructive'
                  : sev.id === 'high' ? 'border-warning bg-warning/5 text-warning'
                  : 'border-info bg-info/5 text-info'
                  : "border-border hover:border-primary/50 text-muted-foreground bg-background"
              )}
            >
              <h4 className="font-semibold text-foreground">{sev.name}</h4>
              <p className={cn("text-sm mt-1", formData.severity === sev.id ? "" : "text-muted-foreground")}>{sev.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepReview({ formData }: any) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto space-y-6">
      <Card className="overflow-hidden border-destructive/20 shadow-sm p-0 gap-0">
        <div className="bg-destructive/5 p-6 border-b border-destructive/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center text-destructive flex-shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Review Declaration</h2>
            <p className="text-sm text-muted-foreground mt-1">Please confirm incident details before paging the on-call team.</p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Title</span>
              <span className="font-medium text-lg text-foreground">{formData.title}</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Impacted Services</span>
              <div className="flex gap-2 mt-1">
                {formData.services.map((s: string) => (
                  <Badge key={s} variant="outline">{s}</Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Severity</span>
              <Badge variant={formData.severity === 'critical' ? 'destructive' : 'default'} className="capitalize">{formData.severity}</Badge>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Cluster</span>
              <span className="font-medium text-sm text-foreground">{formData.cluster}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function SuccessState({ handleClose, title }: any) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6 border-4 border-destructive/20">
        <ShieldCheck className="w-10 h-10 text-destructive" />
      </div>
      <h2 className="text-3xl font-bold mb-3">Incident Declared</h2>
      <p className="text-muted-foreground mb-10 max-w-md mx-auto">
        <strong>{title}</strong> has been created and the on-call engineers have been paged.
      </p>

      <div className="space-y-3 w-full max-w-sm">
        <Button className="w-full" onClick={handleClose}>
          Go to Incident War Room
        </Button>
      </div>
    </div>
  )
}

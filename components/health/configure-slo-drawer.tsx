'use client'

import { useState, useEffect } from 'react'
import { X, ArrowLeft, ArrowRight, CheckCircle2, Target, Settings, Activity, ShieldCheck } from 'lucide-react'
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

interface ConfigureSloDrawerProps {
  onSuccess: (newSlo: any) => void
}

const STEPS = [
  { id: 1, title: 'Target', desc: 'Select Service' },
  { id: 2, title: 'Metric', desc: 'Define SLI' },
  { id: 3, title: 'Objective', desc: 'Set Targets' },
  { id: 4, title: 'Review', desc: 'Confirm' },
]

export function ConfigureSloDrawer({ onSuccess }: ConfigureSloDrawerProps) {
  const { isConfigureSloOpen, setConfigureSloOpen, addNotification } = useAppState()
  const [step, setStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    cluster: 'prod-us-east-1',
    service: '',
    sliType: 'availability', // availability, latency, error_rate
    sliMetric: 'http_requests_total',
    sloTarget: '99.9',
    timeWindow: '30d',
  })

  // Close animation state
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  useEffect(() => {
    if (isConfigureSloOpen) {
      document.body.style.overflow = 'hidden'
      setStep(1)
      setIsSuccess(false)
      setIsAnimatingOut(false)
      setFormData({
        cluster: 'prod-us-east-1',
        service: '',
        sliType: 'availability',
        sliMetric: 'http_requests_total',
        sloTarget: '99.9',
        timeWindow: '30d',
      })
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isConfigureSloOpen])

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setConfigureSloOpen(false)
      setIsAnimatingOut(false)
    }, 300)
  }

  const handleCreate = () => {
    setIsSuccess(true)
    
    const newSlo = {
      service: formData.service,
      actual: 100, // starting fresh
      slo: parseFloat(formData.sloTarget),
    }
    
    onSuccess(newSlo)
    
    addNotification({
      title: 'SLO Configured',
      description: `New SLO rule created for ${formData.service} at ${formData.sloTarget}%.`,
      type: 'success'
    })
  }

  if (!isConfigureSloOpen && !isAnimatingOut) return null;

  return (
    <>
      <div
        className={cn("fixed inset-0 bg-black/50 z-40 transition-opacity duration-300", isAnimatingOut ? "opacity-0" : "opacity-100")}
        onClick={handleClose}
      />

      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[700px] lg:w-[800px] bg-background border-l border-border shadow-xl transform transition-transform duration-300 z-50 flex flex-col",
          (isConfigureSloOpen && !isAnimatingOut) ? "translate-x-0" : "translate-x-full"
        )}
      >
        {!isSuccess ? (
          <>
            <div className="bg-background border-b border-border p-6 pb-0">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                    <Target className="w-6 h-6 text-primary" /> Configure SLO
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                    Define a Service Level Objective to measure and track system reliability.
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
                {step === 2 && <StepMetric formData={formData} setFormData={setFormData} />}
                {step === 3 && <StepObjective formData={formData} setFormData={setFormData} />}
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
                disabled={
                  (step === 1 && (!formData.cluster || !formData.service)) ||
                  (step === 2 && (!formData.sliMetric)) ||
                  (step === 3 && (!formData.sloTarget))
                }
              >
                {step === 4 ? 'Save SLO Configuration' : 'Continue'}
                {step !== 4 && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </>
        ) : (
          <SuccessState handleClose={handleClose} service={formData.service} />
        )}
      </div>
    </>
  )
}

function StepTarget({ formData, setFormData }: any) {
  const clusters = ['prod-us-east-1', 'prod-eu-west-1', 'staging-us-east-1']
  const services = ['API Gateway', 'User Service', 'Payment Processor', 'Search Service', 'Database']

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <label className="text-sm font-semibold mb-2 block">Cluster Environment</label>
          <div className="grid grid-cols-1 gap-2">
            {clusters.map(c => (
              <div 
                key={c}
                onClick={() => setFormData({...formData, cluster: c})}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-colors flex items-center justify-between",
                  formData.cluster === c ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 text-muted-foreground"
                )}
              >
                <span className="font-medium">{c}</span>
                {formData.cluster === c && <CheckCircle2 className="w-5 h-5" />}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Target Service</label>
          <Select value={formData.service} onValueChange={(val) => setFormData({...formData, service: val})}>
            <SelectTrigger>
              <SelectValue placeholder="Select a service..." />
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

function StepMetric({ formData, setFormData }: any) {
  const sliTypes = [
    { id: 'availability', label: 'Availability / Uptime', desc: 'Ratio of successful requests to total requests' },
    { id: 'latency', label: 'Latency', desc: 'Percentage of requests served within a specific threshold' },
    { id: 'error_rate', label: 'Error Rate', desc: 'Rate of 5xx server errors over total traffic' },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <label className="text-sm font-semibold mb-2 block">Service Level Indicator (SLI) Type</label>
          <div className="grid grid-cols-1 gap-3">
            {sliTypes.map(t => (
              <div 
                key={t.id}
                onClick={() => setFormData({...formData, sliType: t.id})}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-colors",
                  formData.sliType === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-background"
                )}
              >
                <h4 className={cn("font-medium", formData.sliType === t.id ? "text-primary" : "text-foreground")}>{t.label}</h4>
                <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Metric Name</label>
          <Input 
            placeholder="e.g., http_requests_total"
            value={formData.sliMetric}
            onChange={(e) => setFormData({...formData, sliMetric: e.target.value})}
          />
        </div>
      </Card>
    </div>
  )
}

function StepObjective({ formData, setFormData }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <label className="text-sm font-semibold mb-2 block">SLO Target Percentage</label>
          <div className="flex items-center gap-4">
            <Input 
              type="number"
              step="0.01"
              max="100"
              placeholder="99.9"
              value={formData.sloTarget}
              onChange={(e) => setFormData({...formData, sloTarget: e.target.value})}
              className="text-2xl h-14 font-mono w-40"
            />
            <span className="text-2xl font-semibold text-muted-foreground">%</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Target percentage of the indicator over the compliance window.
          </p>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Compliance Window</label>
          <Select value={formData.timeWindow} onValueChange={(val) => setFormData({...formData, timeWindow: val})}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select window" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days (Rolling)</SelectItem>
              <SelectItem value="30d">30 Days (Rolling)</SelectItem>
              <SelectItem value="90d">90 Days (Rolling)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>
    </div>
  )
}

function StepReview({ formData }: any) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto space-y-6">
      <Card className="overflow-hidden border-primary/20 shadow-sm p-0 gap-0">
        <div className="bg-primary/5 p-6 border-b border-primary/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Review Configuration</h2>
            <p className="text-sm text-muted-foreground mt-1">Please confirm the SLO details before saving.</p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Target Service</span>
              <span className="font-medium text-foreground">{formData.service}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Cluster</span>
              <span className="font-medium text-sm text-foreground">{formData.cluster}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">SLI Metric</span>
              <Badge variant="outline" className="capitalize">{formData.sliType}</Badge>
              <p className="text-xs font-mono text-muted-foreground mt-1">{formData.sliMetric}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">SLO Target</span>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-success leading-none">{formData.sloTarget}%</span>
                <span className="text-sm text-muted-foreground mb-0.5">/ {formData.timeWindow}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function SuccessState({ handleClose, service }: any) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6 border-4 border-success/20">
        <ShieldCheck className="w-10 h-10 text-success" />
      </div>
      <h2 className="text-3xl font-bold mb-3">SLO Configured</h2>
      <p className="text-muted-foreground mb-10 max-w-md mx-auto">
        Service Level Objective for <strong>{service}</strong> has been successfully created.
      </p>

      <div className="space-y-3 w-full max-w-sm">
        <Button className="w-full" onClick={handleClose}>
          Return to Health Center
        </Button>
      </div>
    </div>
  )
}

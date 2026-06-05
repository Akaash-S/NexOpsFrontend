'use client'

import { useState, useEffect } from 'react'
import { X, ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert, Target, BellRing, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAppState } from '@/lib/hooks/use-app-state'
import { cn } from '@/lib/utils'

interface CreateAlertRuleDrawerProps {
  onSuccess: (newRule: any) => void
}

const STEPS = [
  { id: 1, title: 'Target', desc: 'Select Scope' },
  { id: 2, title: 'Condition', desc: 'Metric & Threshold' },
  { id: 3, title: 'Routing', desc: 'Notifications' },
  { id: 4, title: 'Review', desc: 'Confirm' },
]

export function CreateAlertRuleDrawer({ onSuccess }: CreateAlertRuleDrawerProps) {
  const { isCreateAlertRuleOpen, setCreateAlertRuleOpen, addNotification } = useAppState()
  const [step, setStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    cluster: 'prod-us-east-1',
    service: '',
    metric: '',
    threshold: '',
    severity: 'high',
    channels: ['slack'] as string[],
  })

  // Close animation state
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  useEffect(() => {
    if (isCreateAlertRuleOpen) {
      document.body.style.overflow = 'hidden'
      setStep(1)
      setIsSuccess(false)
      setIsAnimatingOut(false)
      setFormData({
        cluster: 'prod-us-east-1',
        service: '',
        metric: '',
        threshold: '',
        severity: 'high',
        channels: ['slack'],
      })
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isCreateAlertRuleOpen])

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setCreateAlertRuleOpen(false)
      setIsAnimatingOut(false)
    }, 300)
  }

  const handleCreate = () => {
    setIsSuccess(true)
    
    // We mock adding an alert (since this triggers an active incident/alert for demonstration purposes, or just a success screen)
    // Actually, in NexOps, the user wanted an alert rule. Since we only show ALERTS (firing/resolved), let's simulate that creating the rule immediately caught an issue and fired an alert to show on the dashboard.
    const newAlert = {
      id: `ALT-${Math.floor(Math.random() * 10000)}`,
      title: `${formData.metric} Threshold Exceeded`,
      severity: formData.severity,
      status: 'firing',
      cluster: formData.cluster,
      services: [formData.service],
      value: `Current: Above ${formData.threshold}`,
      threshold: formData.threshold,
      createdAt: new Date().toISOString().split('T')[0],
      duration: '0m',
      correlatedAlerts: 0,
      suggestedActions: [
        `Review newly created alert rule for ${formData.service}`,
        `Investigate ${formData.metric} spikes`
      ],
    }
    
    onSuccess(newAlert)
    
    addNotification({
      title: 'Alert Rule Created',
      description: `Rule for ${formData.service} has been deployed. New alerts will be routed to your selected channels.`,
      type: 'success'
    })
  }

  if (!isCreateAlertRuleOpen && !isAnimatingOut) return null;

  return (
    <>
      <div
        className={cn("fixed inset-0 bg-black/50 z-40 transition-opacity duration-300", isAnimatingOut ? "opacity-0" : "opacity-100")}
        onClick={handleClose}
      />

      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[700px] lg:w-[800px] bg-background border-l border-border shadow-xl transform transition-transform duration-300 z-50 flex flex-col",
          (isCreateAlertRuleOpen && !isAnimatingOut) ? "translate-x-0" : "translate-x-full"
        )}
      >
        {!isSuccess ? (
          <>
            <div className="bg-background border-b border-border p-6 pb-0">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Create Alert Rule</h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                    Define a monitoring rule to automatically alert your team when anomalies occur.
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
                {step === 2 && <StepCondition formData={formData} setFormData={setFormData} />}
                {step === 3 && <StepRouting formData={formData} setFormData={setFormData} />}
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
                  (step === 1 && !formData.service) ||
                  (step === 2 && (!formData.metric || !formData.threshold)) ||
                  (step === 3 && formData.channels.length === 0)
                }
              >
                {step === 4 ? 'Deploy Rule' : 'Continue'}
                {step !== 4 && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </>
        ) : (
          <SuccessState handleClose={handleClose} service={formData.service} metric={formData.metric} />
        )}
      </div>
    </>
  )
}

function StepTarget({ formData, setFormData }: any) {
  const mockServices = [
    'API Gateway',
    'User Service',
    'Auth Service',
    'Payment Processor',
    'Database Cluster',
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-xl mx-auto">
      <div>
        <h3 className="text-lg font-semibold mb-4">Target Service</h3>
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
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4" />
                <span className="font-medium text-foreground">{svc}</span>
              </div>
              {formData.service === svc && <CheckCircle2 className="w-4 h-4" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepCondition({ formData, setFormData }: any) {
  const metrics = [
    { id: 'CPU Usage', desc: 'Process CPU Percentage' },
    { id: 'Memory Usage', desc: 'RAM Consumption' },
    { id: 'Error Rate', desc: '5xx HTTP Responses' },
    { id: 'Latency', desc: 'p99 Response Time' },
  ]
  const severities = ['critical', 'high', 'medium', 'low']

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <div>
        <h3 className="text-lg font-semibold mb-4">Metric to Monitor</h3>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map(met => (
            <div 
              key={met.id}
              onClick={() => setFormData({...formData, metric: met.id})}
              className={cn(
                "border rounded-xl p-4 cursor-pointer transition-colors flex flex-col gap-1",
                formData.metric === met.id ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-border hover:border-primary/50 text-muted-foreground bg-background"
              )}
            >
              <h4 className="font-semibold text-foreground">{met.id}</h4>
              <p className="text-xs">{met.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Card className="p-6 bg-background space-y-4">
        <div>
          <label className="text-sm font-semibold mb-2 block">Threshold Value</label>
          <Input 
            placeholder="e.g., > 80% or > 500ms"
            value={formData.threshold}
            onChange={(e) => setFormData({...formData, threshold: e.target.value})}
          />
          <p className="text-xs text-muted-foreground mt-2">
            The alert will fire when this condition is met for 5 minutes.
          </p>
        </div>
      </Card>

      <div>
        <h3 className="text-sm font-semibold mb-3">Alert Severity</h3>
        <div className="flex gap-2">
          {severities.map((sev) => (
            <Button
              key={sev}
              variant={formData.severity === sev ? 'default' : 'outline'}
              className="capitalize"
              onClick={() => setFormData({...formData, severity: sev})}
            >
              {sev}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepRouting({ formData, setFormData }: any) {
  const channels = [
    { id: 'slack', name: 'Slack Channel (#alerts)' },
    { id: 'pagerduty', name: 'PagerDuty (On-Call Schedule)' },
    { id: 'email', name: 'Email Notifications' },
    { id: 'webhook', name: 'Custom Webhook' },
  ]

  const toggleChannel = (id: string) => {
    if (formData.channels.includes(id)) {
      setFormData({...formData, channels: formData.channels.filter((c: string) => c !== id)})
    } else {
      setFormData({...formData, channels: [...formData.channels, id]})
    }
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">Notification Routing</h3>
      <div className="grid grid-cols-1 gap-3">
        {channels.map(chan => (
          <div 
            key={chan.id}
            onClick={() => toggleChannel(chan.id)}
            className={cn(
              "border rounded-xl p-5 cursor-pointer transition-colors flex items-center justify-between",
              formData.channels.includes(chan.id) ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50 bg-background"
            )}
          >
            <div className="flex items-center gap-3">
              <BellRing className={cn("w-5 h-5", formData.channels.includes(chan.id) ? "text-primary" : "text-muted-foreground")} />
              <h4 className="font-medium text-foreground">{chan.name}</h4>
            </div>
            <div className={cn("w-5 h-5 rounded flex items-center justify-center border", formData.channels.includes(chan.id) ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground")}>
              {formData.channels.includes(chan.id) && <CheckCircle2 className="w-3 h-3" />}
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
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Review Alert Rule</h2>
            <p className="text-sm text-muted-foreground mt-1">Please confirm the monitoring parameters.</p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Service</span>
              <span className="font-medium text-sm text-foreground">{formData.service}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Metric</span>
              <span className="font-medium text-sm text-foreground">{formData.metric}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Threshold</span>
              <Badge variant="secondary" className="font-mono text-xs">{formData.threshold}</Badge>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Severity</span>
              <Badge variant="outline" className="capitalize">{formData.severity}</Badge>
            </div>
            <div className="col-span-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Routing Channels</span>
              <div className="flex gap-2">
                {formData.channels.map((c: string) => (
                  <Badge key={c} variant="secondary" className="capitalize">{c}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function SuccessState({ handleClose, service, metric }: any) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-6 border-4 border-success/30">
        <Settings2 className="w-10 h-10 text-success" />
      </div>
      <h2 className="text-3xl font-bold mb-3">Rule Deployed!</h2>
      <p className="text-muted-foreground mb-10 max-w-md mx-auto">
        Monitoring rule for <strong>{service} ({metric})</strong> is now active. 
        It has begun scanning the metrics pipeline.
      </p>

      <div className="space-y-3 w-full max-w-sm">
        <Button className="w-full" onClick={handleClose}>
          Return to Alerts
        </Button>
      </div>
    </div>
  )
}

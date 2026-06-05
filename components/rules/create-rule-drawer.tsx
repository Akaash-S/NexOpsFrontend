'use client'

import { useState, useEffect } from 'react'
import { X, ArrowLeft, ArrowRight, CheckCircle2, Zap, LayoutTemplate, Activity, BellRing } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAppState } from '@/lib/hooks/use-app-state'
import { cn } from '@/lib/utils'

interface CreateRuleDrawerProps {
  onSuccess: (ruleData: any) => void
}

const STEPS = [
  { id: 1, title: 'General', desc: 'Basic Details' },
  { id: 2, title: 'Trigger', desc: 'Event Condition' },
  { id: 3, title: 'Action', desc: 'Desired Outcome' },
  { id: 4, title: 'Review', desc: 'Confirm & Save' },
]

export function CreateRuleDrawer({ onSuccess }: CreateRuleDrawerProps) {
  const { isCreateRuleOpen, setCreateRuleOpen, addNotification } = useAppState()
  const [step, setStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    triggerType: 'metrics', // metrics, log, webhook, alert
    triggerCondition: '',
    actionType: 'scale', // scale, restart, notify, incident
    actionConfig: '',
  })

  useEffect(() => {
    if (isCreateRuleOpen) {
      document.body.style.overflow = 'hidden'
      setStep(1)
      setIsSuccess(false)
      setIsExecuting(false)
      setIsAnimatingOut(false)
      setFormData({
        name: '',
        description: '',
        triggerType: 'metrics',
        triggerCondition: '',
        actionType: 'scale',
        actionConfig: '',
      })
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isCreateRuleOpen])

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setCreateRuleOpen(false)
      setIsAnimatingOut(false)
    }, 300)
  }

  const handleExecute = () => {
    setIsExecuting(true)
    
    // Fake execution delay
    setTimeout(() => {
      setIsExecuting(false)
      setIsSuccess(true)
      
      onSuccess({
        id: `rule-new-${Date.now()}`,
        name: formData.name || 'New Custom Rule',
        trigger: formData.triggerCondition || 'Custom Trigger',
        action: formData.actionConfig || 'Custom Action',
        enabled: true,
        executions: 0,
        successRate: 100,
        lastExecution: 'Never',
      })
      
      addNotification({
        title: 'Rule Created Successfully',
        description: `The rule "${formData.name || 'New Custom Rule'}" has been activated.`,
        type: 'success'
      })
    }, 1500)
  }

  const isNextDisabled = () => {
    if (step === 1 && !formData.name) return true
    if (step === 2 && !formData.triggerCondition) return true
    if (step === 3 && !formData.actionConfig) return true
    return false
  }

  if (!isCreateRuleOpen && !isAnimatingOut) return null

  return (
    <>
      <div
        className={cn("fixed inset-0 bg-black/50 z-40 transition-opacity duration-300", isAnimatingOut ? "opacity-0" : "opacity-100")}
        onClick={handleClose}
      />

      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[700px] lg:w-[800px] bg-background border-l border-border shadow-xl transform transition-transform duration-300 z-50 flex flex-col",
          (isCreateRuleOpen && !isAnimatingOut) ? "translate-x-0" : "translate-x-full"
        )}
      >
        {!isSuccess ? (
          <>
            <div className="bg-background border-b border-border p-6 pb-0">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                    <Zap className="w-6 h-6 text-primary" /> Create Automation Rule
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                    Define automated responses to operational events to maintain system stability and reduce manual toil.
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
                {step === 1 && <StepGeneral formData={formData} setFormData={setFormData} />}
                {step === 2 && <StepTrigger formData={formData} setFormData={setFormData} />}
                {step === 3 && <StepAction formData={formData} setFormData={setFormData} />}
                {step === 4 && <StepReview formData={formData} isExecuting={isExecuting} />}
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
                {step === STEPS.length ? (isExecuting ? 'Saving...' : 'Confirm & Create Rule') : 'Continue'}
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

function StepGeneral({ formData, setFormData }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-4">Rule Details</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Rule Name <span className="text-destructive">*</span></label>
              <Input 
                placeholder="e.g. Auto-scale Web Tier on High CPU" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Description (Optional)</label>
              <Textarea 
                placeholder="Briefly describe what this rule does and when it should trigger..." 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="h-24 resize-none"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function StepTrigger({ formData, setFormData }: any) {
  const triggerTypes = [
    { id: 'metrics', label: 'Metric Threshold', desc: 'Trigger based on CPU, Memory, Latency, etc.', icon: Activity },
    { id: 'log', label: 'Log Pattern Match', desc: 'Trigger when specific text appears in logs.', icon: LayoutTemplate },
    { id: 'alert', label: 'Alert Fired', desc: 'Trigger when a specific alert occurs.', icon: BellRing },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-1">Trigger Event</h3>
          <p className="text-sm text-muted-foreground mb-4">What condition should trigger this automation rule?</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {triggerTypes.map(t => {
              const Icon = t.icon
              return (
                <div 
                  key={t.id}
                  onClick={() => setFormData({...formData, triggerType: t.id})}
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-colors flex flex-col items-center text-center gap-2",
                    formData.triggerType === t.id ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <div>
                    <div className="font-medium text-sm text-foreground">{t.label}</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div>
            <label className="text-sm font-semibold mb-1.5 block">Condition Details <span className="text-destructive">*</span></label>
            <Input 
              placeholder={formData.triggerType === 'metrics' ? "e.g. CPU > 80% for 5 minutes" : formData.triggerType === 'log' ? "e.g. Exception: OutOfMemoryError" : "e.g. Severity = Critical AND Service = API"}
              value={formData.triggerCondition}
              onChange={(e) => setFormData({...formData, triggerCondition: e.target.value})}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Use standard PromQL or natural language. NexOps will compile it appropriately.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

function StepAction({ formData, setFormData }: any) {
  const actionTypes = [
    { id: 'scale', label: 'Scale Infrastructure' },
    { id: 'restart', label: 'Restart Service/Pods' },
    { id: 'incident', label: 'Create Incident & Page' },
    { id: 'custom', label: 'Run Custom Script' },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-1">Automated Action</h3>
          <p className="text-sm text-muted-foreground mb-4">What should happen when the trigger condition is met?</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {actionTypes.map(a => (
              <Badge 
                key={a.id}
                variant={formData.actionType === a.id ? 'default' : 'outline'}
                className="cursor-pointer text-sm py-1.5 px-3"
                onClick={() => setFormData({...formData, actionType: a.id})}
              >
                {a.label}
              </Badge>
            ))}
          </div>

          <div>
            <label className="text-sm font-semibold mb-1.5 block">Action Configuration <span className="text-destructive">*</span></label>
            <Input 
              placeholder={formData.actionType === 'scale' ? "e.g. Add 2 Replicas to Web Tier (Max 10)" : "e.g. Define exact parameters for the action"}
              value={formData.actionConfig}
              onChange={(e) => setFormData({...formData, actionConfig: e.target.value})}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

function StepReview({ formData, isExecuting }: any) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto space-y-6">
      <Card className="overflow-hidden border-primary/20 shadow-sm p-0 gap-0">
        <div className="bg-primary/5 p-6 border-b border-primary/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            {isExecuting ? (
              <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Zap className="w-6 h-6" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{isExecuting ? 'Saving Rule...' : 'Review Rule Details'}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isExecuting ? 'Please wait while NexOps activates your automation.' : 'Confirm your settings before saving.'}
            </p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Rule Name</span>
            <span className="font-medium text-foreground text-lg">{formData.name}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-muted/30 p-4 rounded-lg border border-border">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1 flex items-center gap-2">
                <Activity className="w-3 h-3" /> When this happens...
              </span>
              <span className="font-medium text-foreground">{formData.triggerCondition}</span>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1 flex items-center gap-2">
                <Zap className="w-3 h-3" /> Then do this...
              </span>
              <span className="font-medium text-foreground">{formData.actionConfig}</span>
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
      <h2 className="text-3xl font-bold mb-3">Rule Created & Active</h2>
      <p className="text-muted-foreground mb-10 max-w-md mx-auto">
        Your new automation rule has been successfully deployed and is now actively monitoring the system.
      </p>

      <div className="space-y-3 w-full max-w-sm">
        <Button className="w-full" onClick={handleClose}>
          Done
        </Button>
      </div>
    </div>
  )
}

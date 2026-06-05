'use client'

import { useState, useEffect } from 'react'
import { X, ArrowLeft, ArrowRight, CheckCircle2, PlayCircle, Layers, Activity, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAppState } from '@/lib/hooks/use-app-state'
import { cn } from '@/lib/utils'

interface CreateWorkflowDrawerProps {
  onSuccess: (wfData: any) => void
}

const STEPS = [
  { id: 1, title: 'Details', desc: 'Basic Information' },
  { id: 2, title: 'Trigger', desc: 'Execution Logic' },
  { id: 3, title: 'Steps', desc: 'Pipeline Sequence' },
  { id: 4, title: 'Review', desc: 'Confirm & Save' },
]

export function CreateWorkflowDrawer({ onSuccess }: CreateWorkflowDrawerProps) {
  const { isCreateWorkflowOpen, setCreateWorkflowOpen, addNotification } = useAppState()
  const [step, setStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    triggerType: 'manual', // manual, schedule, event
    triggerConfig: '',
    stepsCount: 1,
  })

  useEffect(() => {
    if (isCreateWorkflowOpen) {
      document.body.style.overflow = 'hidden'
      setStep(1)
      setIsSuccess(false)
      setIsExecuting(false)
      setIsAnimatingOut(false)
      setFormData({
        name: '',
        description: '',
        triggerType: 'manual',
        triggerConfig: '',
        stepsCount: 1,
      })
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isCreateWorkflowOpen])

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setCreateWorkflowOpen(false)
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
        id: `wf-new-${Date.now()}`,
        name: formData.name || 'New Custom Workflow',
        status: formData.triggerType === 'schedule' ? 'scheduled' : 'active',
        runs: 0,
        lastRun: 'Never',
        avgDuration: '--',
        successRate: 100,
        steps: formData.stepsCount,
      })
      
      addNotification({
        title: 'Workflow Created',
        description: `The workflow "${formData.name || 'New Custom Workflow'}" has been created successfully.`,
        type: 'success'
      })
    }, 1500)
  }

  const isNextDisabled = () => {
    if (step === 1 && !formData.name) return true
    if (step === 2 && formData.triggerType !== 'manual' && !formData.triggerConfig) return true
    return false
  }

  if (!isCreateWorkflowOpen && !isAnimatingOut) return null

  return (
    <>
      <div
        className={cn("fixed inset-0 bg-black/50 z-40 transition-opacity duration-300", isAnimatingOut ? "opacity-0" : "opacity-100")}
        onClick={handleClose}
      />

      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[700px] lg:w-[800px] bg-background border-l border-border shadow-xl transform transition-transform duration-300 z-50 flex flex-col",
          (isCreateWorkflowOpen && !isAnimatingOut) ? "translate-x-0" : "translate-x-full"
        )}
      >
        {!isSuccess ? (
          <>
            <div className="bg-background border-b border-border p-6 pb-0">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                    <Layers className="w-6 h-6 text-primary" /> Create Workflow
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                    Build complex orchestration pipelines that span multiple services and tools.
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
                {step === 2 && <StepTrigger formData={formData} setFormData={setFormData} />}
                {step === 3 && <StepSteps formData={formData} setFormData={setFormData} />}
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
                {step === STEPS.length ? (isExecuting ? 'Saving...' : 'Confirm & Save') : 'Continue'}
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

function StepDetails({ formData, setFormData }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-4">Workflow Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Workflow Name <span className="text-destructive">*</span></label>
              <Input 
                placeholder="e.g. Automated Database Backup" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Description (Optional)</label>
              <Textarea 
                placeholder="Briefly describe what this workflow accomplishes..." 
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
    { id: 'manual', label: 'Manual Execution', desc: 'Triggered explicitly by a user.', icon: PlayCircle },
    { id: 'schedule', label: 'Cron Schedule', desc: 'Runs automatically on a set schedule.', icon: Clock },
    { id: 'event', label: 'Event Driven', desc: 'Triggers on a webhook or platform event.', icon: Activity },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-1">Execution Trigger</h3>
          <p className="text-sm text-muted-foreground mb-4">How should this workflow be initiated?</p>
          
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

          {formData.triggerType !== 'manual' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-sm font-semibold mb-1.5 block">
                {formData.triggerType === 'schedule' ? 'Cron Expression' : 'Event Pattern'} <span className="text-destructive">*</span>
              </label>
              <Input 
                placeholder={formData.triggerType === 'schedule' ? "0 0 * * *" : "e.g. github.push.main"}
                value={formData.triggerConfig}
                onChange={(e) => setFormData({...formData, triggerConfig: e.target.value})}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

function StepSteps({ formData, setFormData }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-1">Pipeline Steps</h3>
          <p className="text-sm text-muted-foreground mb-4">Define the sequence of operations.</p>
          
          <div className="space-y-4">
            {Array.from({ length: formData.stepsCount }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 bg-muted/30 p-3 rounded-lg border border-border">
                <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <Input placeholder={`Describe step ${i + 1}...`} />
                {i > 0 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive shrink-0"
                    onClick={() => setFormData({ ...formData, stepsCount: formData.stepsCount - 1 })}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button 
            variant="outline" 
            className="w-full mt-4 border-dashed"
            onClick={() => setFormData({ ...formData, stepsCount: formData.stepsCount + 1 })}
          >
            + Add Step
          </Button>
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
              <Layers className="w-6 h-6" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{isExecuting ? 'Saving...' : 'Review Workflow'}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isExecuting ? 'Please wait while NexOps provisions your workflow.' : 'Finalize and deploy your orchestration pipeline.'}
            </p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Workflow Name</span>
              <span className="font-medium text-foreground">{formData.name}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Trigger Type</span>
              <span className="font-medium text-foreground capitalize">{formData.triggerType}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Steps</span>
              <span className="font-medium text-foreground">{formData.stepsCount} Total Steps</span>
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
      <h2 className="text-3xl font-bold mb-3">Workflow Created</h2>
      <p className="text-muted-foreground mb-10 max-w-md mx-auto">
        Your new orchestration workflow is ready and can be executed from the dashboard.
      </p>

      <div className="space-y-3 w-full max-w-sm">
        <Button className="w-full" onClick={handleClose}>
          Done
        </Button>
      </div>
    </div>
  )
}

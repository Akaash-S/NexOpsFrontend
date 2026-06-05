'use client'

import { useState, useEffect } from 'react'
import { X, ArrowLeft, ArrowRight, CheckCircle2, GitPullRequest, Code2, PlayCircle, Settings, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RECOMMENDATIONS_DATA } from '@/lib/mock-data'
import { useAppState } from '@/lib/hooks/use-app-state'
import { cn } from '@/lib/utils'

interface ImplementRecommendationDrawerProps {
  onSuccess: (recId: string) => void
}

const STEPS = [
  { id: 1, title: 'Review', desc: 'Confirm Impact' },
  { id: 2, title: 'Strategy', desc: 'Execution Method' },
  { id: 3, title: 'Execute', desc: 'Run Implementation' },
]

export function ImplementRecommendationDrawer({ onSuccess }: ImplementRecommendationDrawerProps) {
  const { isImplementRecOpen, setImplementRecOpen, selectedRecToImplement, addNotification } = useAppState()
  const [step, setStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)

  const rec = RECOMMENDATIONS_DATA.find(r => r.id === selectedRecToImplement)

  // Form State
  const [formData, setFormData] = useState({
    strategy: 'auto-pr', // auto-pr, direct-apply, manual
  })

  // Close animation state
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  useEffect(() => {
    if (isImplementRecOpen) {
      document.body.style.overflow = 'hidden'
      setStep(1)
      setIsSuccess(false)
      setIsExecuting(false)
      setIsAnimatingOut(false)
      
      // Smart default strategy based on category
      let defaultStrategy = 'auto-pr'
      if (rec?.category === 'Security' || rec?.category === 'Performance') {
        defaultStrategy = 'auto-pr'
      } else if (rec?.category === 'Cost') {
        defaultStrategy = 'direct-apply'
      }

      setFormData({
        strategy: defaultStrategy,
      })
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isImplementRecOpen, rec])

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setImplementRecOpen(false)
      setIsAnimatingOut(false)
    }, 300)
  }

  const handleExecute = () => {
    setIsExecuting(true)
    
    // Fake execution delay
    setTimeout(() => {
      setIsExecuting(false)
      setIsSuccess(true)
      
      if (rec) {
        onSuccess(rec.id)
      }
      
      addNotification({
        title: formData.strategy === 'auto-pr' ? 'Pull Request Generated' : 'Implementation Started',
        description: `The recommendation for "${rec?.issue}" is now in progress.`,
        type: 'success'
      })
    }, 2000)
  }

  if (!isImplementRecOpen && !isAnimatingOut) return null;
  if (!rec && !isAnimatingOut) return null;

  return (
    <>
      <div
        className={cn("fixed inset-0 bg-black/50 z-40 transition-opacity duration-300", isAnimatingOut ? "opacity-0" : "opacity-100")}
        onClick={handleClose}
      />

      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[700px] lg:w-[800px] bg-background border-l border-border shadow-xl transform transition-transform duration-300 z-50 flex flex-col",
          (isImplementRecOpen && !isAnimatingOut) ? "translate-x-0" : "translate-x-full"
        )}
      >
        {!isSuccess ? (
          <>
            <div className="bg-background border-b border-border p-6 pb-0">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                    <PlayCircle className="w-6 h-6 text-primary" /> Implement Recommendation
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                    Follow the guided steps to safely apply this AI-generated recommendation.
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
                {step === 1 && <StepReview rec={rec} />}
                {step === 2 && <StepStrategy formData={formData} setFormData={setFormData} />}
                {step === 3 && <StepExecute formData={formData} isExecuting={isExecuting} rec={rec} />}
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
                onClick={step === 3 ? handleExecute : () => setStep(step + 1)}
                className="gap-2"
                disabled={isExecuting}
              >
                {step === 3 ? (isExecuting ? 'Executing...' : 'Confirm & Execute') : 'Continue'}
                {step !== 3 && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </>
        ) : (
          <SuccessState handleClose={handleClose} strategy={formData.strategy} rec={rec} />
        )}
      </div>
    </>
  )
}

function StepReview({ rec }: any) {
  if (!rec) return null;
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <h3 className="font-semibold text-lg">{rec.issue}</h3>
          <p className="text-sm text-muted-foreground mt-1">Review the details before proceeding.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Action Required</span>
            <span className="font-medium text-foreground">{rec.action}</span>
          </div>
          <div className="bg-success/5 p-4 rounded-lg border border-success/20">
            <span className="text-xs font-semibold text-success uppercase tracking-wider block mb-1">Expected Impact</span>
            <span className="font-medium text-success">{rec.impact}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Confidence</span>
            <span className="font-medium">{rec.confidence}%</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Priority</span>
            <Badge variant="outline" className="capitalize">{rec.priority}</Badge>
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Affected Services</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {rec.affectedServices.map((s: string) => (
                <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function StepStrategy({ formData, setFormData }: any) {
  const strategies = [
    { 
      id: 'auto-pr', 
      label: 'Generate Pull Request', 
      desc: 'NexOps will open a PR with the required code and configuration changes.',
      icon: GitPullRequest,
      recommended: true
    },
    { 
      id: 'direct-apply', 
      label: 'Execute Directly via API', 
      desc: 'NexOps will apply the change directly to the infrastructure immediately.',
      icon: Code2,
      recommended: false
    },
    { 
      id: 'manual', 
      label: 'Generate Runbook (Manual)', 
      desc: 'Generate a step-by-step markdown runbook for your team to execute manually.',
      icon: Settings,
      recommended: false
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <label className="text-sm font-semibold mb-2 block">Implementation Strategy</label>
          <p className="text-sm text-muted-foreground mb-4">Choose how you want NexOps to execute this recommendation.</p>
          <div className="grid grid-cols-1 gap-3">
            {strategies.map(s => {
              const Icon = s.icon;
              return (
                <div 
                  key={s.id}
                  onClick={() => setFormData({...formData, strategy: s.id})}
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-colors relative overflow-hidden",
                    formData.strategy === s.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-background"
                  )}
                >
                  {s.recommended && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                      Recommended
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className={cn("p-2 rounded-lg mt-0.5", formData.strategy === s.id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={cn("font-medium", formData.strategy === s.id ? "text-primary" : "text-foreground")}>{s.label}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </div>
  )
}

function StepExecute({ formData, isExecuting, rec }: any) {
  if (!rec) return null;

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto space-y-6">
      <Card className="overflow-hidden border-primary/20 shadow-sm p-0 gap-0">
        <div className="bg-primary/5 p-6 border-b border-primary/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            {isExecuting ? (
              <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <PlayCircle className="w-6 h-6" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{isExecuting ? 'Executing...' : 'Final Confirmation'}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isExecuting ? 'Please wait while NexOps processes the request.' : 'You are about to initiate the following change.'}
            </p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Target Action</span>
              <span className="font-medium text-foreground">{rec.action}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Strategy</span>
              <Badge variant="outline" className="capitalize">{formData.strategy.replace('-', ' ')}</Badge>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Auth Context</span>
              <span className="font-medium text-sm text-foreground">admin@nexops.io</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function SuccessState({ handleClose, strategy, rec }: any) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6 border-4 border-success/20">
        <Check className="w-10 h-10 text-success" />
      </div>
      <h2 className="text-3xl font-bold mb-3">
        {strategy === 'auto-pr' ? 'Pull Request Generated' : 
         strategy === 'manual' ? 'Runbook Generated' : 'Change Applied'}
      </h2>
      <p className="text-muted-foreground mb-10 max-w-md mx-auto">
        {strategy === 'auto-pr' && 'A new pull request has been opened in your repository. Please review and merge it.'}
        {strategy === 'manual' && 'The step-by-step runbook has been downloaded to your machine.'}
        {strategy === 'direct-apply' && 'The change has been successfully applied to your infrastructure.'}
      </p>

      <div className="space-y-3 w-full max-w-sm">
        <Button className="w-full" onClick={handleClose}>
          {strategy === 'auto-pr' ? 'View Pull Request' : 'Done'}
        </Button>
      </div>
    </div>
  )
}

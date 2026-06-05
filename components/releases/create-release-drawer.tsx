'use client'

import { useState, useEffect } from 'react'
import { X, ArrowLeft, ArrowRight, CheckCircle2, Package, Users, Settings, Tag, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAppState } from '@/lib/hooks/use-app-state'
import { cn } from '@/lib/utils'

interface CreateReleaseDrawerProps {
  onSuccess: (newRelease: any) => void
}

const STEPS = [
  { id: 1, title: 'Artifact', desc: 'Select Service' },
  { id: 2, title: 'Audience', desc: 'Target Users' },
  { id: 3, title: 'Rollout', desc: 'Strategy' },
  { id: 4, title: 'Review', desc: 'Confirm' },
]

export function CreateReleaseDrawer({ onSuccess }: CreateReleaseDrawerProps) {
  const { isCreateReleaseOpen, setCreateReleaseOpen, addNotification } = useAppState()
  const [step, setStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    service: '',
    version: '',
    audience: 'internal',
    rollout: 'phased',
  })

  // Close animation state
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  useEffect(() => {
    if (isCreateReleaseOpen) {
      document.body.style.overflow = 'hidden'
      setStep(1)
      setIsSuccess(false)
      setIsAnimatingOut(false)
      setFormData({
        service: '',
        version: '',
        audience: 'internal',
        rollout: 'phased',
      })
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isCreateReleaseOpen])

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setCreateReleaseOpen(false)
      setIsAnimatingOut(false)
    }, 300)
  }

  const handleCreate = () => {
    setIsSuccess(true)
    
    const newRelease = {
      id: formData.version || `v1.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      service: formData.service || 'Unknown Service',
      status: 'released',
      releaseDate: new Date().toISOString().split('T')[0],
      changesCount: 12,
      deployments: 2,
      rollbacks: 0,
      health: 100,
      adoptionRate: formData.rollout === 'instant' ? 100 : formData.rollout === 'phased' ? 10 : 0,
      incidents: 0,
    }
    
    onSuccess(newRelease)
    
    addNotification({
      title: 'Release Initiated',
      description: `Successfully initiated release ${newRelease.id} for ${newRelease.service}`,
      type: 'success'
    })
  }

  if (!isCreateReleaseOpen && !isAnimatingOut) return null;

  return (
    <>
      <div
        className={cn("fixed inset-0 bg-black/50 z-40 transition-opacity duration-300", isAnimatingOut ? "opacity-0" : "opacity-100")}
        onClick={handleClose}
      />

      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[700px] lg:w-[800px] bg-background border-l border-border shadow-xl transform transition-transform duration-300 z-50 flex flex-col",
          (isCreateReleaseOpen && !isAnimatingOut) ? "translate-x-0" : "translate-x-full"
        )}
      >
        {!isSuccess ? (
          <>
            <div className="bg-background border-b border-border p-6 pb-0">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Create Release</h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                    Define and launch a new software release to your users.
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
                {step === 1 && <StepArtifact formData={formData} setFormData={setFormData} />}
                {step === 2 && <StepAudience formData={formData} setFormData={setFormData} />}
                {step === 3 && <StepRollout formData={formData} setFormData={setFormData} />}
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
                disabled={step === 1 && (!formData.service || !formData.version)}
              >
                {step === 4 ? 'Launch Release' : 'Continue'}
                {step !== 4 && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </>
        ) : (
          <SuccessState handleClose={handleClose} service={formData.service} version={formData.version} />
        )}
      </div>
    </>
  )
}

function StepArtifact({ formData, setFormData }: any) {
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
        <h3 className="text-lg font-semibold mb-4">Select Target Service</h3>
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
            <Tag className="w-4 h-4" />
            Release Tag / Version
          </label>
          <Input 
            placeholder="e.g., v2.1.0"
            value={formData.version}
            onChange={(e) => setFormData({...formData, version: e.target.value})}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Specify the exact version identifier for this release.
          </p>
        </div>
      </Card>
    </div>
  )
}

function StepAudience({ formData, setFormData }: any) {
  const audiences = [
    { id: 'internal', name: 'Internal Teams', icon: Users, risk: 'Zero Risk' },
    { id: 'beta', name: 'Beta Testers', icon: Users, risk: 'Low Risk' },
    { id: 'public', name: 'General Public', icon: Users, risk: 'Normal Risk' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Target Audience</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {audiences.map(aud => (
            <div 
              key={aud.id}
              onClick={() => setFormData({...formData, audience: aud.id})}
              className={cn(
                "border rounded-xl p-4 cursor-pointer transition-colors flex flex-col items-center text-center gap-3",
                formData.audience === aud.id ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-border hover:border-primary/50 text-muted-foreground bg-background"
              )}
            >
              <div className={cn("p-3 rounded-full", formData.audience === aud.id ? "bg-primary/10" : "bg-muted")}>
                <aud.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground capitalize mb-1">{aud.name}</h4>
                <p className="text-xs">{aud.risk}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepRollout({ formData, setFormData }: any) {
  const strategies = [
    { id: 'instant', name: 'Instant 100%', desc: 'Release to all targeted users immediately.', type: 'Aggressive' },
    { id: 'phased', name: 'Phased (10% -> 25% -> 50% -> 100%)', desc: 'Gradually increase the user base receiving the release.', type: 'Safe' },
    { id: 'scheduled', name: 'Scheduled', desc: 'Prepare the release now, but launch at a specified future date.', type: 'Planned' },
  ]

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">Rollout Strategy</h3>
      <div className="grid grid-cols-1 gap-3">
        {strategies.map(strat => (
          <div 
            key={strat.id}
            onClick={() => setFormData({...formData, rollout: strat.id})}
            className={cn(
              "border rounded-xl p-5 cursor-pointer transition-colors flex items-start gap-4",
              formData.rollout === strat.id ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50 bg-background"
            )}
          >
            <div className={cn("mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0", formData.rollout === strat.id ? "border-primary" : "border-muted-foreground")}>
              {formData.rollout === strat.id && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-foreground">{strat.name}</h4>
                <Badge variant="outline" className={strat.type === 'Aggressive' ? 'text-destructive border-destructive' : strat.type === 'Safe' ? 'text-success border-success' : 'text-info border-info'}>
                  {strat.type}
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
            <h2 className="text-xl font-bold">Review Release</h2>
            <p className="text-sm text-muted-foreground mt-1">Please confirm the release parameters.</p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Service</span>
              <span className="font-medium text-sm text-foreground">{formData.service}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Version Tag</span>
              <Badge variant="secondary" className="font-mono">{formData.version}</Badge>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Target Audience</span>
              <span className="font-medium text-sm text-foreground capitalize">{formData.audience.replace('-', ' ')}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Rollout Strategy</span>
              <span className="font-medium text-sm text-foreground capitalize">{formData.rollout}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex items-start gap-3 p-4 bg-info/10 border border-info/20 rounded-lg text-info">
        <Settings className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="text-sm">
          <strong>Notice:</strong> Launching this release will automatically notify the targeting audience and begin metrics tracking.
        </p>
      </div>
    </div>
  )
}

function SuccessState({ handleClose, service, version }: any) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-6 border-4 border-success/30">
        <Rocket className="w-10 h-10 text-success" />
      </div>
      <h2 className="text-3xl font-bold mb-3">Release Initiated!</h2>
      <p className="text-muted-foreground mb-10 max-w-md mx-auto">
        <strong>{service} {version}</strong> has been officially launched.
        You can track the adoption metrics on the dashboard.
      </p>

      <div className="space-y-3 w-full max-w-sm">
        <Button className="w-full" onClick={handleClose}>
          View Release Status
        </Button>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { X, ArrowLeft, ArrowRight, CheckCircle2, Users, Shield, Layout, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useAppState } from '@/lib/hooks/use-app-state'
import { cn } from '@/lib/utils'

interface CreateTeamDrawerProps {
  onSuccess: (teamData: any) => void
}

const STEPS = [
  { id: 1, title: 'Details', desc: 'Basic Information' },
  { id: 2, title: 'Members', desc: 'Assign Users' },
  { id: 3, title: 'Ownership', desc: 'Map Resources' },
  { id: 4, title: 'Review', desc: 'Confirm & Create' },
]

export function CreateTeamDrawer({ onSuccess }: CreateTeamDrawerProps) {
  const { isCreateTeamOpen, setCreateTeamOpen, addNotification } = useAppState()
  const [step, setStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    membersCount: 1,
    servicesCount: 1,
    clustersCount: 0,
  })

  useEffect(() => {
    if (isCreateTeamOpen) {
      document.body.style.overflow = 'hidden'
      setStep(1)
      setIsSuccess(false)
      setIsExecuting(false)
      setIsAnimatingOut(false)
      setFormData({
        name: '',
        description: '',
        membersCount: 1,
        servicesCount: 1,
        clustersCount: 0,
      })
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isCreateTeamOpen])

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setCreateTeamOpen(false)
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
        id: `team-new-${Date.now()}`,
        name: formData.name || 'New Team',
        members: formData.membersCount,
        ownedServices: formData.servicesCount,
        ownedClusters: formData.clustersCount,
        activeIncidents: 0,
        onCall: 'Unassigned',
      })
      
      addNotification({
        title: 'Team Created',
        description: `The team "${formData.name || 'New Team'}" has been successfully provisioned.`,
        type: 'success'
      })
    }, 1500)
  }

  const isNextDisabled = () => {
    if (step === 1 && !formData.name) return true
    return false
  }

  if (!isCreateTeamOpen && !isAnimatingOut) return null

  return (
    <>
      <div
        className={cn("fixed inset-0 bg-black/50 z-40 transition-opacity duration-300", isAnimatingOut ? "opacity-0" : "opacity-100")}
        onClick={handleClose}
      />

      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[700px] lg:w-[800px] bg-background border-l border-border shadow-xl transform transition-transform duration-300 z-50 flex flex-col",
          (isCreateTeamOpen && !isAnimatingOut) ? "translate-x-0" : "translate-x-full"
        )}
      >
        {!isSuccess ? (
          <>
            <div className="bg-background border-b border-border p-6 pb-0">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                    <Users className="w-6 h-6 text-primary" /> Create Team
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                    Organize your engineering organization with proper ownership boundaries and access controls.
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
                {step === 2 && <StepMembers formData={formData} setFormData={setFormData} />}
                {step === 3 && <StepOwnership formData={formData} setFormData={setFormData} />}
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
                {step === STEPS.length ? (isExecuting ? 'Creating...' : 'Confirm & Create') : 'Continue'}
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
          <h3 className="font-semibold text-lg mb-4">Team Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Team Name <span className="text-destructive">*</span></label>
              <Input 
                placeholder="e.g. Core Platform, Frontend Infra" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Description</label>
              <Textarea 
                placeholder="What is this team responsible for?" 
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

function StepMembers({ formData, setFormData }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">Assign Members</h3>
              <p className="text-sm text-muted-foreground mt-1">Add engineers to this team.</p>
            </div>
            <Badge variant="secondary" className="px-3 py-1 text-sm">{formData.membersCount} Members</Badge>
          </div>
          
          <div className="space-y-4">
            {Array.from({ length: formData.membersCount }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 bg-muted/30 p-3 rounded-lg border border-border">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <Input placeholder={`Member email or name...`} className="flex-1" />
                <SelectRole />
                {i > 0 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive shrink-0"
                    onClick={() => setFormData({ ...formData, membersCount: formData.membersCount - 1 })}
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
            onClick={() => setFormData({ ...formData, membersCount: formData.membersCount + 1 })}
          >
            + Add Another Member
          </Button>
        </div>
      </Card>
    </div>
  )
}

function SelectRole() {
  return (
    <select className="flex h-10 w-32 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
      <option value="engineer">Engineer</option>
      <option value="lead">Tech Lead</option>
      <option value="manager">Manager</option>
    </select>
  )
}

function StepOwnership({ formData, setFormData }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">Map Resources</h3>
              <p className="text-sm text-muted-foreground mt-1">Assign services and clusters to this team.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                <Layout className="w-4 h-4" /> Services Owned
              </label>
              <div className="flex items-center gap-4">
                <Input type="number" min={0} value={formData.servicesCount} onChange={(e) => setFormData({...formData, servicesCount: parseInt(e.target.value) || 0})} className="w-24" />
                <span className="text-sm text-muted-foreground">microservices or applications</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                <Settings className="w-4 h-4" /> Clusters Owned
              </label>
              <div className="flex items-center gap-4">
                <Input type="number" min={0} value={formData.clustersCount} onChange={(e) => setFormData({...formData, clustersCount: parseInt(e.target.value) || 0})} className="w-24" />
                <span className="text-sm text-muted-foreground">kubernetes or physical clusters</span>
              </div>
            </div>
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
              <Shield className="w-6 h-6" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{isExecuting ? 'Creating...' : 'Review Team'}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isExecuting ? 'Please wait while NexOps sets up the workspace.' : 'Verify team details before creation.'}
            </p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Team Name</span>
              <span className="font-medium text-foreground text-lg">{formData.name}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Members</span>
              <span className="font-medium text-foreground">{formData.membersCount} Assigned</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Services</span>
              <span className="font-medium text-foreground">{formData.servicesCount} Owned</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Clusters</span>
              <span className="font-medium text-foreground">{formData.clustersCount} Owned</span>
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
      <h2 className="text-3xl font-bold mb-3">Team Created</h2>
      <p className="text-muted-foreground mb-10 max-w-md mx-auto">
        Your new engineering team has been successfully created and configured.
      </p>

      <div className="space-y-3 w-full max-w-sm">
        <Button className="w-full" onClick={handleClose}>
          Done
        </Button>
      </div>
    </div>
  )
}

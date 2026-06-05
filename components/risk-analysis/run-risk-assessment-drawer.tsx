'use client'

import { useState, useEffect } from 'react'
import { X, ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert, Target, ShieldCheck, Cpu } from 'lucide-react'
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

interface RunRiskAssessmentDrawerProps {
  onSuccess: (result: any) => void
}

const STEPS = [
  { id: 1, title: 'Scope', desc: 'Define Boundary' },
  { id: 2, title: 'Vectors', desc: 'Select Risk Vectors' },
  { id: 3, title: 'Strategy', desc: 'Analysis Method' },
  { id: 4, title: 'Review', desc: 'Confirm' },
]

export function RunRiskAssessmentDrawer({ onSuccess }: RunRiskAssessmentDrawerProps) {
  const { isRunRiskAssessmentOpen, setRunRiskAssessmentOpen, addNotification } = useAppState()
  const [step, setStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isScanning, setIsScanning] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    scope: 'all-services', // all-services, specific-cluster, single-service
    targetId: '',
    vectors: ['vulnerabilities', 'reliability'], // vulnerabilities, reliability, compliance
    strategy: 'deep', // quick, standard, deep
  })

  // Close animation state
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  useEffect(() => {
    if (isRunRiskAssessmentOpen) {
      document.body.style.overflow = 'hidden'
      setStep(1)
      setIsSuccess(false)
      setIsScanning(false)
      setIsAnimatingOut(false)
      setFormData({
        scope: 'all-services',
        targetId: 'global',
        vectors: ['vulnerabilities', 'reliability'],
        strategy: 'deep',
      })
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isRunRiskAssessmentOpen])

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setRunRiskAssessmentOpen(false)
      setIsAnimatingOut(false)
    }, 300)
  }

  const handleCreate = () => {
    setIsScanning(true)
    
    // Fake scan delay
    setTimeout(() => {
      setIsScanning(false)
      setIsSuccess(true)
      
      const newResult = {
        scope: formData.scope,
        riskScore: Math.floor(Math.random() * 40) + 10,
      }
      
      onSuccess(newResult)
      
      addNotification({
        title: 'Risk Assessment Complete',
        description: `Assessment finished. No new critical risks identified.`,
        type: 'info'
      })
    }, 2500)
  }

  const toggleVector = (vector: string) => {
    setFormData(prev => {
      if (prev.vectors.includes(vector)) {
        return { ...prev, vectors: prev.vectors.filter(v => v !== vector) }
      } else {
        return { ...prev, vectors: [...prev.vectors, vector] }
      }
    })
  }

  if (!isRunRiskAssessmentOpen && !isAnimatingOut) return null;

  return (
    <>
      <div
        className={cn("fixed inset-0 bg-black/50 z-40 transition-opacity duration-300", isAnimatingOut ? "opacity-0" : "opacity-100")}
        onClick={handleClose}
      />

      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[700px] lg:w-[800px] bg-background border-l border-border shadow-xl transform transition-transform duration-300 z-50 flex flex-col",
          (isRunRiskAssessmentOpen && !isAnimatingOut) ? "translate-x-0" : "translate-x-full"
        )}
      >
        {!isSuccess ? (
          <>
            <div className="bg-background border-b border-border p-6 pb-0">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-primary" /> Run Risk Assessment
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                    Execute a manual predictive risk analysis across your infrastructure to uncover vulnerabilities and reliability risks.
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
                {step === 1 && <StepScope formData={formData} setFormData={setFormData} />}
                {step === 2 && <StepVectors formData={formData} toggleVector={toggleVector} />}
                {step === 3 && <StepStrategy formData={formData} setFormData={setFormData} />}
                {step === 4 && <StepReview formData={formData} isScanning={isScanning} />}
              </div>
            </ScrollArea>

            <div className="bg-background border-t border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={step === 1 ? handleClose : () => setStep(step - 1)} disabled={isScanning}>
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
                  (step === 1 && (!formData.scope || !formData.targetId)) ||
                  (step === 2 && formData.vectors.length === 0) ||
                  isScanning
                }
              >
                {step === 4 ? (isScanning ? 'Running Assessment...' : 'Start Assessment') : 'Continue'}
                {step !== 4 && <ArrowRight className="w-4 h-4" />}
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

function StepScope({ formData, setFormData }: any) {
  const scopes = [
    { id: 'all-services', label: 'Global Analysis', desc: 'Assess all clusters and services across the platform' },
    { id: 'specific-cluster', label: 'Cluster Level', desc: 'Assess a specific Kubernetes cluster' },
    { id: 'single-service', label: 'Single Service', desc: 'Deep dive into a single microservice' },
  ]

  const targets = {
    'specific-cluster': ['prod-us-east-1', 'prod-eu-west-1', 'staging-us-east-1'],
    'single-service': ['API Gateway', 'User Service', 'Search Service', 'Database'],
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <label className="text-sm font-semibold mb-2 block">Assessment Scope</label>
          <div className="grid grid-cols-1 gap-3">
            {scopes.map(s => (
              <div 
                key={s.id}
                onClick={() => {
                  setFormData({
                    ...formData, 
                    scope: s.id, 
                    targetId: s.id === 'all-services' ? 'global' : ''
                  })
                }}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-colors",
                  formData.scope === s.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-background"
                )}
              >
                <h4 className={cn("font-medium", formData.scope === s.id ? "text-primary" : "text-foreground")}>{s.label}</h4>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {formData.scope !== 'all-services' && (
          <div>
            <label className="text-sm font-semibold mb-2 block">Select Target</label>
            <Select value={formData.targetId} onValueChange={(val) => setFormData({...formData, targetId: val})}>
              <SelectTrigger>
                <SelectValue placeholder="Select target..." />
              </SelectTrigger>
              <SelectContent>
                {(targets[formData.scope as keyof typeof targets] || []).map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </Card>
    </div>
  )
}

function StepVectors({ formData, toggleVector }: any) {
  const vectors = [
    { id: 'vulnerabilities', label: 'Dependency Vulnerabilities (CVEs)', desc: 'Scan code and container images for known Common Vulnerabilities and Exposures.' },
    { id: 'reliability', label: 'Reliability & MTBF', desc: 'Analyze historical failure rates, change failure rate, and predicted MTBF.' },
    { id: 'compliance', label: 'Security Compliance', desc: 'Check configurations against SOC2/HIPAA compliance standards.' },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <label className="text-sm font-semibold mb-2 block">Risk Vectors</label>
          <p className="text-sm text-muted-foreground mb-4">Select the dimensions of risk you wish to analyze.</p>
          <div className="grid grid-cols-1 gap-3">
            {vectors.map(v => {
              const isSelected = formData.vectors.includes(v.id);
              return (
                <div 
                  key={v.id}
                  onClick={() => toggleVector(v.id)}
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-colors flex items-start gap-3",
                    isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-background"
                  )}
                >
                  <div className={cn("mt-1 flex-shrink-0 w-5 h-5 border rounded flex items-center justify-center", isSelected ? "bg-primary border-primary" : "border-input")}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />}
                  </div>
                  <div>
                    <h4 className={cn("font-medium", isSelected ? "text-primary" : "text-foreground")}>{v.label}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{v.desc}</p>
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

function StepStrategy({ formData, setFormData }: any) {
  const strategies = [
    { id: 'quick', label: 'Quick Scan', desc: 'Fast analysis using cached metrics and top-level aggregates. (~30s)' },
    { id: 'standard', label: 'Standard Assessment', desc: 'Balanced analysis fetching recent metrics and partial logs. (~2m)' },
    { id: 'deep', label: 'Deep Inspection', desc: 'Comprehensive analysis rebuilding dependency trees and scanning all repos. (~10m)' },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-xl mx-auto">
      <Card className="p-6 bg-background space-y-6">
        <div>
          <label className="text-sm font-semibold mb-2 block">Analysis Strategy</label>
          <div className="grid grid-cols-1 gap-3">
            {strategies.map(s => (
              <div 
                key={s.id}
                onClick={() => setFormData({...formData, strategy: s.id})}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-colors flex items-center justify-between",
                  formData.strategy === s.id ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 text-muted-foreground"
                )}
              >
                <div>
                  <h4 className="font-medium text-foreground">{s.label}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                </div>
                {formData.strategy === s.id && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

function StepReview({ formData, isScanning }: any) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto space-y-6">
      <Card className="overflow-hidden border-primary/20 shadow-sm p-0 gap-0">
        <div className="bg-primary/5 p-6 border-b border-primary/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            {isScanning ? (
              <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Cpu className="w-6 h-6" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{isScanning ? 'Executing Assessment...' : 'Review Assessment'}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isScanning ? 'Analyzing risk vectors across the specified scope.' : 'Ready to start the predictive risk analysis.'}
            </p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Scope</span>
              <span className="font-medium text-foreground capitalize">{formData.scope.replace('-', ' ')}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Target</span>
              <span className="font-medium text-sm text-foreground">{formData.targetId}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Vectors</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.vectors.map((v: string) => (
                  <Badge key={v} variant="outline" className="capitalize">{v}</Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Strategy</span>
              <span className="font-medium text-sm text-foreground capitalize">{formData.strategy}</span>
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
        <ShieldCheck className="w-10 h-10 text-success" />
      </div>
      <h2 className="text-3xl font-bold mb-3">Assessment Complete</h2>
      <p className="text-muted-foreground mb-10 max-w-md mx-auto">
        The risk assessment has successfully completed. The dashboard has been updated with the latest predictive intelligence.
      </p>

      <div className="space-y-3 w-full max-w-sm">
        <Button className="w-full" onClick={handleClose}>
          View Dashboard
        </Button>
      </div>
    </div>
  )
}

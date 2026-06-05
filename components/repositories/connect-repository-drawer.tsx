'use client'

import { useState, useEffect } from 'react'
import { X, ArrowLeft, ArrowRight, CheckCircle2, Search, Check, Github, Key, Link as LinkIcon, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAppState } from '@/lib/hooks/use-app-state'
import { mockRepositories } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface ConnectRepositoryDrawerProps {
  onSuccess: (newRepos: any[]) => void
}

const STEPS = [
  { id: 1, title: 'Provider', desc: 'Source Control' },
  { id: 2, title: 'Auth', desc: 'Credentials' },
  { id: 3, title: 'Repositories', desc: 'Select Repos' },
  { id: 4, title: 'Review', desc: 'Confirm' },
]

export function ConnectRepositoryDrawer({ onSuccess }: ConnectRepositoryDrawerProps) {
  const { isConnectRepoOpen, setConnectRepoOpen, addNotification } = useAppState()
  const [step, setStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    provider: 'GitHub',
    authMethod: 'OAuth',
    patToken: '',
    selectedRepos: [] as any[],
  })

  // Close animation state
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  useEffect(() => {
    if (isConnectRepoOpen) {
      document.body.style.overflow = 'hidden'
      setStep(1)
      setIsSuccess(false)
      setIsAnimatingOut(false)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isConnectRepoOpen])

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setConnectRepoOpen(false)
      setIsAnimatingOut(false)
    }, 300)
  }

  const handleCreate = () => {
    setIsSuccess(true)
    
    // Transform selected raw repos to page format
    const newRepos = formData.selectedRepos.map((repo, idx) => ({
      id: `new-repo-${Date.now()}-${idx}`,
      name: repo.name,
      owner: repo.owner,
      description: repo.description,
      health: 100,
      status: 'healthy',
      prs: 0,
      commits30d: 0,
      stars: 0,
      securityIssues: 0,
      dependencies: 12,
      codeQuality: 100,
      coverage: 95,
      lastUpdated: 'Just now',
    }))
    
    onSuccess(newRepos)
    
    addNotification({
      title: 'Repositories Connected',
      description: `Successfully connected ${newRepos.length} repos from ${formData.provider}`,
      type: 'success'
    })
  }

  if (!isConnectRepoOpen && !isAnimatingOut) return null;

  return (
    <>
      <div
        className={cn("fixed inset-0 bg-black/50 z-40 transition-opacity duration-300", isAnimatingOut ? "opacity-0" : "opacity-100")}
        onClick={handleClose}
      />

      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[700px] lg:w-[800px] bg-background border-l border-border shadow-xl transform transition-transform duration-300 z-50 flex flex-col",
          (isConnectRepoOpen && !isAnimatingOut) ? "translate-x-0" : "translate-x-full"
        )}
      >
        {!isSuccess ? (
          <>
            <div className="bg-background border-b border-border p-6 pb-0">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Connect Repository</h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                    Link your source control to enable security scanning, code quality analysis, and deployment tracking.
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
                        {isCompleted ? <Check className="w-4 h-4" /> : s.id}
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
                {step === 1 && <StepProvider formData={formData} setFormData={setFormData} />}
                {step === 2 && <StepAuth formData={formData} setFormData={setFormData} />}
                {step === 3 && <StepSelection formData={formData} setFormData={setFormData} />}
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
                disabled={step === 3 && formData.selectedRepos.length === 0}
              >
                {step === 4 ? 'Connect Repositories' : 'Continue'}
                {step !== 4 && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </>
        ) : (
          <SuccessState handleClose={handleClose} repoCount={formData.selectedRepos.length} />
        )}
      </div>
    </>
  )
}

function StepProvider({ formData, setFormData }: any) {
  const providers = [
    { name: 'GitHub', icon: Github, desc: 'Connect to GitHub.com or Enterprise' },
    { name: 'GitLab', icon: Database, desc: 'Connect to GitLab.com or self-hosted' },
    { name: 'Bitbucket', icon: Database, desc: 'Connect to Bitbucket Cloud or Server' },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Source Control Provider</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {providers.map(p => (
            <div 
              key={p.name}
              onClick={() => setFormData({...formData, provider: p.name})}
              className={cn(
                "border rounded-xl p-6 cursor-pointer transition-colors flex flex-col items-center gap-3 text-center",
                formData.provider === p.name ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 text-muted-foreground bg-background"
              )}
            >
              <p.icon className="w-10 h-10" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">{p.name}</h4>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepAuth({ formData, setFormData }: any) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-xl mx-auto">
      <div>
        <h3 className="text-lg font-semibold mb-4">Authenticate with {formData.provider}</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div 
            onClick={() => setFormData({...formData, authMethod: 'OAuth'})}
            className={cn(
              "border rounded-lg p-4 cursor-pointer text-center",
              formData.authMethod === 'OAuth' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-background"
            )}
          >
            <LinkIcon className="w-5 h-5 mx-auto mb-2 text-primary" />
            <span className="font-medium">OAuth App</span>
          </div>
          <div 
            onClick={() => setFormData({...formData, authMethod: 'PAT'})}
            className={cn(
              "border rounded-lg p-4 cursor-pointer text-center",
              formData.authMethod === 'PAT' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-background"
            )}
          >
            <Key className="w-5 h-5 mx-auto mb-2 text-primary" />
            <span className="font-medium">Personal Access Token</span>
          </div>
        </div>

        {formData.authMethod === 'OAuth' ? (
          <Card className="p-8 text-center bg-background border-dashed">
            <Github className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h4 className="font-semibold mb-2">Connect to {formData.provider}</h4>
            <p className="text-sm text-muted-foreground mb-6">You will be redirected to authorize the NexOps application.</p>
            <Button variant="secondary" className="w-full">
              Authorize {formData.provider}
            </Button>
            <p className="text-xs text-muted-foreground mt-4">For demo purposes, just click Continue below.</p>
          </Card>
        ) : (
          <Card className="p-6 bg-background">
            <label className="text-sm font-semibold mb-2 block">Personal Access Token</label>
            <Input 
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={formData.patToken}
              onChange={(e) => setFormData({...formData, patToken: e.target.value})}
              className="mb-2"
            />
            <p className="text-xs text-muted-foreground">Requires `repo`, `read:user`, and `read:org` scopes.</p>
          </Card>
        )}
      </div>
    </div>
  )
}

function StepSelection({ formData, setFormData }: any) {
  const [search, setSearch] = useState('')

  const toggleRepo = (repo: any) => {
    const isSelected = formData.selectedRepos.find((r: any) => r.id === repo.id);
    if (isSelected) {
      setFormData({
        ...formData,
        selectedRepos: formData.selectedRepos.filter((r: any) => r.id !== repo.id)
      })
    } else {
      setFormData({
        ...formData,
        selectedRepos: [...formData.selectedRepos, repo]
      })
    }
  }

  const availableRepos = [
    { id: 'r1', name: 'auth-service', owner: 'nexops-org', description: 'Authentication and identity service.' },
    { id: 'r2', name: 'payment-gateway', owner: 'nexops-org', description: 'Stripe integration for billing.' },
    { id: 'r3', name: 'frontend-app', owner: 'nexops-org', description: 'React single page application.' },
    { id: 'r4', name: 'data-pipeline', owner: 'nexops-org', description: 'Nightly ETL scripts and jobs.' },
    { id: 'r5', name: 'infrastructure', owner: 'nexops-org', description: 'Terraform and Kubernetes manifests.' },
  ].filter(r => r.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Select Repositories</h3>
        <Badge variant="secondary">{formData.selectedRepos.length} Selected</Badge>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          className="pl-9 bg-background" 
          placeholder={`Search ${formData.provider} repositories...`} 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {availableRepos.map(repo => {
          const isSelected = formData.selectedRepos.find((r: any) => r.id === repo.id);
          return (
            <div 
              key={repo.id}
              onClick={() => toggleRepo(repo)}
              className={cn(
                "p-4 border rounded-lg cursor-pointer transition-all flex items-start justify-between gap-4",
                isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-background hover:border-primary/30"
              )}
            >
              <div className="flex-1">
                <p className="font-semibold text-foreground">{repo.name}</p>
                <p className="text-xs text-muted-foreground mb-2">{repo.owner}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{repo.description}</p>
              </div>
              <div className={cn("w-5 h-5 rounded-full border flex flex-shrink-0 items-center justify-center transition-colors mt-1", isSelected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground")}>
                {isSelected && <Check className="w-3 h-3" />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StepReview({ formData }: any) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto space-y-6">
      <Card className="overflow-hidden border-primary/20 shadow-sm">
        <div className="bg-primary/5 p-6 border-b border-primary/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Ready to Connect</h2>
            <p className="text-sm text-muted-foreground mt-1">Review your selections before importing.</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
            <Github className="w-6 h-6" />
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Provider</span>
              <span className="font-medium text-sm">{formData.provider}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Auth Method</span>
              <span className="font-medium text-sm">{formData.authMethod}</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">Repositories to Import ({formData.selectedRepos.length})</span>
            <div className="space-y-2">
              {formData.selectedRepos.map((r: any) => (
                <div key={r.id} className="text-sm p-3 border border-border rounded-lg bg-muted/30 flex justify-between items-center">
                  <span className="font-medium">{r.name}</span>
                  <Badge variant="outline" className="bg-background">{r.owner}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function SuccessState({ handleClose, repoCount }: any) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-6 border-4 border-success/30">
        <CheckCircle2 className="w-10 h-10 text-success" />
      </div>
      <h2 className="text-3xl font-bold mb-3">Successfully Connected!</h2>
      <p className="text-muted-foreground mb-10 max-w-sm mx-auto">
        {repoCount} repositories have been imported and are now being indexed for code quality and security analysis.
      </p>

      <div className="space-y-3 w-full max-w-sm">
        <Button className="w-full" onClick={handleClose}>
          View Repositories
        </Button>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAppState } from '@/lib/hooks/use-app-state'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Github, Play, ArrowRight, ShieldCheck, CheckCircle2, Network, AlertTriangle, Loader2, BellOff, AlertCircle, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NexOpsLogo } from '@/components/ui/nexops-logo'

interface DiscoveredNode {
  id: string
  name: string
  tier: 'ingress' | 'service' | 'data'
  owner: string
  alertHistory: {
    count30d: number
    noisyRuleIds?: string[]
  }
  enriched?: boolean
}

import { TermsGateModal } from '@/components/terms-gate-modal'

export default function OnboardingPage() {
  const router = useRouter()
  const { setOnboardingComplete, currentUser } = useAppState()
  const [step, setStep] = useState(1)
  const [checkingTerms, setCheckingTerms] = useState(true)
  const [showTermsModal, setShowTermsModal] = useState(false)

  // Connection states
  const [githubState, setGithubState] = useState<'disconnected' | 'connecting' | 'scanning' | 'done'>('disconnected')
  const [pagerdutyState, setPagerdutyState] = useState<'disconnected' | 'connecting' | 'scanning' | 'done'>('disconnected')
  const [pagerdutyToken, setPagerdutyToken] = useState('')
  const [showPdInput, setShowPdInput] = useState(false)
  const [pdError, setPdError] = useState<string | null>(null)

  // Check terms acknowledgment status on mount
  useEffect(() => {
    async function checkTerms() {
      try {
        const { apiFetch } = await import('@/lib/api-client')
        const statusData = await apiFetch('/integrations/status') as { terms_acknowledged: boolean }
        if (!statusData.terms_acknowledged) {
          setShowTermsModal(true)
        } else {
          setShowTermsModal(false)
        }
      } catch (err) {
        console.error('Failed to check terms on onboarding:', err)
        setShowTermsModal(true)
      } finally {
        setCheckingTerms(false)
      }
    }
    checkTerms()
  }, [])

  // Discovered list states
  const [discoveredNodes, setDiscoveredNodes] = useState<DiscoveredNode[]>([])
  const [pagerdutyEnrichedDone, setPagerdutyEnrichedDone] = useState(false)

  // Topology state for previewing graph in Step 2
  const [topology, setTopology] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] })

  // Refs to hold interval IDs for cleanups
  const githubIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const pagerdutyIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Detect GitHub Redirect Callback on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get('success') === 'github_connected') {
      setGithubState('scanning')

      // Clean query params
      window.history.replaceState({}, document.title, window.location.pathname)

      async function triggerSync() {
        try {
          const { apiFetch } = await import('@/lib/api-client')
          // Trigger actual sync with the decrypted OAuth token
          await apiFetch('/integrations/sync', {
            method: 'POST',
            body: JSON.stringify({
              provider: 'github',
              token: 'use_stored_token',
              workspaceId: 'default-workspace'
            })
          })

          // Fetch synced repositories from the database
          const repos = await apiFetch('/repos')

          if (repos && repos.length > 0) {
            setDiscoveredNodes(repos.map((r: any, idx: number) => {
              const nameLower = r.name.toLowerCase()
              let tier: 'ingress' | 'service' | 'data' = 'service'
              if (nameLower.includes('gateway') || nameLower.includes('frontend')) {
                tier = 'ingress'
              } else if (nameLower.includes('database') || nameLower.includes('db') || nameLower.includes('redis') || nameLower.includes('cache') || nameLower.includes('queue') || nameLower.includes('kafka') || nameLower.includes('terraform')) {
                tier = 'data'
              }
              return {
                id: r.id,
                name: r.name,
                tier,
                owner: r.owner || 'unknown',
                alertHistory: {
                  count30d: 0,
                  noisyRuleIds: []
                }
              }
            }))
          }

          setGithubState('done')
        } catch (err) {
          console.error("Failed to sync GitHub repositories:", err)
          setGithubState('disconnected')
          alert("Failed to synchronize repositories from GitHub. Please try connecting again.")
        }
      }

      triggerSync()
    }
  }, [])

  // Cleanup intervals on component unmount
  useEffect(() => {
    return () => {
      if (githubIntervalRef.current) clearInterval(githubIntervalRef.current)
      if (pagerdutyIntervalRef.current) clearInterval(pagerdutyIntervalRef.current)
    }
  }, [])

  // Load topology for Step 2 preview
  useEffect(() => {
    if (step === 2) {
      async function loadTopology() {
        try {
          const { apiFetch } = await import('@/lib/api-client')
          const data = await apiFetch('/dependencies/topology')
          setTopology(data)
        } catch (err) {
          console.error("Failed to load topology:", err)
        }
      }
      loadTopology()
    }
  }, [step])

  const handleConnectGithub = async () => {
    if (githubState !== 'disconnected') return
    if (!currentUser || !currentUser.id) {
      alert("Error: User session not found. Please log in again.")
      return
    }
    setGithubState('connecting')

    try {
      const { apiFetch } = await import('@/lib/api-client')
      const { url } = await apiFetch('/integrations/github/oauth-url')
      window.location.href = url
    } catch (err) {
      console.error('Failed to get GitHub OAuth URL:', err)
      alert('Failed to start GitHub connection. Please try again.')
      setGithubState('disconnected')
    }
  }

  const handleConnectPagerDuty = () => {
    if (pagerdutyState !== 'disconnected') return
    setShowPdInput(!showPdInput)
  }

  const submitPagerDutyToken = async () => {
    if (!pagerdutyToken.trim()) {
      setPdError('API Token cannot be empty')
      return
    }
    setPdError(null)
    setPagerdutyState('connecting')
    setShowPdInput(false)

    try {
      const { apiFetch } = await import('@/lib/api-client')
      await apiFetch('/integrations/pagerduty/connect', {
        method: 'POST',
        body: JSON.stringify({ token: pagerdutyToken.trim() })
      })

      setPagerdutyState('scanning')

      // Staggered enrichment of nodes (150ms per node)
      let i = 0
      if (pagerdutyIntervalRef.current) clearInterval(pagerdutyIntervalRef.current)
      pagerdutyIntervalRef.current = setInterval(() => {
        if (i < discoveredNodes.length) {
          const indexToEnrich = i
          setDiscoveredNodes((prev) => {
            const updated = [...prev]
            if (updated[indexToEnrich]) {
              updated[indexToEnrich] = { ...updated[indexToEnrich], enriched: true }
            }
            return updated
          })
          i++
        } else {
          if (pagerdutyIntervalRef.current) {
            clearInterval(pagerdutyIntervalRef.current)
            pagerdutyIntervalRef.current = null
          }
          setPagerdutyEnrichedDone(true)
          setPagerdutyState('done')
        }
      }, 150)
    } catch (err) {
      console.error("Failed to connect PagerDuty:", err)
      setPdError(err instanceof Error ? err.message : 'Validation failed. Invalid token or network issue.')
      setPagerdutyState('disconnected')
      setShowPdInput(true)
    }
  }

  const handleBackToStep1 = () => {
    if (githubIntervalRef.current) {
      clearInterval(githubIntervalRef.current)
      githubIntervalRef.current = null
    }
    if (pagerdutyIntervalRef.current) {
      clearInterval(pagerdutyIntervalRef.current)
      pagerdutyIntervalRef.current = null
    }
    setStep(1)
    setGithubState('disconnected')
    setPagerdutyState('disconnected')
    setDiscoveredNodes([])
    setPagerdutyEnrichedDone(false)
  }

  const handleFinishOnboarding = async () => {
    try {
      const { apiFetch } = await import('@/lib/api-client')
      await apiFetch('/users/onboarding/complete', {
        method: 'POST'
      })
    } catch (err) {
      console.error("Failed to post onboarding complete to backend:", err)
    }
    setOnboardingComplete(true)
    router.push('/dashboard')
  }

  const getDynamicProgress = () => {
    if (step === 1) {
      if (githubState === 'disconnected') return 10
      if (githubState === 'connecting') return 20
      if (githubState === 'scanning') return 30
      if (githubState === 'done') {
        if (pagerdutyState === 'disconnected') return 45
        if (pagerdutyState === 'connecting') return 55
        if (pagerdutyState === 'scanning') return 65
        if (pagerdutyState === 'done') {
          return pagerdutyEnrichedDone ? 75 : 70
        }
      }
      return 10
    }
    if (step === 2) return 90
    if (step === 3) return 100
    return 10
  }

  // Full-screen loading spinner while checking workspace terms requirement
  if (checkingTerms) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-4 animate-in fade-in duration-200">
        <NexOpsLogo size="xl" />
        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        <p className="text-xs text-muted-foreground font-medium">Checking workspace requirements…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 relative overflow-hidden py-12">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-[550px] space-y-6 z-10">

        {/* Progress indicator */}
        <div className="flex items-center justify-between px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Onboarding Progress</span>
          <span>Step {step} of 3</span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${getDynamicProgress()}%` }}
          />
        </div>

        {/* Step 1: Connect Integrations */}
        {step === 1 && (
          <Card className="p-8 border border-border/80 backdrop-blur-md bg-card/50 shadow-2xl space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight">Connect Your Toolstack</h2>
              <p className="text-sm text-muted-foreground">
                NexOps derives ownership, deploys, and incident signals automatically. Connect GitHub and PagerDuty to build your dependency model.
              </p>
            </div>

            <div className="space-y-4">
              {/* GitHub integration item */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-foreground/10 text-foreground">
                    <Github className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">GitHub</h3>
                    <p className="text-xs text-muted-foreground">Reads commits, deploys & CODEOWNERS</p>
                  </div>
                </div>
                {githubState === 'done' ? (
                  <Badge className="bg-success/10 text-success border-success/20 gap-1 h-8 px-3" variant="outline">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Connected
                  </Badge>
                ) : githubState === 'connecting' ? (
                  <Button size="sm" variant="outline" className="h-8 gap-2 font-medium" disabled>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                    Connecting…
                  </Button>
                ) : githubState === 'scanning' ? (
                  <Button size="sm" variant="outline" className="h-8 gap-2 font-medium" disabled>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                    Scanning…
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-4 font-semibold"
                    onClick={handleConnectGithub}
                  >
                    Connect
                  </Button>
                )}
              </div>

              {/* PagerDuty integration item */}
              <div className="flex flex-col gap-3 p-4 rounded-xl bg-muted/20 border border-border/50">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">PagerDuty</h3>
                      <p className="text-xs text-muted-foreground">Reads incident streams & alerts</p>
                    </div>
                  </div>
                  {pagerdutyState === 'done' ? (
                    <Badge className="bg-success/10 text-success border-success/20 gap-1 h-8 px-3" variant="outline">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Connected
                    </Badge>
                  ) : pagerdutyState === 'connecting' ? (
                    <Badge className="bg-primary/10 text-primary border-primary/20 gap-1 h-8 px-3 animate-pulse" variant="outline">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                      Connecting…
                    </Badge>
                  ) : pagerdutyState === 'scanning' ? (
                    <Badge className="bg-warning/10 text-warning border-warning/20 gap-1 h-8 px-3 animate-pulse" variant="outline">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                      Scanning…
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-4 font-semibold"
                      onClick={handleConnectPagerDuty}
                      disabled={githubState !== 'done'}
                    >
                      {showPdInput ? 'Cancel' : 'Connect'}
                    </Button>
                  )}
                </div>

                {showPdInput && pagerdutyState === 'disconnected' && (
                  <div className="space-y-3 pt-2 border-t border-border/30 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="text-xs text-muted-foreground">
                      Enter your PagerDuty REST API Key. You can generate one in PagerDuty under{" "}
                      <a
                        href="https://support.pagerduty.com/main/docs/api-access-keys"
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-0.5"
                      >
                        Integrations → API Access Keys
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </a>.
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="e.g. y_NbAkKc..."
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={pagerdutyToken}
                        onChange={(e) => setPagerdutyToken(e.target.value)}
                      />
                      <Button size="sm" className="h-9 px-4 font-semibold" onClick={submitPagerDutyToken}>
                        Submit
                      </Button>
                    </div>
                    {pdError && (
                      <div className="text-xs text-destructive flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {pdError}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Verification List Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <span>Discovered Services ({discoveredNodes.length})</span>
                {githubState === 'scanning' && (
                  <span className="text-primary flex items-center gap-1 normal-case font-normal animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Scanning repos & CODEOWNERS…
                  </span>
                )}
                {pagerdutyState === 'scanning' && (
                  <span className="text-warning flex items-center gap-1 normal-case font-normal animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Syncing incident streams…
                  </span>
                )}
              </div>

              <div className="min-h-[220px] max-h-[220px] overflow-y-auto border border-border/50 rounded-xl divide-y divide-border/30 bg-muted/5 flex flex-col">
                {githubState === 'disconnected' && (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-xs text-muted-foreground">
                    <Network className="w-6 h-6 text-muted-foreground/30 mb-2" />
                    <span>No systems connected yet. Connect GitHub to begin auto-discovery.</span>
                  </div>
                )}

                {githubState === 'connecting' && (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-xs text-muted-foreground">
                    <Loader2 className="w-5 h-5 text-primary animate-spin mb-2" />
                    <span>Establishing link to GitHub api.nexops.internal...</span>
                  </div>
                )}

                {githubState === 'scanning' && discoveredNodes.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-xs text-muted-foreground">
                    <Loader2 className="w-5 h-5 text-primary animate-spin mb-2" />
                    <span>Analyzing repos, ownership and config changes...</span>
                  </div>
                )}

                {discoveredNodes.length > 0 && (
                  <div className="divide-y divide-border/30">
                    {discoveredNodes.map((node) => {
                      return (
                        <div
                          key={node.id}
                          className="p-3 text-xs flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-300 bg-card/30"
                        >
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "w-2 h-2 rounded-full",
                              node.tier === 'ingress' ? 'bg-primary' : node.tier === 'service' ? 'bg-accent' : 'bg-warning'
                            )} />
                            <span className="font-semibold text-foreground">{node.name}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">({node.tier})</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-muted-foreground hidden sm:inline-block">
                              {node.owner}
                            </span>
                            {/* PagerDuty enrichment */}
                            {node.enriched && (
                              <div className="flex items-center gap-1.5 animate-in fade-in duration-300">
                                <Badge variant="outline" className="text-[9px] px-1 py-0 bg-destructive/5 text-destructive border-destructive/10">
                                  {node.alertHistory.count30d} alerts
                                </Badge>
                                {(node.alertHistory.noisyRuleIds?.length ?? 0) > 0 && (
                                  <Badge variant="outline" className="text-[9px] px-1 py-0 bg-warning/5 text-warning border-warning/10 gap-0.5">
                                    <BellOff className="w-2.5 h-2.5" />
                                    {node.alertHistory.noisyRuleIds!.length} noisy
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <Button
              className="w-full h-11 font-medium gap-2 text-sm"
              disabled={githubState !== 'done' || pagerdutyState !== 'done' || !pagerdutyEnrichedDone}
              onClick={() => setStep(2)}
            >
              Continue to Derived Graph
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>
        )}

        {/* Step 2: Service Graph Preview */}
        {step === 2 && (
          <Card className="p-8 border border-border/80 backdrop-blur-md bg-card/50 shadow-2xl space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <Network className="w-5 h-5 text-primary" />
                Auto-Derived Service Graph
              </h2>
              <p className="text-sm text-muted-foreground">
                We parsed your connected platforms. NexOps automatically constructed a 9-node service dependency topology based on your traffic and configs.
              </p>
            </div>

            {/* List/Tree Representation of derived topology */}
            <div className="max-h-[220px] overflow-y-auto border border-border/50 rounded-xl divide-y divide-border/30 bg-muted/5">
              {topology.nodes.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground animate-pulse flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating service topology...
                </div>
              ) : (
                topology.nodes.map((node) => {
                  const nameLower = node.name.toLowerCase()
                  let tier: 'ingress' | 'service' | 'data' = 'service'
                  if (nameLower.includes('gateway') || nameLower.includes('frontend')) {
                    tier = 'ingress'
                  } else if (nameLower.includes('database') || nameLower.includes('db') || nameLower.includes('redis') || nameLower.includes('cache') || nameLower.includes('queue') || nameLower.includes('kafka') || nameLower.includes('terraform')) {
                    tier = 'data'
                  }

                  // Find upstream edges (where source is this node's id)
                  const upstreamEdges = topology.edges.filter((e) => e.source === node.id)
                  const upstreamNames = upstreamEdges.map((edge) => {
                    const targetNode = topology.nodes.find((n) => n.id === edge.target)
                    return targetNode ? targetNode.name : null
                  }).filter(Boolean)

                  return (
                    <div key={node.id} className="p-3 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          tier === 'ingress' ? 'bg-primary' : tier === 'service' ? 'bg-accent' : 'bg-warning'
                        )} />
                        <span className="font-semibold text-foreground">{node.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">({tier})</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                        {upstreamNames.length > 0 ? `Depends on: ${upstreamNames.join(', ')}` : 'Entry Node'}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <div className="p-3 rounded-lg bg-muted/20 border border-border/30 text-xs text-muted-foreground flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
              <span>NexOps resolved microservice owners directly from GitHub <code>CODEOWNERS</code> data. No manual ownership mapping required.</span>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 h-11" onClick={handleBackToStep1}>
                Back
              </Button>
              <Button className="flex-grow h-11 gap-2" onClick={() => setStep(3)}>
                Verify Setup
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Setup Verified */}
        {step === 3 && (
          <Card className="p-8 border border-border/80 backdrop-blur-md bg-card/50 shadow-2xl text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-success/10 border border-success/30 flex items-center justify-center text-success">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight">Onboarding Completed!</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Your correlation engine dashboard is initialized. NexOps will now begin monitoring deploys and alert streams for root-cause matches.
              </p>
            </div>

            <Button
              className="w-full h-11 font-medium gap-2 text-sm shadow-lg shadow-primary/10"
              onClick={handleFinishOnboarding}
            >
              Enter Dashboard
              <Play className="w-4 h-4 fill-current" />
            </Button>
          </Card>
        )}
      </div>

      {/* Post-Authentication Terms of Service & Privacy Notice Gate Modal */}
      <TermsGateModal
        isOpen={showTermsModal}
        onSuccess={() => setShowTermsModal(false)}
      />
    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppState } from '@/lib/hooks/use-app-state'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MetricCard, StatusBadge } from '@/components/layout'
import { ScoreWithReasoning } from '@/components/score-with-reasoning'
import { 
  AlertTriangle, 
  Zap, 
  Network, 
  Flame, 
  ArrowRight, 
  Github, 
  Activity, 
  Compass, 
  CheckCircle2,
  Users,
  Plug,
  BellOff
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Helper to interpolate progress values safely within boundaries
const getProgress = (val: number, start: number, end: number) => {
  if (val < start) return 0
  if (val > end) return 1
  return (val - start) / (end - start)
}

// Custom scroll progress utility hook
function useScrollProgress(ref: React.RefObject<HTMLDivElement | null>, disabled: boolean) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (disabled) {
      setProgress(1.0)
      return
    }

    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const totalHeight = rect.height
      const offsetTop = -rect.top
      const windowHeight = window.innerHeight

      if (offsetTop < 0) {
        setProgress(0)
      } else if (offsetTop > totalHeight - windowHeight) {
        setProgress(1)
      } else {
        const p = offsetTop / (totalHeight - windowHeight)
        setProgress(p)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [ref, disabled])

  return progress
}

export default function LandingPage() {
  const router = useRouter()
  const { isAuthenticated } = useAppState()
  
  const ch1Ref = useRef<HTMLDivElement>(null)
  const ch2Ref = useRef<HTMLDivElement>(null)

  const [reducedMotion, setReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Redirect authenticated users immediately to the dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  // Detect reduced motion and viewport layout adjustments
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(mediaQuery.matches)
      const handleChange = (e: MediaQueryListEvent) => {
        setReducedMotion(e.matches)
      }
      mediaQuery.addEventListener('change', handleChange)

      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }
      checkMobile()
      window.addEventListener('resize', checkMobile)

      return () => {
        mediaQuery.removeEventListener('change', handleChange)
        window.removeEventListener('resize', checkMobile)
      }
    }
  }, [])

  // Hook to calculate scroll progress (0.0 to 1.0)
  const p1 = useScrollProgress(ch1Ref, reducedMotion || isMobile)
  const p2 = useScrollProgress(ch2Ref, reducedMotion || isMobile)

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <Activity className="w-8 h-8 text-primary animate-pulse mb-3" />
        <p className="text-xs text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      
      {/* Landing minimal Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border/50 z-50 transition-colors">
        <div className="flex items-center justify-between h-full px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">N</span>
            </div>
            <span className="font-semibold text-sm">NexOps</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-sm font-semibold">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="text-sm font-semibold gap-1">
                Launch Engine
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Cinematic Hero Header (Static, first fold) */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden px-6 lg:px-8 pt-20">
        {/* Subtle background decoration */}
        <div className="absolute top-[20%] left-[-10%] w-[35%] h-[35%] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-accent/5 blur-[130px] pointer-events-none" />

        <div className="max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-2">
            <SparkleIcon className="w-3.5 h-3.5" />
            NexOps Incident Correlation Engine
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight">
            What caused this incident,<br />and how do we know?
          </h1>
          <p className="text-base lg:text-lg text-muted-foreground max-w-xl mx-auto">
            NexOps reads deploys, alerts, and dependency graphs from GitHub and PagerDuty, auto-correlating causes with explicit reasoning.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/login">
              <Button size="lg" className="font-semibold gap-2 shadow-lg shadow-primary/15">
                Launch Engine
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <span className="text-xs text-muted-foreground italic">Scroll to explore the correlation pipeline</span>
          </div>
        </div>

        {/* Floating preview card to tease the content */}
        <div className="w-full max-w-[850px] mt-12 border border-border/40 rounded-2xl shadow-xl p-4 backdrop-blur-sm bg-card/30 scale-95 opacity-60">
          <div className="flex items-start justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
              <div>
                <span className="font-mono text-muted-foreground">INC-002</span>
                <span className="ml-2 font-bold text-foreground">Database Connection Pool Exhaustion</span>
              </div>
            </div>
            <span className="text-destructive font-semibold">Active</span>
          </div>
        </div>
      </section>

      {/* Chapter 1: Backward Correlation Pinned Scroll Track */}
      <section 
        ref={ch1Ref} 
        className={cn("relative", reducedMotion || isMobile ? "h-auto py-12 px-6" : "h-[300vh]")}
      >
        <div className={cn(
          reducedMotion || isMobile 
            ? "flex flex-col items-center gap-6" 
            : "sticky top-0 h-screen flex flex-col justify-center items-center overflow-hidden px-6 lg:px-8"
        )}>
          {/* Background decoration in sticky view */}
          {!(reducedMotion || isMobile) && (
            <div className="absolute top-[20%] left-[-10%] w-[35%] h-[35%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
          )}

          {/* Centered card frame */}
          <div className="w-full max-w-[850px] border border-border/80 rounded-2xl shadow-2xl p-6 backdrop-blur-md bg-card/60 relative">
            <div className="absolute top-[-16px] left-6">
              <Badge className="px-2.5 py-0.5 border text-[10px] font-bold uppercase bg-primary border-primary text-primary-foreground">
                1. Backward correlation
              </Badge>
            </div>

            {/* Simulated Live Alert (0.0 - 0.15) */}
            <div 
              className="flex items-start justify-between p-4 rounded-xl bg-destructive/10 border border-destructive/20 mb-6 transition-all duration-500"
              style={{ 
                opacity: reducedMotion || isMobile ? 1 : getProgress(p1, 0.0, 0.15),
                transform: reducedMotion || isMobile ? 'none' : `translateY(${(1 - getProgress(p1, 0.0, 0.15)) * 10}px)`
              }}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0 animate-pulse" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">INC-002</span>
                    <StatusBadge status="critical" className="text-[9px] uppercase font-bold" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground mt-1">Database Connection Pool Exhaustion</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Database connection pool reached maximum capacity causing timeouts in User Service.</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-destructive animate-pulse">Alert Active</span>
            </div>

            {/* Suspect Candidates Stack */}
            <div className="space-y-4">
              {/* Candidate 1 (appears 0.15 - 0.45) */}
              <div 
                className="rounded-xl border border-border bg-card/50 p-4 space-y-3 transition-all duration-500"
                style={{ 
                  opacity: reducedMotion || isMobile ? 1 : getProgress(p1, 0.15, 0.45),
                  transform: reducedMotion || isMobile ? 'none' : `translateY(${(1 - getProgress(p1, 0.15, 0.45)) * 10}px)`
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">#1 Suspect</span>
                    <h4 className="font-bold text-sm">User Service</h4>
                    <span className="text-xs font-mono text-muted-foreground">dep-2024-003</span>
                  </div>
                </div>
                <ScoreWithReasoning 
                  score={91} 
                  reasons={[
                    "Deployed 85 min before alert, new connection pooling config in this version",
                    "user-service is direct consumer of database — it opens 60% of pool connections",
                    "The deploy diff includes max_connections change from 50 → 100 that was misapplied"
                  ]} 
                />
                
                {/* Mock Confirm controls (glows 0.75 - 1.0) */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/40 text-xs">
                  <span className="text-muted-foreground flex-1">Was this the cause?</span>
                  <div className="flex gap-2 relative">
                    <div 
                      className="absolute inset-0 bg-success/20 rounded-lg blur-md transition-all duration-700 pointer-events-none"
                      style={{ 
                        opacity: reducedMotion || isMobile ? 0.7 : getProgress(p1, 0.75, 1.0) * 0.8
                      }}
                    />
                    <Button size="sm" variant="outline" className={cn(
                      "h-7 text-[10px] text-success border-success/30 bg-success/5 gap-1 transition-all relative z-10",
                      (reducedMotion || isMobile || p1 >= 0.75) && "border-success/80 ring-1 ring-success/30"
                    )}>
                      <CheckCircle2 className="w-3 h-3" /> Yes, Confirm Cause
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-[10px] text-muted-foreground relative z-10">
                      No
                    </Button>
                  </div>
                </div>
              </div>

              {/* Candidate 2 (appears 0.45 - 0.75) */}
              <div 
                className="rounded-xl border border-border bg-card/40 p-4 space-y-3 transition-all duration-500"
                style={{ 
                  opacity: reducedMotion || isMobile ? 1 : getProgress(p1, 0.45, 0.75),
                  transform: reducedMotion || isMobile ? 'none' : `translateY(${(1 - getProgress(p1, 0.45, 0.75)) * 10}px)`
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">#2 Suspect</span>
                    <h4 className="font-bold text-sm">Payment Service</h4>
                    <span className="text-xs font-mono text-muted-foreground">dep-2024-004</span>
                  </div>
                </div>
                <ScoreWithReasoning 
                  score={42} 
                  reasons={[
                    "Deployed 120 min before alert, contains config updates for Stripe integration",
                    "No direct connections to database, but depends downstream on database through User Service"
                  ]} 
                />
              </div>
            </div>

            {/* Dynamic Step description bubble */}
            <div className="mt-6 pt-4 border-t border-border/40 text-xs text-muted-foreground flex justify-between items-center">
              <span>
                {reducedMotion || isMobile 
                  ? "NexOps correlates active alerts with deployments." 
                  : (p1 < 0.15 ? "Scroll down to see backward correlation suspects" : p1 < 0.75 ? "Keep scrolling to see confirmation actions" : "Scroll further for forward blast radius")}
              </span>
              <span className="font-semibold text-foreground">Step 1 of 2</span>
            </div>

          </div>
        </div>
      </section>

      {/* Chapter 2: Forward Blast Radius Pinned Scroll Track */}
      <section 
        ref={ch2Ref} 
        className={cn("relative", reducedMotion || isMobile ? "h-auto py-12 px-6" : "h-[300vh]")}
      >
        <div className={cn(
          reducedMotion || isMobile 
            ? "flex flex-col items-center gap-6" 
            : "sticky top-0 h-screen flex flex-col justify-center items-center overflow-hidden px-6 lg:px-8"
        )}>
          {/* Background decoration in sticky view */}
          {!(reducedMotion || isMobile) && (
            <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
          )}

          {/* Centered card frame (settles into bordered screenshot on p2 >= 0.9) */}
          <div 
            className={cn(
              "w-full max-w-[850px] border rounded-2xl shadow-2xl p-6 backdrop-blur-md bg-card/60 relative transition-all duration-500",
              (reducedMotion || isMobile || p2 >= 0.9) ? "border-primary/30 shadow-primary/5 ring-4 ring-primary/5" : "border-border/80"
            )}
          >
            <div className="absolute top-[-16px] left-6">
              <Badge className="px-2.5 py-0.5 border text-[10px] font-bold uppercase bg-warning border-warning text-warning-foreground">
                2. Forward Blast Radius
              </Badge>
            </div>

            {/* Deploy event (appears 0.0 - 0.2) */}
            <div 
              className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6 transition-all duration-500"
              style={{ 
                opacity: reducedMotion || isMobile ? 1 : getProgress(p2, 0.0, 0.2),
                transform: reducedMotion || isMobile ? 'none' : `translateY(${(1 - getProgress(p2, 0.0, 0.2)) * 10}px)`
              }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">Deploy Event</span>
                  <h3 className="font-bold text-sm text-foreground">User Service v1.0.4</h3>
                  <p className="text-xs text-muted-foreground">Configuration changes to connection pool limits</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs bg-muted/50 border-border">v1.0.4</Badge>
            </div>

            {/* Derived Topology & Blast Radius (appears 0.2 - 0.8) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visual Graph Nodes */}
              <div className="border border-border/50 rounded-xl p-4 bg-background/40 flex flex-col justify-center gap-2 relative min-h-[160px]">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block text-center mb-1">Derived Topology View</span>
                
                {/* Deploying Node */}
                <div 
                  className="p-2 rounded bg-primary/10 border border-primary/20 text-center text-xs font-bold text-primary max-w-[150px] mx-auto transition-all duration-500"
                  style={{ 
                    opacity: reducedMotion || isMobile ? 1 : getProgress(p2, 0.2, 0.3) 
                  }}
                >
                  user-service (deploy)
                </div>

                <div 
                  className="text-center text-muted-foreground/60 text-xs transition-all duration-500"
                  style={{ 
                    opacity: reducedMotion || isMobile ? 1 : getProgress(p2, 0.3, 0.35) 
                  }}
                >
                  ↓
                </div>

                {/* Direct Impact Nodes (0.2 - 0.5) */}
                <div className="flex gap-2 justify-center">
                  <div 
                    className="p-2 rounded bg-warning/10 border border-warning/20 text-center text-xs font-bold text-warning max-w-[120px] transition-all duration-500"
                    style={{ 
                      opacity: reducedMotion || isMobile ? 1 : getProgress(p2, 0.35, 0.45) 
                    }}
                  >
                    database (direct)
                  </div>
                  <div 
                    className="p-2 rounded bg-warning/10 border border-warning/20 text-center text-xs font-bold text-warning max-w-[120px] transition-all duration-500"
                    style={{ 
                      opacity: reducedMotion || isMobile ? 1 : getProgress(p2, 0.4, 0.5) 
                    }}
                  >
                    auth-service (direct)
                  </div>
                </div>

                <div 
                  className="text-center text-muted-foreground/60 text-xs transition-all duration-500"
                  style={{ 
                    opacity: reducedMotion || isMobile ? 1 : getProgress(p2, 0.5, 0.6) 
                  }}
                >
                  ↓
                </div>

                {/* Downstream Impact Nodes (0.5 - 0.8) */}
                <div 
                  className="p-2 rounded bg-warning/5 border border-warning/10 text-center text-xs font-bold text-warning/70 max-w-[150px] mx-auto transition-all duration-500 shadow-sm"
                  style={{ 
                    opacity: reducedMotion || isMobile ? 1 : getProgress(p2, 0.6, 0.8) 
                  }}
                >
                  payment-service (downstream)
                </div>
              </div>

              {/* Blast Radius Risk Summary Card (appears 0.8 - 1.0) */}
              <div 
                className="transition-all duration-500 flex flex-col justify-between"
                style={{ 
                  opacity: reducedMotion || isMobile ? 1 : getProgress(p2, 0.8, 1.0),
                  transform: reducedMotion || isMobile ? 'none' : `translateY(${(1 - getProgress(p2, 0.8, 1.0)) * 10}px)`
                }}
              >
                <Card className="p-4 bg-muted/20 border border-border/50 h-full flex flex-col justify-between space-y-4">
                  <ScoreWithReasoning 
                    variant="risk" 
                    score={65} 
                    reasons={[
                      "Config changes to connection pool on user-service correlated with 2 of last 9 database incidents",
                      "Downstream blast radius affects payment-service and auth-service core transaction channels"
                    ]} 
                  />
                  <div className="pt-2 border-t border-border/30">
                    <span className="text-[10px] text-muted-foreground font-semibold block mb-1">Directly Impacted</span>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-[9px]">database</Badge>
                      <Badge variant="secondary" className="text-[9px]">auth-service</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Dynamic Step description bubble */}
            <div className="mt-6 pt-4 border-t border-border/40 text-xs text-muted-foreground flex justify-between items-center">
              <span>
                {reducedMotion || isMobile 
                  ? "NexOps maps deploy blast radius downstream." 
                  : (p2 < 0.2 ? "Scroll down to map blast radius downstream" : p2 < 0.8 ? "Keep scrolling to calculate risk scores" : "Keep scrolling to settle and continue")}
              </span>
              <span className="font-semibold text-foreground">Step 2 of 2</span>
            </div>

          </div>
        </div>
      </section>


      {/* Half 2: Product-Led Feature Grid & Platform Specs */}
      <section className="bg-background border-t border-border py-20 px-8 relative">
        <div className="max-w-6xl mx-auto space-y-20">
          
          {/* Signal Source Integration Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold tracking-tight">
                Integrate Signals, Not Records
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                NexOps does not demand yet another proprietary agent or metric exporter. We connect directly to your existing systems of record—GitHub commits, PagerDuty incidents, and cloud deployment pipelines—and compile them into a unified, auto-derived dependency graph.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-muted/20 border border-border/40 space-y-2">
                  <div className="p-2 bg-foreground/10 text-foreground w-fit rounded-lg">
                    <Github className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm">GitHub Sync</h4>
                  <p className="text-xs text-muted-foreground">Derives microservice owners, commits & configs.</p>
                </Card>
                <Card className="p-4 bg-muted/20 border border-border/40 space-y-2">
                  <div className="p-2 bg-destructive/10 text-destructive w-fit rounded-lg">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm">PagerDuty Streams</h4>
                  <p className="text-xs text-muted-foreground">Listens directly to active incident alarms.</p>
                </Card>
              </div>
            </div>

            {/* Architecture diagram mockup */}
            <Card className="p-6 bg-muted/10 border border-border/60 relative overflow-hidden flex flex-col justify-center h-[300px]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="space-y-4">
                <div className="flex items-center gap-3 justify-center mb-2">
                  <Badge variant="outline" className="bg-muted px-2 py-1 text-xs">Commit / Pull Request</Badge>
                  <span className="text-muted-foreground">→</span>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-2 py-1 text-xs">Deploy Event</Badge>
                </div>
                <div className="p-4 bg-background/80 rounded-xl border border-border/80 max-w-[340px] mx-auto text-center space-y-2 shadow-lg">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase block">Computed Blast Radius</span>
                  <p className="text-sm font-bold">Risk Assessment: 34 (Low)</p>
                  <p className="text-[11px] text-muted-foreground italic">"Rate limiting improvements + security patches on api-gateway"</p>
                </div>
                <div className="flex items-center gap-3 justify-center mt-2">
                  <span className="text-xs text-muted-foreground">Connected Sources:</span>
                  <Badge variant="outline">GitHub</Badge>
                  <Badge variant="outline">PagerDuty</Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Real UI Components Preview Grid */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Derived Components, Styled for Developers</h2>
              <p className="text-sm text-muted-foreground">NexOps visual indicators represent data exactly as rendered within the platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Uptime signal card */}
              <Card className="p-6 bg-card border border-border space-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span className="font-bold text-sm">System Health</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Microservices Healthy</span>
                  <StatusBadge status="healthy" />
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-success w-[94%] rounded-full" />
                </div>
              </Card>

              {/* Triage action metric card */}
              <MetricCard 
                label="Causal Review Awaiting" 
                value="4 Candidates" 
                change="Human feedback pending"
                icon={<Zap className="w-6 h-6 text-warning" />}
              />

              {/* Integration connection state */}
              <Card className="p-6 bg-card border border-border space-y-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm flex items-center gap-2">
                    <Plug className="w-4 h-4" />
                    GitHub Connection
                  </span>
                  <Badge className="bg-success/10 text-success border-success/20 border" variant="outline">
                    Syncing
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Deriving ownership trees and deployment hashes automatically.</p>
              </Card>
            </div>
          </div>

          {/* CTA Footer Section */}
          <div className="border border-border/80 rounded-2xl p-12 bg-muted/10 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-warning" />
            <h2 className="text-3xl font-extrabold tracking-tight">
              Ready to answer the core question?
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Join Staff Engineers and SREs using NexOps to locate causal incidents in minutes.
            </p>
            <div className="pt-4">
              <Link href="/login">
                <Button size="lg" className="font-semibold gap-2 shadow-lg shadow-primary/10">
                  Launch Engine Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 text-center text-xs text-muted-foreground bg-muted/5">
        <p>© 2026 NexOps Correlation Platform. All mock telemetry active.</p>
      </footer>

    </div>
  )
}

function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5Z" />
      <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
    </svg>
  )
}

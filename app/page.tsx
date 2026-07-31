'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppState } from '@/lib/hooks/use-app-state'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ShieldCheck,
  Zap,
  Lock,
  Cpu,
  Database,
  Activity,
  AlertTriangle,
  GitCommitHorizontal,
  Layers,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  Terminal,
  Server,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Sandbox Scenarios Data
const SANDBOX_SCENARIOS = [
  {
    id: 'db-pool',
    title: 'Scenario 1: Database Pool Exhausted',
    service: 'payment-service',
    score: '86.2%',
    matchVariant: 'success' as const,
    causeTitle: 'Deploy #492: Active DB Pool max_connections updated (100 -> 20)',
    repo: 'checkout-v3',
    commit: 'a1b2c3d4',
    reasoning: [
      { label: 'Traffic spike on checkout-v3', delta: '+35.0', desc: 'Direct upstream dependency match' },
      { label: 'Active pool config change #492', delta: '+25.0', desc: 'Deploys deployed 8 mins prior' },
      { label: 'Upstream dependency latency', delta: '+11.2', desc: 'Downstream database latency correlate' },
    ],
  },
  {
    id: 'redis-evict',
    title: 'Scenario 2: Redis Memory Spike & Cache Eviction',
    service: 'auth-cluster',
    score: '91.5%',
    matchVariant: 'success' as const,
    causeTitle: 'Deploy #8192: Session TTL expiry config disabled in auth-sidecar',
    repo: 'auth-service',
    commit: 'f9e8d7c6',
    reasoning: [
      { label: 'Session key proliferation', delta: '+40.0', desc: 'Same repository and service owner' },
      { label: 'Deploy time within 4 mins of alert', delta: '+30.0', desc: 'High temporal proximity' },
      { label: 'Past confirmed cause match', delta: '+21.5', desc: 'Recalibrated historical feedback weight' },
    ],
  },
  {
    id: 'kafka-lag',
    title: 'Scenario 3: Kafka Consumer Lag & Queue Backpressure',
    service: 'order-processor',
    score: '78.4%',
    matchVariant: 'warning' as const,
    causeTitle: 'Deploy #3011: Synchronous RPC call added inside consumer loop',
    repo: 'order-pipeline',
    commit: 'b4v5c6x7',
    reasoning: [
      { label: 'Consumer partition rebalance', delta: '+32.0', desc: 'Upstream queue producer trigger' },
      { label: 'Deployed 15 mins prior', delta: '+22.0', desc: 'Temporal window correlation' },
      { label: 'CODEOWNERS owner match', delta: '+24.4', desc: 'Matched team ownership' },
    ],
  },
]

export default function LandingPage() {
  const router = useRouter()
  const { isAuthenticated } = useAppState()

  // Redirect authenticated users immediately to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  // Sandbox state
  const [activeScenarioId, setActiveScenarioId] = useState('db-pool')
  const [sandboxFeedback, setSandboxFeedback] = useState<'confirmed' | 'rejected' | null>(null)
  const [learningProgress, setLearningProgress] = useState(85.4)

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Scroll docking logic
  const [isScrolled, setIsScrolled] = useState(false)
  const introLogoRef = useRef<HTMLDivElement>(null)
  const logoTargetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const isMobile = window.innerWidth < 768
      const threshold = isMobile ? 40 : 80

      if (scrollY > threshold) {
        setIsScrolled(true)
        if (logoTargetRef.current && introLogoRef.current) {
          const rect = logoTargetRef.current.getBoundingClientRect()
          introLogoRef.current.style.top = `${rect.top}px`
          introLogoRef.current.style.left = `${rect.left}px`
          introLogoRef.current.style.transform = 'translate(0, 0)'
          introLogoRef.current.style.fontSize = '24px'
        }
      } else {
        setIsScrolled(false)
        if (introLogoRef.current) {
          introLogoRef.current.style.top = '50%'
          introLogoRef.current.style.left = '50%'
          introLogoRef.current.style.transform = 'translate(-50%, -50%)'
          const initialFontSize = isMobile ? '44px' : '68px'
          introLogoRef.current.style.fontSize = initialFontSize
        }
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  const currentScenario = SANDBOX_SCENARIOS.find((s) => s.id === activeScenarioId) || SANDBOX_SCENARIOS[0]

  const handleSandboxConfirm = () => {
    setSandboxFeedback('confirmed')
    setLearningProgress((prev) => Math.min(99.9, parseFloat((prev + 0.3).toFixed(1))))
  }

  const handleSandboxReject = () => {
    setSandboxFeedback('rejected')
  }

  return (
    <div className="bg-black text-white min-h-[160vh] md:min-h-[200vh] selection:bg-blue-600/30 selection:text-blue-400">
      {/* ALWAYS VISIBLE PURE BLACK TOP NAVIGATION BAR */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-4 max-w-container-max mx-auto left-0 right-0 bg-black/90 backdrop-blur-md border-b border-zinc-800/80">
        {/* Logo docking placeholder target */}
        <div
          ref={logoTargetRef}
          id="logo-target"
          className="font-extrabold text-2xl tracking-tight text-transparent select-none flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-blue-600/30">
            N
          </div>
          <span className="text-white">NexOps</span>
        </div>

        <div className="flex gap-6 md:gap-8 items-center">
          <a
            href="#engine"
            className="text-xs font-medium uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
          >
            Engine
          </a>
          <a
            href="#features"
            className="text-xs font-medium uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
          >
            Methodology
          </a>
          <a
            href="#sandbox"
            className="text-xs font-medium uppercase tracking-widest text-zinc-400 hover:text-white transition-colors hidden sm:inline-block"
          >
            Sandbox
          </a>
          <a
            href="#faq"
            className="text-xs font-medium uppercase tracking-widest text-zinc-400 hover:text-white transition-colors hidden md:inline-block"
          >
            FAQ
          </a>

          <Link href="/login" prefetch={false}>
            <Button size="sm" className="font-semibold gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25">
              Request Pilot Access <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* THE ANIMATING INTRO LOGO */}
      <div
        ref={introLogoRef}
        id="intro-logo"
        className="font-extrabold text-white tracking-tight transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] select-none drop-shadow-2xl flex items-center gap-3"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '68px',
        }}
      >
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-3xl shadow-xl shadow-blue-600/30">
          N
        </div>
        <span>NexOps</span>
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <div
        id="main-content"
        className={cn(
          'transition-all duration-700 ease-out',
          isScrolled ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'
        )}
      >
        <main className="max-w-container-max mx-auto px-6 md:px-12 pt-28">
          {/* HERO SECTION */}
          <section id="engine" className="pt-12 md:pt-16 pb-20 border-b border-zinc-800/80">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-7 space-y-8">
                <Badge variant="outline" className="bg-blue-950/60 text-blue-400 border-blue-800/60 px-3 py-1.5 gap-2 text-xs font-semibold">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  [ LIVE PILOT ] Autonomous Incident Correlation Engine
                </Badge>

                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
                  What caused this incident, and how do we know?
                </h1>

                <p className="text-base md:text-lg text-zinc-400 max-w-xl leading-relaxed">
                  NexOps ingests your deployments and incident alerts in real time, ranks candidate causes using dependency graph traversal, and explains its reasoning line-by-line — so your team isn't guessing at 2 a.m.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link href="/login" prefetch={false}>
                    <Button size="lg" className="font-bold gap-2 px-8 bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30">
                      Request Pilot Access <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>

                  <a href="#sandbox">
                    <Button size="lg" variant="outline" className="font-semibold gap-2 border-zinc-800 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800">
                      Explore Live Sandbox <Terminal className="w-4 h-4 text-zinc-400" />
                    </Button>
                  </a>
                </div>

                {/* Hero Guarantees */}
                <div className="pt-4 flex flex-wrap gap-6 text-xs text-zinc-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>0% Raw Source Code Access</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Sub-3s Correlation Speed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>100% Deterministic Scores</span>
                  </div>
                </div>
              </div>

              {/* HERO SCENARIO CARD */}
              <div className="lg:col-span-5 relative mt-4 lg:mt-0">
                <Card className="p-6 md:p-8 bg-[#09090b] border-zinc-800 shadow-2xl relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-rose-500" />
                      <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest font-semibold">
                        Active Incident
                      </span>
                    </div>
                    <Badge variant="outline" className="bg-emerald-950/60 text-emerald-400 border-emerald-800/60 font-mono text-xs font-bold">
                      86.2% Confident
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-mono text-lg text-white font-bold leading-snug">
                      Scenario: Database Pool Exhausted
                    </h3>

                    <div className="h-px bg-zinc-800/80 w-full my-4" />

                    <div className="space-y-3 font-mono text-xs md:text-sm">
                      <div className="flex justify-between items-center text-zinc-400">
                        <span>Traffic spike on checkout-v3</span>
                        <span className="text-emerald-400 font-semibold">+35.0</span>
                      </div>
                      <div className="flex justify-between items-center text-zinc-400">
                        <span>Active pool config change #492</span>
                        <span className="text-emerald-400 font-semibold">+25.0</span>
                      </div>
                      <div className="flex justify-between items-center text-zinc-400">
                        <span>Upstream dependency latency</span>
                        <span className="text-emerald-400 font-semibold">+11.2</span>
                      </div>
                    </div>

                    <div className="pt-6 grid grid-cols-2 gap-3">
                      <Link href="/incidents" prefetch={false}>
                        <Button variant="secondary" size="sm" className="w-full font-mono text-xs uppercase tracking-wider font-semibold bg-zinc-800 text-white hover:bg-zinc-700">
                          Analyze Cause
                        </Button>
                      </Link>
                      <Link href="/dashboard" prefetch={false}>
                        <Button variant="outline" size="sm" className="w-full font-mono text-xs uppercase tracking-wider font-semibold border-zinc-800 text-zinc-300 hover:bg-zinc-800">
                          Open Playbook
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
                {/* Visual Glow Backdrop */}
                <div className="absolute -top-4 -right-4 w-full h-full border border-zinc-800/40 rounded-xl -z-0 bg-blue-600/10 blur-xl" />
              </div>
            </div>
          </section>

          {/* INTEGRATIONS MARQUEE BANNER */}
          <section className="py-12 border-b border-zinc-800/80 bg-[#050505]">
            <div className="text-center space-y-4 max-w-4xl mx-auto">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-semibold">
                Seamless Telemetry Integration
              </span>
              <p className="text-sm text-zinc-300 font-medium">
                Connects with your existing DevOps and observability stack in under 5 minutes:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 pt-2 text-zinc-300 font-mono text-xs md:text-sm font-semibold">
                <span className="flex items-center gap-2 hover:text-white transition-colors"><GitCommitHorizontal className="w-4 h-4 text-blue-400" /> GitHub Actions</span>
                <span className="flex items-center gap-2 hover:text-white transition-colors"><AlertTriangle className="w-4 h-4 text-rose-500" /> PagerDuty</span>
                <span className="flex items-center gap-2 hover:text-white transition-colors"><Activity className="w-4 h-4 text-amber-400" /> Datadog</span>
                <span className="flex items-center gap-2 hover:text-white transition-colors"><Server className="w-4 h-4 text-emerald-400" /> Kubernetes</span>
                <span className="flex items-center gap-2 hover:text-white transition-colors"><Layers className="w-4 h-4 text-blue-400" /> Prometheus</span>
                <span className="flex items-center gap-2 hover:text-white transition-colors"><Zap className="w-4 h-4 text-sky-400" /> Vercel</span>
              </div>
            </div>
          </section>

          {/* PLATFORM METRICS TICKER */}
          <section className="py-16 border-b border-zinc-800/80">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-[#09090b] border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest font-semibold">
                  <Zap className="w-4 h-4" /> Sub-3s Analysis Latency
                </div>
                <div className="text-3xl font-extrabold text-white">&lt; 2.8s</div>
                <p className="text-xs text-zinc-400">Average time from alert webhook ingestion to candidate cause ranking.</p>
              </Card>

              <Card className="p-6 bg-[#09090b] border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest font-semibold">
                  <ShieldCheck className="w-4 h-4" /> Zero Code Inspection
                </div>
                <div className="text-3xl font-extrabold text-white">0% Code</div>
                <p className="text-xs text-zinc-400">Only deploy metadata and CODEOWNERS parsed — source files are never read.</p>
              </Card>

              <Card className="p-6 bg-[#09090b] border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-widest font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Deterministic Transparency
                </div>
                <div className="text-3xl font-extrabold text-white">100% Logic</div>
                <p className="text-xs text-zinc-400">Every confidence score displays an explicit, audited weight breakdown.</p>
              </Card>
            </div>
          </section>

          {/* PROBLEM & SOLUTION SECTION */}
          <section className="py-20 border-b border-zinc-800/80">
            <div className="max-w-4xl mb-14 space-y-3">
              <Badge variant="outline" className="bg-rose-950/60 text-rose-400 border-rose-800/60 text-xs font-semibold uppercase tracking-widest">
                The 2 A.M. Incident Dilemma
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Incident Response is Broken by Alert Noise and Tribal Knowledge
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Pain Point 1 */}
              <Card className="p-6 bg-[#09090b] border-zinc-800 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-rose-500 font-mono text-xs uppercase tracking-widest font-semibold">
                    <XCircle className="w-4 h-4" /> Traditional Triage
                  </div>
                  <h4 className="text-xl font-bold text-white">Alert Storms</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    On-call engineers are buried in hundreds of disconnected logs and traces during a microservice failure.
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-800/80 space-y-1">
                  <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-semibold block">
                    The NexOps Solution
                  </span>
                  <p className="text-white text-sm font-medium">
                    Automatic signal de-noising through temporal and topological correlation.
                  </p>
                </div>
              </Card>

              {/* Pain Point 2 */}
              <Card className="p-6 bg-[#09090b] border-zinc-800 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-rose-500 font-mono text-xs uppercase tracking-widest font-semibold">
                    <XCircle className="w-4 h-4" /> Traditional Triage
                  </div>
                  <h4 className="text-xl font-bold text-white">Black Box AI</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Legacy AIOps tools give "insights" without explaining the underlying logic, leading to team distrust.
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-800/80 space-y-1">
                  <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-semibold block">
                    The NexOps Solution
                  </span>
                  <p className="text-white text-sm font-medium">
                    Deterministic engine providing step-by-step reasoning for every correlation score.
                  </p>
                </div>
              </Card>

              {/* Pain Point 3 */}
              <Card className="p-6 bg-[#09090b] border-zinc-800 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-rose-500 font-mono text-xs uppercase tracking-widest font-semibold">
                    <XCircle className="w-4 h-4" /> Traditional Triage
                  </div>
                  <h4 className="text-xl font-bold text-white">Manual Postmortems</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Tracing the sequence of events manually takes hours of archaeology after the incident is resolved.
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-800/80 space-y-1">
                  <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-semibold block">
                    The NexOps Solution
                  </span>
                  <p className="text-white text-sm font-medium">
                    Real-time graph traversal generates the incident timeline automatically.
                  </p>
                </div>
              </Card>
            </div>
          </section>

          {/* HOW IT WORKS & RESPONSIVE PIPELINE SVG */}
          <section id="features" className="py-20 border-b border-zinc-800/80">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <Badge variant="outline" className="bg-blue-950/60 text-blue-400 border-blue-800/60 text-xs font-semibold uppercase tracking-widest">
                Architecture & Workflow
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                From Webhook Trigger to Root Cause in Under 3 Seconds
              </h2>
            </div>

            {/* RESPONSIVE PIPELINE SVG / FLEX PIPELINE */}
            <div className="mb-14 p-6 md:p-8 rounded-2xl bg-[#09090b] border border-zinc-800">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center text-center">
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="inline-flex p-2 rounded-lg bg-blue-950 text-blue-400">
                    <GitCommitHorizontal className="w-5 h-5" />
                  </div>
                  <div className="font-mono text-xs font-bold text-white uppercase">1. Webhook Trigger</div>
                  <p className="text-[11px] text-zinc-400">GitHub Deploys & PagerDuty Alerts</p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="inline-flex p-2 rounded-lg bg-amber-950 text-amber-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="font-mono text-xs font-bold text-white uppercase">2. Stream Ingestion</div>
                  <p className="text-[11px] text-zinc-400">CODEOWNERS & Deploy Metadata</p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="inline-flex p-2 rounded-lg bg-emerald-950 text-emerald-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="font-mono text-xs font-bold text-white uppercase">3. Graph Traversal</div>
                  <p className="text-[11px] text-zinc-400">Temporal & Topological Weights</p>
                </div>

                <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-800/60 space-y-2">
                  <div className="inline-flex p-2 rounded-lg bg-blue-600 text-white">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="font-mono text-xs font-bold text-blue-400 uppercase">4. Root Cause (86.2%)</div>
                  <p className="text-[11px] text-zinc-400">Ranked Candidate Cause & Reasoning</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="p-6 bg-[#09090b] border-zinc-800 space-y-3">
                <span className="font-mono text-blue-400 text-2xl font-bold">01</span>
                <h4 className="text-lg font-bold text-white">Zero-Config Ingestion</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Connect GitHub, PagerDuty, and APM data sources. NexOps builds your system's dependency graph automatically.
                </p>
              </Card>

              <Card className="p-6 bg-[#09090b] border-zinc-800 space-y-3">
                <span className="font-mono text-blue-400 text-2xl font-bold">02</span>
                <h4 className="text-lg font-bold text-white">Dynamic Graph Traversal</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  When an alert fires, our engine traverses up to 3 levels of upstream & downstream service dependencies.
                </p>
              </Card>

              <Card className="p-6 bg-[#09090b] border-zinc-800 space-y-3">
                <span className="font-mono text-blue-400 text-2xl font-bold">03</span>
                <h4 className="text-lg font-bold text-white">Explainable Recalibration</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Engineers confirm or reject suggestions to continuously tune correlation weights for their team's specific stack.
                </p>
              </Card>
            </div>
          </section>

          {/* MULTI-SCENARIO INTERACTIVE SANDBOX */}
          <section id="sandbox" className="py-20 border-b border-zinc-800/80">
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="space-y-2">
                <Badge variant="outline" className="bg-blue-950/60 text-blue-400 border-blue-800/60 text-xs font-semibold uppercase tracking-widest">
                  Interactive Sandbox
                </Badge>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  Test the Correlation Engine Logic
                </h2>
                <p className="text-sm text-zinc-400">
                  Select a simulated incident scenario below to preview how NexOps computes weights and natural language reasoning:
                </p>
              </div>

              {/* Scenario Tab Buttons */}
              <div className="flex flex-wrap gap-3">
                {SANDBOX_SCENARIOS.map((sc) => (
                  <Button
                    key={sc.id}
                    variant={activeScenarioId === sc.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setActiveScenarioId(sc.id)
                      setSandboxFeedback(null)
                    }}
                    className={cn(
                      'font-mono text-xs font-semibold gap-2',
                      activeScenarioId === sc.id
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                    )}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    {sc.title}
                  </Button>
                ))}
              </div>

              {/* Sandbox Card Widget */}
              <Card className="bg-[#09090b] border-zinc-800 overflow-hidden shadow-2xl">
                <div className="bg-zinc-900/80 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  </div>
                  <span className="font-mono text-xs text-zinc-400 tracking-widest font-semibold">
                    NEXOPS_CONSOLE_V4
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-8 p-6 md:p-8 border-r border-zinc-800 space-y-6">
                    <div className="p-6 rounded-xl bg-black border border-zinc-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="font-mono text-sm md:text-base font-bold text-white">
                          {currentScenario.causeTitle}
                        </h5>
                        <Badge
                          variant="outline"
                          className={cn(
                            'font-mono text-xs font-bold',
                            currentScenario.matchVariant === 'success'
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                              : 'bg-amber-950/60 text-amber-400 border-amber-800/60'
                          )}
                        >
                          Match: {currentScenario.score}
                        </Badge>
                      </div>

                      <div className="text-xs text-zinc-400 font-mono">
                        Target Service: <span className="text-white font-semibold">{currentScenario.service}</span> • Repository: <span className="text-white font-semibold">{currentScenario.repo}</span> ({currentScenario.commit})
                      </div>

                      <div className="space-y-2.5 pt-2">
                        {currentScenario.reasoning.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs font-mono">
                            <span className="text-zinc-400">{item.label}</span>
                            <span className="text-emerald-400 font-bold">{item.delta}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 p-6 md:p-8 flex flex-col justify-center text-center space-y-6">
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white">Is this cause correct?</h4>
                      <p className="text-xs text-zinc-400">
                        Your confirm/reject feedback recalibrates weights for your workspace.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handleSandboxConfirm}
                        className={cn(
                          'w-full font-mono text-xs font-bold uppercase tracking-wider',
                          sandboxFeedback === 'confirmed'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-emerald-950'
                        )}
                      >
                        {sandboxFeedback === 'confirmed' ? '✓ Feedback Saved' : 'Confirm Cause'}
                      </Button>

                      <Button
                        onClick={handleSandboxReject}
                        variant="outline"
                        className={cn(
                          'w-full font-mono text-xs font-semibold uppercase tracking-wider border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800',
                          sandboxFeedback === 'rejected' && 'bg-rose-950/60 text-rose-400 border-rose-800/60'
                        )}
                      >
                        {sandboxFeedback === 'rejected' ? '✕ Suggestion Rejected' : 'Reject Suggestion'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* FEATURE CARDS & CONTINUOUS LEARNING MOAT */}
          <section className="py-20 border-b border-zinc-800/80">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="p-6 bg-[#09090b] border-zinc-800 space-y-3">
                <Badge variant="outline" className="bg-blue-950/60 text-blue-400 border-blue-800/60 text-[10px] font-mono uppercase tracking-widest font-semibold">
                  Real-Time Topology
                </Badge>
                <h4 className="text-white font-bold text-base">Live Infrastructure Mapping</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Container and service relationships updated continuously in real-time.
                </p>
              </Card>

              <Card className="p-6 bg-[#09090b] border-zinc-800 space-y-3">
                <Badge variant="outline" className="bg-emerald-950/60 text-emerald-400 border-emerald-800/60 text-[10px] font-mono uppercase tracking-widest font-semibold">
                  Deterministic Engine
                </Badge>
                <h4 className="text-white font-bold text-base">Causal Inference Model</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Built on logic, not LLM guesswork. No hallucinations, only evidence.
                </p>
              </Card>

              <Card className="p-6 bg-[#09090b] border-zinc-800 space-y-3">
                <Badge variant="outline" className="bg-amber-950/60 text-amber-400 border-amber-800/60 text-[10px] font-mono uppercase tracking-widest font-semibold">
                  Automated Governance
                </Badge>
                <h4 className="text-white font-bold text-base">Post-Mortem Automation</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Generates event timeline and incident evidence reports automatically.
                </p>
              </Card>

              <Card className="p-6 bg-[#09090b] border-zinc-800 space-y-3">
                <Badge variant="outline" className="bg-zinc-900 text-zinc-400 border-zinc-800 text-[10px] font-mono uppercase tracking-widest font-semibold">
                  Enterprise Grade
                </Badge>
                <h4 className="text-white font-bold text-base">SOC2 & VPC Ready</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Row level security guarantees complete per-workspace tenant isolation.
                </p>
              </Card>
            </div>

            {/* Continuous Learning Moat Card */}
            <Card className="p-8 md:p-12 bg-[#09090b] border-zinc-800 flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="md:w-1/2 space-y-3">
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                  The Moat: Continuous Learning
                </h3>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                  Every confirm/reject action is remembered permanently per workspace. NexOps gets more accurate for your specific architecture the longer your team uses it. We don't just solve incidents; we map institutional knowledge.
                </p>
              </div>

              <div className="md:w-1/2 w-full flex justify-center">
                <div className="bg-black border border-zinc-800 p-6 md:p-8 w-full max-w-md rounded-xl space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest font-semibold">
                      Neural Scoring Weights
                    </span>
                    <span className="text-emerald-400 font-mono text-xs font-semibold animate-pulse">
                      Learning...
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="h-3 bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full transition-all duration-700 ease-out"
                        style={{ width: `${learningProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between font-mono text-xs text-white">
                      <span className="text-zinc-400">Team Specific Accuracy</span>
                      <span className="font-bold">{learningProgress.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* TECHNICAL FAQ ACCORDION */}
          <section id="faq" className="py-20 border-b border-zinc-800/80">
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="text-center space-y-2">
                <Badge variant="outline" className="bg-blue-950/60 text-blue-400 border-blue-800/60 text-xs font-semibold uppercase tracking-widest">
                  Got Questions?
                </Badge>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  Technical FAQ
                </h2>
              </div>

              <div className="space-y-4">
                <Card className="bg-[#09090b] border-zinc-800 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                    className="w-full p-6 text-left flex justify-between items-center font-bold text-base md:text-lg text-white"
                  >
                    <span>How does the correlation engine work without manual tagging?</span>
                    <ChevronDown className={cn('w-5 h-5 text-zinc-400 transition-transform', openFaq === 0 && 'rotate-180')} />
                  </button>
                  {openFaq === 0 && (
                    <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed border-t border-zinc-800/80 pt-4">
                      NexOps ingests Kubernetes manifests, commit hashes, and service mesh telemetry to infer relationships. We combine this topological data with temporal analysis to find common deltas across your stack without requiring manual code instrumentation.
                    </div>
                  )}
                </Card>

                <Card className="bg-[#09090b] border-zinc-800 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                    className="w-full p-6 text-left flex justify-between items-center font-bold text-base md:text-lg text-white"
                  >
                    <span>Does NexOps replace my existing monitoring tools?</span>
                    <ChevronDown className={cn('w-5 h-5 text-zinc-400 transition-transform', openFaq === 1 && 'rotate-180')} />
                  </button>
                  {openFaq === 1 && (
                    <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed border-t border-zinc-800/80 pt-4">
                      No. NexOps sits on top of Datadog, PagerDuty, and GitHub. We ingest alert events and deployment webhooks to provide the "Why" behind the signals your existing tools capture.
                    </div>
                  )}
                </Card>

                <Card className="bg-[#09090b] border-zinc-800 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                    className="w-full p-6 text-left flex justify-between items-center font-bold text-base md:text-lg text-white"
                  >
                    <span>What is the latency between an incident alert and NexOps analysis?</span>
                    <ChevronDown className={cn('w-5 h-5 text-zinc-400 transition-transform', openFaq === 2 && 'rotate-180')} />
                  </button>
                  {openFaq === 2 && (
                    <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed border-t border-zinc-800/80 pt-4">
                      Sub-second. Our processing pipeline is built on a real-time stream architecture. Candidate cause rankings are computed and surfaced within 3 seconds of the alert payload reaching our webhook endpoint.
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </section>

          {/* FINAL CTA & TRUST BADGES */}
          <section className="py-20 relative overflow-hidden">
            <Card className="p-10 md:p-16 text-center relative z-10 border-zinc-800 max-w-4xl mx-auto space-y-8 bg-[#09090b] shadow-2xl">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                  Enter the Limited Pilot Program
                </h2>

                <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                  We're onboarding a small number of engineering teams into an unpaid pilot. In exchange for early access, we ask for real usage and honest feedback to harden the engine.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/login" prefetch={false}>
                  <Button size="lg" className="font-bold gap-2 px-10 bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30">
                    Request Pilot Access <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>

                <a href="#engine">
                  <Button size="lg" variant="outline" className="font-semibold border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800">
                    View Architecture Specs
                  </Button>
                </a>
              </div>

              {/* Compliance & Security Micro-Badges */}
              <div className="pt-6 border-t border-zinc-800/80 flex flex-wrap justify-center gap-6 text-xs text-zinc-400 font-medium">
                <span>🔒 AES-256 Secret Encryption</span>
                <span>•</span>
                <span>🛡️ PostgreSQL RLS Tenant Isolation</span>
                <span>•</span>
                <span>⚡ Sub-3s Telemetry Stream</span>
              </div>
            </Card>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-blue-600/10 blur-[120px] rounded-full -z-0" />
          </section>
        </main>

        {/* FOOTER */}
        <footer className="max-w-container-max mx-auto px-6 md:px-12 py-12 border-t border-zinc-800/80 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-blue-600/30">
              N
            </div>
            <span className="font-bold text-lg text-white tracking-tight">NexOps</span>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
            <div className="flex gap-6">
              <Link href="/terms" prefetch={false} className="hover:text-white transition-colors font-medium">
                Terms of Service
              </Link>
              <Link href="/privacy" prefetch={false} className="hover:text-white transition-colors font-medium">
                Privacy Notice
              </Link>
              <Link href="/dashboard" prefetch={false} className="hover:text-white transition-colors font-medium">
                Dashboard
              </Link>
              <Link href="/integrations" prefetch={false} className="hover:text-white transition-colors font-medium">
                Integrations
              </Link>
            </div>
            <p>© 2026 NexOps Inc. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

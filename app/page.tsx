'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppState } from '@/lib/hooks/use-app-state'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MetricCard, StatusBadge } from '@/components/layout'
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
  BellOff,
  Check,
  X,
  RefreshCw,
  GitCommit
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Import GSAP and ScrollTrigger dynamically to avoid SSR issues
let gsap: any
let ScrollTrigger: any

export default function LandingPage() {
  const router = useRouter()
  const { isAuthenticated } = useAppState()
  
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [gsapLoaded, setGsapLoaded] = useState(false)

  // Container refs for GSAP scoping
  const heroContainerRef = useRef<HTMLDivElement>(null)
  const problemContainerRef = useRef<HTMLDivElement>(null)
  const solutionContainerRef = useRef<HTMLDivElement>(null)
  const howContainerRef = useRef<HTMLDivElement>(null)
  const ledgerContainerRef = useRef<HTMLDivElement>(null)

  // Redirect authenticated users immediately to the dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  // Detect reduced motion & viewports
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(mediaQuery.matches)
      
      const handleMotionChange = (e: MediaQueryListEvent) => {
        setReducedMotion(e.matches)
      }
      mediaQuery.addEventListener('change', handleMotionChange)

      const handleResize = () => {
        setIsMobile(window.innerWidth < 1024)
      }
      handleResize()
      window.addEventListener('resize', handleResize)

      return () => {
        mediaQuery.removeEventListener('change', handleMotionChange)
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  // Dynamically load GSAP on client side
  useEffect(() => {
    async function loadGSAP() {
      const gsapModule = await import('gsap')
      const scrollTriggerModule = await import('gsap/ScrollTrigger')
      
      gsap = gsapModule.gsap
      ScrollTrigger = scrollTriggerModule.ScrollTrigger
      
      gsap.registerPlugin(ScrollTrigger)
      setGsapLoaded(true)
    }
    loadGSAP()
  }, [])

  // Run animations once GSAP is loaded and active
  useEffect(() => {
    if (!gsapLoaded || !gsap || !ScrollTrigger) return

    // If reduced motion is preferred, we skip structural scrolls & pins
    if (reducedMotion) {
      // Just simple fade-in animations for a clean, accessible layout
      gsap.fromTo('.fade-in-on-load', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 })
      return
    }

    const ctx = gsap.context(() => {
      // ==========================================
      // SECTION 3.1: Hero - Scatter to Converge
      // ==========================================
      const scatterCards = gsap.utils.toArray('.hero-scatter-card')
      
      // Initially scatter cards in 3D-like space
      scatterCards.forEach((card: any, index: number) => {
        const angle = (index / scatterCards.length) * Math.PI * 2
        const radius = 250 + Math.random() * 100
        gsap.set(card, {
          x: Math.cos(angle) * radius * 1.5,
          y: Math.sin(angle) * radius,
          z: Math.random() * 100 - 50,
          rotation: (Math.random() - 0.5) * 60,
          opacity: 0.15,
          scale: 0.85
        })
      })

      // Timeline for Hero Pin & Scrub
      const heroTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: heroContainerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
          anticipatePin: 1
        }
      })

      // Converge scattered cards to center
      heroTimeline.to(scatterCards, {
        x: 0,
        y: 0,
        z: 0,
        rotation: 0,
        opacity: 0.9,
        scale: 1,
        stagger: 0.05,
        ease: 'power1.inOut'
      })

      // Merge into a centered blue glow resolved state
      heroTimeline.to('.hero-resolved-card', {
        boxShadow: '0 0 50px 15px rgba(100, 149, 237, 0.35)',
        borderColor: 'oklch(0.64 0.15 262)',
        scale: 1.05,
        duration: 0.3
      }, '-=0.1')

      // Headline and subtitle text fade and slide in
      heroTimeline.fromTo('.hero-text-block', {
        opacity: 0,
        y: 30
      }, {
        opacity: 1,
        y: 0,
        duration: 0.4
      }, '-=0.2')


      // ==========================================
      // SECTION 3.2: Problem - Tab Multiplication
      // ==========================================
      const problemTabs = gsap.utils.toArray('.problem-tab-item')
      
      gsap.fromTo(problemTabs, {
        scale: 0.9,
        opacity: 0,
        y: 30
      }, {
        scale: 1,
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: problemContainerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      })

      // Animated time counter
      const counterVal = { score: 0 }
      gsap.to(counterVal, {
        score: 20,
        duration: 1.6,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: problemContainerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        onUpdate: () => {
          const counterEl = document.getElementById('problem-lost-counter')
          if (counterEl) {
            counterEl.textContent = Math.floor(counterVal.score).toString()
          }
        }
      })


      // ==========================================
      // SECTION 3.3: Solution Reveal - Screenshot
      // ==========================================
      gsap.fromTo('.solution-screenshot-wrapper', {
        opacity: 0,
        y: 40,
        scale: 0.97
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: solutionContainerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      })


      // ==========================================
      // SECTION 3.4: How It Works - Split Scroll
      // ==========================================
      if (!isMobile) {
        // Pre-configure SVG paths for stroke drawing
        const paths = gsap.utils.toArray('.edge-path')
        paths.forEach((path: any) => {
          const len = path.getTotalLength()
          path.style.strokeDasharray = len
          path.style.strokeDashoffset = len
        })

        const howTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: howContainerRef.current,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: 1,
            anticipatePin: 1
          }
        })

        // Step 1: Backward Timeline Bar Filling
        howTimeline.to('.how-timeline-fill', {
          scaleX: 1,
          duration: 0.8,
          ease: 'none'
        })

        // Sequence of dots lighting up
        howTimeline.to('.how-dot-1', { backgroundColor: 'oklch(0.64 0.15 262)', scale: 1.3, duration: 0.1 }, 0.1)
        howTimeline.to('.how-dot-2', { backgroundColor: 'oklch(0.82 0.22 85)', scale: 1.3, duration: 0.1 }, 0.4)
        howTimeline.to('.how-dot-3', { backgroundColor: 'oklch(0.58 0.24 27)', scale: 1.3, duration: 0.1 }, 0.7)

        // Fade Left Step explanation text at the split
        howTimeline.to('.left-explanation-step-1', {
          opacity: 0,
          y: -15,
          duration: 0.3
        }, 0.8)

        howTimeline.fromTo('.left-explanation-step-2', {
          opacity: 0,
          y: 15
        }, {
          opacity: 1,
          y: 0,
          duration: 0.3
        }, 1.0)

        // Step 2: Forward Blast Radius Node Graph drawing
        howTimeline.to('.edge-path-1', { strokeDashoffset: 0, duration: 0.3, ease: 'none' }, 1.0)
        howTimeline.to('.node-g-2', { scale: 1.15, filter: 'drop-shadow(0 0 10px rgba(100, 149, 237, 0.6))', duration: 0.1 }, 1.25)
        
        howTimeline.to('.edge-path-2', { strokeDashoffset: 0, duration: 0.3, ease: 'none' }, 1.3)
        howTimeline.to('.node-g-3', { scale: 1.15, filter: 'drop-shadow(0 0 10px rgba(255, 165, 0, 0.6))', duration: 0.1 }, 1.55)

        howTimeline.to('.edge-path-3', { strokeDashoffset: 0, duration: 0.3, ease: 'none' }, 1.6)
        howTimeline.to('.node-g-4', { scale: 1.15, filter: 'drop-shadow(0 0 10px rgba(255, 165, 0, 0.5))', duration: 0.1 }, 1.85)
      } else {
        // Fallback for mobile or small viewport scroll: trigger sequential reveals
        gsap.fromTo('.how-mobile-card', {
          opacity: 0,
          y: 20
        }, {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          scrollTrigger: {
            trigger: howContainerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        })
      }


      // ==========================================
      // SECTION 3.5: Engineering Memory
      // ==========================================
      const ledgerRows = gsap.utils.toArray('.ledger-item-row')
      gsap.fromTo(ledgerRows, {
        opacity: 0,
        x: -30
      }, {
        opacity: 1,
        x: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: ledgerContainerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      })

      const ledgerIcons = gsap.utils.toArray('.ledger-icon-bounce')
      gsap.fromTo(ledgerIcons, {
        scale: 0
      }, {
        scale: 1,
        ease: 'back.out(2.2)',
        duration: 0.5,
        stagger: 0.08,
        scrollTrigger: {
          trigger: ledgerContainerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      })


      // ==========================================
      // SECTION 3.6 & 3.7: Trust & CTA
      // ==========================================
      gsap.fromTo('.trust-evidence-section', {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.trust-evidence-section',
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      })

      gsap.fromTo('.cta-final-section', {
        scale: 0.95,
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.cta-final-section',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      })

    }, [heroContainerRef, problemContainerRef, solutionContainerRef, howContainerRef, ledgerContainerRef, gsapLoaded, isMobile])

    return () => {
      ctx.revert()
    }
  }, [gsapLoaded, reducedMotion, isMobile])

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <Activity className="w-8 h-8 text-primary animate-pulse mb-3" />
        <p className="text-xs text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-x-hidden">
      
      {/* Header */}
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

      {/* SECTION 3.1: Hero Section (Scatter to Converge) */}
      <section 
        ref={heroContainerRef} 
        className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden px-6 lg:px-8 bg-[#090b0f] pt-16"
      >
        <div className="absolute top-[20%] left-[-10%] w-[45%] h-[45%] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[45%] h-[45%] rounded-full bg-accent/5 blur-[130px] pointer-events-none" />

        {/* Scattered Background Cards (Converging on Scroll) */}
        {!reducedMotion && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Card 1: PagerDuty Incident */}
            <div className="hero-scatter-card absolute w-[240px] p-4 rounded-xl border border-destructive/30 bg-[#161012]/80 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-[10px] text-destructive border-destructive/20 bg-destructive/5 font-mono">INCIDENT</Badge>
                <span className="text-[10px] text-muted-foreground">PagerDuty</span>
              </div>
              <div className="flex gap-2 items-start">
                <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <div className="text-[11px] font-bold text-slate-200">DB Conn Pool Exhaustion</div>
              </div>
            </div>

            {/* Card 2: GitHub Commit */}
            <div className="hero-scatter-card absolute w-[240px] p-4 rounded-xl border border-success/30 bg-[#0f1612]/80 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-[10px] text-success border-success/20 bg-success/5 font-mono">COMMIT</Badge>
                <span className="text-[10px] text-muted-foreground">GitHub</span>
              </div>
              <div className="flex gap-2 items-start">
                <GitCommit className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <div className="text-[11px] font-mono text-slate-200">9c7f8bb: config max_connections</div>
              </div>
            </div>

            {/* Card 3: Alert Rule */}
            <div className="hero-scatter-card absolute w-[240px] p-4 rounded-xl border border-warning/30 bg-[#161410]/80 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-[10px] text-warning border-warning/20 bg-warning/5 font-mono">RULE MATCH</Badge>
                <span className="text-[10px] text-muted-foreground">Anomaly Engine</span>
              </div>
              <div className="flex gap-2 items-start">
                <Zap className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                <div className="text-[11px] font-bold text-slate-200">Temporal correlation (15m window)</div>
              </div>
            </div>

            {/* Card 4: Slack Incident Thread */}
            <div className="hero-scatter-card absolute w-[240px] p-4 rounded-xl border border-blue-500/20 bg-[#101416]/80 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-[10px] text-sky-400 border-sky-400/20 bg-sky-400/5 font-mono">NOTIFICATION</Badge>
                <span className="text-[10px] text-muted-foreground">Slack</span>
              </div>
              <div className="flex gap-2 items-start">
                <BellOff className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-200">Alert piped to #ops-triage</div>
              </div>
            </div>

            {/* Card 5: Service Deploy */}
            <div className="hero-scatter-card absolute w-[240px] p-4 rounded-xl border border-primary/20 bg-primary/5 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-[10px] text-primary border-primary/20 bg-primary/5 font-mono">DEPLOYMENT</Badge>
                <span className="text-[10px] text-muted-foreground">Vercel</span>
              </div>
              <div className="flex gap-2 items-start">
                <RefreshCw className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-200">user-service v1.0.4 success</div>
              </div>
            </div>
          </div>
        )}

        {/* Resolved Target Card */}
        <div className="w-full max-w-[500px] z-10 text-center flex flex-col items-center">
          <div className="hero-resolved-card w-[340px] p-6 rounded-2xl border border-border bg-[#111318]/90 backdrop-blur-md shadow-2xl transition-all duration-300 mb-8">
            <div className="flex items-center gap-2 mb-3 justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
              <span className="text-xs uppercase tracking-widest font-bold text-primary">Correlation Engine Online</span>
            </div>
            <div className="border border-primary/20 bg-primary/5 p-4 rounded-xl text-center space-y-1">
              <span className="text-[10px] text-muted-foreground font-mono">PROBABLE ROOT CAUSE</span>
              <h3 className="font-bold text-sm text-foreground">User Service (v1.0.4)</h3>
              <p className="text-xs text-success font-semibold">91% Certainty Match</p>
            </div>
          </div>

          <div className={cn("space-y-4", !reducedMotion && "hero-text-block opacity-0")}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold">
              <SparkleIcon className="w-3.5 h-3.5" />
              NexOps Incident Correlation Engine
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-slate-100">
              What caused this incident,<br />and how do we know?
            </h1>
            <p className="text-sm lg:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
              NexOps compiles commits, deploys, and active alert records into a unified auto-derived dependency map, proving root causes with absolute reasons.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link href="/login">
                <Button size="lg" className="font-semibold gap-2 shadow-lg shadow-primary/15 bg-primary text-primary-foreground hover:bg-primary/90">
                  Launch Engine
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <span className="text-xs text-muted-foreground/60 italic block pt-3">Scroll down to trace the evidence</span>
          </div>
        </div>
      </section>

      {/* SECTION 3.2: Problem - Tab Multiplication */}
      <section 
        ref={problemContainerRef} 
        className="py-24 bg-[#0a0c10] border-t border-border/30 px-6 overflow-hidden"
      >
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="outline" className="border-destructive/20 text-destructive bg-destructive/5 font-mono text-xs uppercase px-3 py-1">The Problem</Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">
              Triaged in fragments across multiple screens
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Every alert triggers another page. When incident noise multiplies, engineers waste hours opening dashboards, hunting for changes.
            </p>
          </div>

          {/* Staggered "Noise Tabs" */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Card className="problem-tab-item p-4 bg-[#141011] border border-destructive/20 shadow-md flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
              <div className="text-xs">
                <div className="font-mono text-muted-foreground">PagerDuty</div>
                <div className="font-bold text-slate-300">5 active alert pages triggered</div>
              </div>
            </Card>
            <Card className="problem-tab-item p-4 bg-[#111318] border border-border/80 shadow-md flex items-center gap-3">
              <Github className="w-5 h-5 text-slate-300 flex-shrink-0" />
              <div className="text-xs">
                <div className="font-mono text-muted-foreground">GitHub commits</div>
                <div className="font-bold text-slate-300">47 changes on master branch</div>
              </div>
            </Card>
            <Card className="problem-tab-item p-4 bg-[#161410] border border-warning/20 shadow-md flex items-center gap-3">
              <Zap className="w-5 h-5 text-warning flex-shrink-0" />
              <div className="text-xs">
                <div className="font-mono text-muted-foreground">Deployment Status</div>
                <div className="font-bold text-slate-300">2 container cluster rollbacks</div>
              </div>
            </Card>
          </div>

          {/* Time lost counter strip */}
          <div className="text-center pt-4">
            <p className="text-lg text-slate-300">
              Average diagnostic time: <span id="problem-lost-counter" className="text-4xl font-extrabold text-destructive font-mono">0</span> minutes lost per outage
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3.3: Solution Reveal - Real Screenshot */}
      <section 
        ref={solutionContainerRef} 
        className="py-24 bg-[#08090d] border-t border-border/30 px-6 text-center"
      >
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-3">
            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 font-mono text-xs uppercase px-3 py-1">The Solution</Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">
              One view. Auto-correlated root causes.
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              NexOps unifies commits, deploys, and active alert records into a single dashboard. Real telemetry maps candidate causes dynamically.
            </p>
          </div>

          {/* Genuine application screenshot in glass container */}
          <div className="solution-screenshot-wrapper max-w-4xl mx-auto border border-primary/20 rounded-2xl shadow-[0_0_50px_rgba(100,149,237,0.1)] p-2 bg-[#12141c]/50 backdrop-blur-sm overflow-hidden">
            <img 
              src="/screenshot-incident.png" 
              alt="NexOps incident triage console showing ranked candidate causes" 
              className="rounded-xl w-full border border-border object-cover object-top shadow-2xl h-[420px]" 
            />
          </div>
        </div>
      </section>

      {/* SECTION 3.4: How It Works (Split-Scroll) */}
      <section 
        ref={howContainerRef} 
        className={cn("bg-[#090b0f] border-t border-border/30 relative", reducedMotion || isMobile ? "py-20 px-6" : "h-[300vh]")}
      >
        {reducedMotion || isMobile ? (
          // Simplified Mobile Stacked view
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-2">
              <Badge variant="outline" className="font-mono text-xs">How it works</Badge>
              <h2 className="text-3xl font-extrabold tracking-tight">The dual correlation pipeline</h2>
            </div>
            
            <div className="space-y-6">
              <Card className="how-mobile-card p-6 bg-card border border-border space-y-3">
                <span className="text-xs font-bold text-primary uppercase font-mono">1. Backward correlation</span>
                <h3 className="text-xl font-bold">Trace Root Causes</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  When a service alarm triggers, NexOps correlates the event backwards against git commit and deployment pipelines inside the temporal window, identifying the primary changes.
                </p>
              </Card>

              <Card className="how-mobile-card p-6 bg-card border border-border space-y-3">
                <span className="text-xs font-bold text-warning uppercase font-mono">2. Forward Blast Radius</span>
                <h3 className="text-xl font-bold">Map Downstream Impact</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Using your VCS architecture configs, we map dependencies forwards, identifying direct downstream nodes, databases, and services impacted by the causal deployment.
                </p>
              </Card>
            </div>
          </div>
        ) : (
          // Desktop Pinned Split Scroll
          <div className="sticky top-0 h-screen flex max-w-7xl mx-auto px-8 items-center overflow-hidden">
            {/* Left Column - Fixed position texts */}
            <div className="w-1/2 pr-12 relative h-[250px]">
              
              {/* Step 1 Content */}
              <div className="left-explanation-step-1 absolute inset-0 space-y-6 flex flex-col justify-center">
                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 font-mono text-xs uppercase px-2.5 py-1 w-fit">
                  1. Backward correlation
                </Badge>
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-100">
                  Trace PagerDuty incidents backward to deployments
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  NexOps automatically scans git commit hashes and Vercel/Render build histories within a 15-minute window of the PagerDuty alarm trigger, ranking suspect changes.
                </p>
              </div>

              {/* Step 2 Content */}
              <div className="left-explanation-step-2 absolute inset-0 space-y-6 flex flex-col justify-center opacity-0">
                <Badge variant="outline" className="border-warning/20 text-warning bg-warning/5 font-mono text-xs uppercase px-2.5 py-1 w-fit">
                  2. Forward Blast Radius
                </Badge>
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-100">
                  Map deployment blast radius downstream
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  By compiling your repository nexops.yaml settings, we outline a real-time topology flow, marking which databases and gateway nodes are impacted downstream.
                </p>
              </div>

            </div>

            {/* Right Column - Animations */}
            <div className="w-1/2 pl-12 border-l border-border/30 h-[400px] flex items-center justify-center relative bg-[#11131c]/40 rounded-2xl shadow-inner border p-6">
              
              {/* Timeline Container for Step 1 */}
              <div className="w-full absolute inset-0 flex flex-col justify-center px-12 space-y-8 how-timeline-graphics">
                
                {/* Horizontal progress bar track */}
                <div className="relative h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="how-timeline-fill absolute top-0 left-0 h-full w-full bg-primary origin-left scale-x-0" />
                </div>

                {/* Markers under the bar */}
                <div className="flex justify-between items-center relative text-xs">
                  {/* Dot 1: Git Deploy */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="how-dot-1 w-4 h-4 rounded-full bg-slate-700 border border-background shadow flex items-center justify-center transition-all duration-300" />
                    <span className="font-mono text-[10px] text-muted-foreground">Git Commit</span>
                  </div>

                  {/* Dot 2: Time window */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="how-dot-2 w-4 h-4 rounded-full bg-slate-700 border border-background shadow flex items-center justify-center transition-all duration-300" />
                    <span className="font-mono text-[10px] text-muted-foreground">Time Window</span>
                  </div>

                  {/* Dot 3: Alert Alarm */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="how-dot-3 w-4 h-4 rounded-full bg-slate-700 border border-background shadow flex items-center justify-center transition-all duration-300" />
                    <span className="font-mono text-[10px] text-muted-foreground">PagerDuty Incident</span>
                  </div>
                </div>

                {/* SVG Node Graph Container for Step 2 */}
                <div className="absolute inset-0 bg-[#0d0f14]/90 rounded-2xl border border-border p-6 flex flex-col items-center justify-center transition-all duration-500 how-svg-diagram">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block mb-4">Topology dependency flow</span>
                  
                  <svg className="w-full h-[220px]" viewBox="0 0 400 220">
                    {/* Definitions for arrow markers */}
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="oklch(0.28 0 0)" />
                      </marker>
                    </defs>

                    {/* Edge paths connecting nodes */}
                    <path className="edge-path edge-path-1" d="M 80 110 L 170 60" stroke="oklch(0.64 0.15 262)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                    <path className="edge-path edge-path-2" d="M 170 60 L 260 110" stroke="oklch(0.82 0.22 85)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                    <path className="edge-path edge-path-3" d="M 170 60 L 170 160" stroke="oklch(0.82 0.22 85)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                    {/* Node G1: Deploy source */}
                    <g className="node-g node-g-1 transition-all duration-300" transform="translate(80, 110)">
                      <circle r="20" fill="oklch(0.64 0.15 262)" opacity="0.9" />
                      <text dy="4" textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold">VCS</text>
                      <text y="32" textAnchor="middle" fill="oklch(0.92 0 0)" fontSize="9">user-service</text>
                    </g>

                    {/* Node G2: Gateway */}
                    <g className="node-g node-g-2 transition-all duration-300" transform="translate(170, 60)">
                      <circle r="18" fill="oklch(0.23 0.02 262)" stroke="oklch(0.32 0 0)" strokeWidth="1.5" />
                      <text dy="3" textAnchor="middle" fill="oklch(0.92 0 0)" fontSize="7" fontWeight="bold">API</text>
                      <text y="-25" textAnchor="middle" fill="oklch(0.92 0 0)" fontSize="9">api-gateway</text>
                    </g>

                    {/* Node G3: Database */}
                    <g className="node-g node-g-3 transition-all duration-300" transform="translate(260, 110)">
                      <circle r="18" fill="oklch(0.23 0.02 262)" stroke="oklch(0.32 0 0)" strokeWidth="1.5" />
                      <text dy="3" textAnchor="middle" fill="oklch(0.92 0 0)" fontSize="7" fontWeight="bold">DB</text>
                      <text y="30" textAnchor="middle" fill="oklch(0.92 0 0)" fontSize="9">postgres-db</text>
                    </g>

                    {/* Node G4: Downstream auth */}
                    <g className="node-g node-g-4 transition-all duration-300" transform="translate(170, 160)">
                      <circle r="18" fill="oklch(0.23 0.02 262)" stroke="oklch(0.32 0 0)" strokeWidth="1.5" />
                      <text dy="3" textAnchor="middle" fill="oklch(0.92 0 0)" fontSize="7" fontWeight="bold">AUTH</text>
                      <text y="30" textAnchor="middle" fill="oklch(0.92 0 0)" fontSize="9">auth-service</text>
                    </g>
                  </svg>
                </div>
              </div>

            </div>
          </div>
        )}
      </section>

      {/* SECTION 3.5: Engineering Memory (Ledger Accumulation) */}
      <section 
        ref={ledgerContainerRef} 
        className="py-24 bg-[#0a0c10] border-t border-border/30 px-6"
      >
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <Badge variant="outline" className="border-success/20 text-success bg-success/5 font-mono text-xs uppercase px-3 py-1">Continuous Learning</Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">
              Build a permanent ledger of causal context
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Every resolved incident commits human validation feedback directly to the model, improving downstream correlation matching.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {/* Ledger item 1 */}
            <div className="ledger-item-row p-4 rounded-xl border border-border/60 bg-[#12141a]/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="ledger-icon-bounce p-2 rounded-lg bg-success/10 text-success">
                  <Check className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-200">INC-041: API Gateway Latency Spike</div>
                  <div className="text-muted-foreground">Causal change matched to commit 7b8bb1e (rate limiter bounds)</div>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] text-success border-success/20 bg-success/5">VERIFIED</Badge>
            </div>

            {/* Ledger item 2 */}
            <div className="ledger-item-row p-4 rounded-xl border border-border/60 bg-[#12141a]/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="ledger-icon-bounce p-2 rounded-lg bg-destructive/10 text-destructive">
                  <X className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-200">INC-039: Auth Token Expiry Failures</div>
                  <div className="text-muted-foreground">Stripe webhooks configuration change rejected as root cause</div>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] text-destructive border-destructive/20 bg-destructive/5">DISMISSED</Badge>
            </div>

            {/* Ledger item 3 */}
            <div className="ledger-item-row p-4 rounded-xl border border-border/60 bg-[#12141a]/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="ledger-icon-bounce p-2 rounded-lg bg-success/10 text-success">
                  <Check className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-200">INC-034: Database Connection Pool Outage</div>
                  <div className="text-muted-foreground">Matched to deploy hash dc3546a (user-service max_connections limit)</div>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] text-success border-success/20 bg-success/5">VERIFIED</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3.6: Trust Strip */}
      <section className="trust-evidence-section py-16 bg-[#08090c] border-t border-border/30 px-6 text-center text-xs text-muted-foreground">
        <div className="max-w-2xl mx-auto space-y-2">
          <p className="font-bold text-slate-400">EVIDENCE-BASED CORRELATION</p>
          <p className="leading-relaxed">
            Detailed incident matching reasons and telemetry paths ship with every NexOps workspace tier. No simulated metrics, no black box algorithms.
          </p>
        </div>
      </section>

      {/* SECTION 3.7: CTA Section */}
      <section className="cta-final-section py-24 bg-[#0a0c10] border-t border-border/30 px-6 text-center">
        <div className="max-w-3xl mx-auto border border-primary/20 rounded-3xl p-12 bg-gradient-to-b from-[#12141e]/50 to-[#0e0f14]/50 backdrop-blur-md relative overflow-hidden space-y-6">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-accent to-warning" />
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-100">
            Ready to answer the core question?
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Connect PagerDuty and GitHub to locate incident causal sources in minutes.
          </p>
          <div className="pt-4">
            <Link href="/login">
              <Button size="lg" className="font-semibold gap-2 shadow-lg shadow-primary/10 bg-primary text-primary-foreground hover:bg-primary/90">
                Launch Engine Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 text-center text-xs text-muted-foreground bg-muted/5">
        <p>© 2026 NexOps Correlation Platform. All telemetry active.</p>
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

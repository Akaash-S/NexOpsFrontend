'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppState } from '@/lib/hooks/use-app-state'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { SpotlightNav } from '@/components/ui/vengeance/spotlight-nav'
import { PerspectiveGrid } from '@/components/ui/vengeance/perspective-grid'
import { AnimatedButton } from '@/components/ui/vengeance/animated-button'
import { GlassFrame } from '@/components/ui/vengeance/glass-frame'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import PricingComponent from '@/components/ui/pricing-card'
import { ShaderAnimation } from '@/components/ui/shader-animation'
import { 
  AlertTriangle, 
  Zap, 
  ArrowRight, 
  Github, 
  Activity, 
  Check, 
  X, 
  RefreshCw, 
  GitCommit, 
  BellOff 
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Dynamic imports for GSAP to prevent SSR issues
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

  // Redirect authenticated users immediately to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  // Detect reduced motion & viewport size
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

  // Dynamically load GSAP and ScrollTrigger
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

  // Execute GSAP scroll choreography once loaded
  useEffect(() => {
    if (!gsapLoaded || !gsap || !ScrollTrigger) return

    // Accessible fallback when prefers-reduced-motion is enabled
    if (reducedMotion) {
      gsap.fromTo('.fade-in-on-load', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 })
      return
    }

    const ctx = gsap.context(() => {
      // ==========================================
      // SECTION 2.1: HERO — Scatter to Converge
      // GSAP owns initial scatter state and scroll scrub properties
      // ==========================================
      const scatterCards = gsap.utils.toArray('.hero-scatter-card')

      scatterCards.forEach((card: any, index: number) => {
        const angle = (index / scatterCards.length) * Math.PI * 2
        const radius = 260 + Math.random() * 80
        gsap.set(card, {
          x: Math.cos(angle) * radius * 1.4,
          y: Math.sin(angle) * radius,
          z: Math.random() * 80 - 40,
          rotation: (Math.random() - 0.5) * 50,
          opacity: 0.2,
          scale: 0.85
        })
      })

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

      // Converge scatter cards to center
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

      // Merge visual into glowing resolved card
      heroTimeline.to('.hero-resolved-card', {
        boxShadow: '0 0 50px 15px rgba(100, 149, 237, 0.35)',
        borderColor: 'oklch(0.64 0.15 262)',
        scale: 1.04,
        duration: 0.3
      }, '-=0.1')

      // Resolve headline and subhead in sync
      heroTimeline.fromTo('.hero-text-block', {
        opacity: 0,
        y: 30
      }, {
        opacity: 1,
        y: 0,
        duration: 0.4
      }, '-=0.2')


      // ==========================================
      // SECTION 2.2: PROBLEM — Tab Multiplication (Batched Triggers)
      // ==========================================
      ScrollTrigger.batch('.problem-tab-item', {
        onEnter: (batch: any) => gsap.fromTo(batch, {
          scale: 0.9,
          opacity: 0,
          y: 25
        }, {
          scale: 1,
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: 'back.out(1.4)',
          overwrite: 'auto'
        }),
        onLeaveBack: (batch: any) => gsap.set(batch, { opacity: 0, scale: 0.9, y: 25, overwrite: 'auto' }),
        start: 'top 80%'
      })

      // Diagnostic lost counter animation
      const counterVal = { value: 0 }
      gsap.to(counterVal, {
        value: 20,
        duration: 1.5,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: problemContainerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        onUpdate: () => {
          const counterEl = document.getElementById('problem-lost-counter')
          if (counterEl) {
            counterEl.textContent = Math.floor(counterVal.value).toString()
          }
        }
      })


      // ==========================================
      // SECTION 2.3: SOLUTION REVEAL — Glass Framed Screenshot
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
      // SECTION 2.4: HOW IT WORKS — Pinned Split Scroll & Hand-Rolled SVG Stroke
      // ==========================================
      if (!isMobile) {
        // Pre-configure SVG paths for hand-rolled stroke-dashoffset drawing
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

        // Fade Left Step explanation text at the split point
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

        // Step 2: Forward Blast Radius SVG path stroke drawing
        howTimeline.to('.edge-path-1', { strokeDashoffset: 0, duration: 0.3, ease: 'none' }, 1.0)
        howTimeline.to('.node-g-2', { scale: 1.15, filter: 'drop-shadow(0 0 10px rgba(100, 149, 237, 0.6))', duration: 0.1 }, 1.25)

        howTimeline.to('.edge-path-2', { strokeDashoffset: 0, duration: 0.3, ease: 'none' }, 1.3)
        howTimeline.to('.node-g-3', { scale: 1.15, filter: 'drop-shadow(0 0 10px rgba(255, 165, 0, 0.6))', duration: 0.1 }, 1.55)

        howTimeline.to('.edge-path-3', { strokeDashoffset: 0, duration: 0.3, ease: 'none' }, 1.6)
        howTimeline.to('.node-g-4', { scale: 1.15, filter: 'drop-shadow(0 0 10px rgba(255, 165, 0, 0.5))', duration: 0.1 }, 1.85)
      } else {
        // Mobile fallback sequence
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
      // SECTION 2.5: ENGINEERING MEMORY — Batched List Stagger
      // ==========================================
      ScrollTrigger.batch('.ledger-item-row', {
        onEnter: (batch: any) => gsap.fromTo(batch, {
          opacity: 0,
          x: -30
        }, {
          opacity: 1,
          x: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power1.out',
          overwrite: 'auto'
        }),
        onLeaveBack: (batch: any) => gsap.set(batch, { opacity: 0, x: -30, overwrite: 'auto' }),
        start: 'top 80%'
      })

      ScrollTrigger.batch('.ledger-icon-bounce', {
        onEnter: (batch: any) => gsap.fromTo(batch, {
          scale: 0
        }, {
          scale: 1,
          ease: 'back.out(2.2)',
          duration: 0.5,
          stagger: 0.08,
          overwrite: 'auto'
        }),
        onLeaveBack: (batch: any) => gsap.set(batch, { scale: 0, overwrite: 'auto' }),
        start: 'top 80%'
      })


      // ==========================================
      // SECTION 2.6 & 2.7: TRUST & CTA
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
      
      {/* Vengeance UI Spotlight Navbar */}
      <SpotlightNav />

      {/* SECTION 2.1: Hero Section (Scatter to Converge + Three.js Shader Animation + Vengeance PerspectiveGrid) */}
      <PerspectiveGrid 
        ref={heroContainerRef}
        className="min-h-screen flex flex-col justify-center items-center overflow-hidden px-6 lg:px-8 border-none pt-16 relative"
      >
        {/* Three.js Ambient Shader Animation Background */}
        <ShaderAnimation />

        {/* Scattered Signal Cards (Converging on Scroll) */}
        {!reducedMotion && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Card 1: Incident */}
            <div className="hero-scatter-card absolute w-[240px] p-4 rounded-xl border border-destructive/30 bg-[#161012]/90 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-[10px] text-destructive border-destructive/20 bg-destructive/5 font-mono">INCIDENT</Badge>
                <span className="text-[10px] text-muted-foreground font-semibold">NexOps</span>
              </div>
              <div className="flex gap-2 items-start">
                <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <div className="text-[11px] font-bold text-slate-200">DB Conn Pool Exhaustion</div>
              </div>
            </div>

            {/* Card 2: Commit */}
            <div className="hero-scatter-card absolute w-[240px] p-4 rounded-xl border border-success/30 bg-[#0f1612]/90 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-[10px] text-success border-success/20 bg-success/5 font-mono">COMMIT</Badge>
                <span className="text-[10px] text-muted-foreground font-semibold">NexOps</span>
              </div>
              <div className="flex gap-2 items-start">
                <GitCommit className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <div className="text-[11px] font-mono text-slate-200">9c7f8bb: config max_connections</div>
              </div>
            </div>

            {/* Card 3: Alert Rule */}
            <div className="hero-scatter-card absolute w-[240px] p-4 rounded-xl border border-warning/30 bg-[#161410]/90 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-[10px] text-warning border-warning/20 bg-warning/5 font-mono">RULE MATCH</Badge>
                <span className="text-[10px] text-muted-foreground font-semibold">NexOps</span>
              </div>
              <div className="flex gap-2 items-start">
                <Zap className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                <div className="text-[11px] font-bold text-slate-200">Temporal correlation (15m window)</div>
              </div>
            </div>

            {/* Card 4: Notification Thread */}
            <div className="hero-scatter-card absolute w-[240px] p-4 rounded-xl border border-primary/20 bg-[#101416]/90 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-[10px] text-primary border-primary/20 bg-primary/5 font-mono">NOTIFICATION</Badge>
                <span className="text-[10px] text-muted-foreground font-semibold">NexOps</span>
              </div>
              <div className="flex gap-2 items-start">
                <BellOff className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-200">Alert piped to #ops-triage</div>
              </div>
            </div>

            {/* Card 5: Service Deploy */}
            <div className="hero-scatter-card absolute w-[240px] p-4 rounded-xl border border-primary/30 bg-primary/10 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-[10px] text-primary border-primary/20 bg-primary/5 font-mono">DEPLOYMENT</Badge>
                <span className="text-[10px] text-muted-foreground font-semibold">NexOps</span>
              </div>
              <div className="flex gap-2 items-start">
                <RefreshCw className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-200">user-service v1.0.4 success</div>
              </div>
            </div>
          </div>
        )}

        {/* Center Resolved Target Card */}
        <div className="w-full max-w-[500px] z-10 text-center flex flex-col items-center">
          <div className="hero-resolved-card w-[340px] p-6 rounded-2xl border border-border bg-[#111318]/95 backdrop-blur-xl shadow-2xl transition-all duration-300 mb-8">
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
              NexOps Incident Correlation Engine
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
              What caused this incident,<br />and how do we know?
            </h1>
            <p className="text-sm lg:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
              NexOps compiles commits, deploys, and active alert records into a unified auto-derived dependency map, proving root causes with absolute reasons.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link href="/login">
                <AnimatedButton variant="primary" size="lg">
                  Launch Engine
                  <ArrowRight className="w-4 h-4" />
                </AnimatedButton>
              </Link>
            </div>
            <span className="text-xs text-muted-foreground/60 italic block pt-3">Scroll down to trace the evidence</span>
          </div>
        </div>
      </PerspectiveGrid>

      {/* SECTION 2.2: PROBLEM — Tab Multiplication */}
      <section 
        ref={problemContainerRef} 
        className="py-24 bg-[#0a0c10] border-t border-border/30 px-6 overflow-hidden"
      >
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="outline" className="border-destructive/20 text-destructive bg-destructive/5 font-mono text-xs uppercase px-3 py-1">The Problem</Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Triaged in fragments across multiple screens
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Every alert triggers another page. When incident noise multiplies, engineers waste hours opening dashboards, hunting for changes.
            </p>
          </div>

          {/* Staggered Noise Tab Items */}
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

          {/* Diagnostic Lost Time Counter */}
          <div className="text-center pt-4">
            <p className="text-lg text-slate-300">
              Average diagnostic time: <span id="problem-lost-counter" className="text-4xl font-extrabold text-destructive font-mono">0</span> minutes lost per outage
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2.3: SOLUTION REVEAL — Container Scroll 3D Showcase */}
      <section 
        ref={solutionContainerRef} 
        className="py-12 bg-[#08090d] border-t border-border/30 px-6 text-center overflow-hidden"
      >
        <div className="solution-screenshot-wrapper max-w-6xl mx-auto">
          <ContainerScroll
            titleComponent={
              <div className="space-y-3 mb-8">
                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 font-mono text-xs uppercase px-3 py-1">The Solution</Badge>
                <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                  One view. Auto-correlated root causes.
                </h2>
                <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                  NexOps unifies commits, deploys, and active alert records into a single dashboard. Real telemetry maps candidate causes dynamically.
                </p>
              </div>
            }
          >
            <GlassFrame className="h-full border-none p-0 bg-transparent shadow-none">
              <img 
                src="/screenshot-incident.png" 
                alt="NexOps incident triage console showing ranked candidate causes" 
                className="rounded-xl w-full h-full object-cover object-top shadow-2xl" 
              />
            </GlassFrame>
          </ContainerScroll>
        </div>
      </section>

      {/* SECTION 2.4: HOW IT WORKS — Split Scroll */}
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
                <h2 className="text-4xl font-extrabold tracking-tight text-foreground">
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
                <h2 className="text-4xl font-extrabold tracking-tight text-foreground">
                  Map deployment blast radius downstream
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  By compiling your repository nexops.yaml settings, we outline a real-time topology flow, marking which databases and gateway nodes are impacted downstream.
                </p>
              </div>

            </div>

            {/* Right Column - Animations inside Vengeance Perspective Container */}
            <div className="w-1/2 pl-12 border-l border-border/30 h-[400px] flex items-center justify-center relative rounded-2xl overflow-hidden">
              <PerspectiveGrid className="w-full h-full rounded-2xl p-6 flex items-center justify-center">
                
                {/* Timeline Container for Step 1 */}
                <div className="w-full absolute inset-0 flex flex-col justify-center px-12 space-y-8 how-timeline-graphics">
                  <div className="relative h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="how-timeline-fill absolute top-0 left-0 h-full w-full bg-primary origin-left scale-x-0" />
                  </div>

                  {/* Timeline markers */}
                  <div className="flex justify-between items-center relative text-xs">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="how-dot-1 w-4 h-4 rounded-full bg-slate-700 border border-background shadow flex items-center justify-center transition-all duration-300" />
                      <span className="font-mono text-[10px] text-muted-foreground">Git Commit</span>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                      <div className="how-dot-2 w-4 h-4 rounded-full bg-slate-700 border border-background shadow flex items-center justify-center transition-all duration-300" />
                      <span className="font-mono text-[10px] text-muted-foreground">Time Window</span>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                      <div className="how-dot-3 w-4 h-4 rounded-full bg-slate-700 border border-background shadow flex items-center justify-center transition-all duration-300" />
                      <span className="font-mono text-[10px] text-muted-foreground">PagerDuty Incident</span>
                    </div>
                  </div>
                </div>

                {/* Hand-Rolled SVG Node Graph Diagram for Step 2 */}
                <div className="absolute inset-0 bg-[#0d0f14]/95 rounded-2xl border border-border/60 p-6 flex flex-col items-center justify-center transition-all duration-500 how-svg-diagram">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block mb-4">Topology dependency flow</span>
                  
                  <svg className="w-full h-[220px]" viewBox="0 0 400 220">
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="oklch(0.28 0 0)" />
                      </marker>
                    </defs>

                    <path className="edge-path edge-path-1" d="M 80 110 L 170 60" stroke="oklch(0.64 0.15 262)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                    <path className="edge-path edge-path-2" d="M 170 60 L 260 110" stroke="oklch(0.82 0.22 85)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                    <path className="edge-path edge-path-3" d="M 170 60 L 170 160" stroke="oklch(0.82 0.22 85)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                    <g className="node-g node-g-1 transition-all duration-300" transform="translate(80, 110)">
                      <circle r="20" fill="oklch(0.64 0.15 262)" opacity="0.9" />
                      <text dy="4" textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold">VCS</text>
                      <text y="32" textAnchor="middle" fill="oklch(0.92 0 0)" fontSize="9">user-service</text>
                    </g>

                    <g className="node-g node-g-2 transition-all duration-300" transform="translate(170, 60)">
                      <circle r="18" fill="oklch(0.23 0.02 262)" stroke="oklch(0.32 0 0)" strokeWidth="1.5" />
                      <text dy="3" textAnchor="middle" fill="oklch(0.92 0 0)" fontSize="7" fontWeight="bold">API</text>
                      <text y="-25" textAnchor="middle" fill="oklch(0.92 0 0)" fontSize="9">api-gateway</text>
                    </g>

                    <g className="node-g node-g-3 transition-all duration-300" transform="translate(260, 110)">
                      <circle r="18" fill="oklch(0.23 0.02 262)" stroke="oklch(0.32 0 0)" strokeWidth="1.5" />
                      <text dy="3" textAnchor="middle" fill="oklch(0.92 0 0)" fontSize="7" fontWeight="bold">DB</text>
                      <text y="30" textAnchor="middle" fill="oklch(0.92 0 0)" fontSize="9">postgres-db</text>
                    </g>

                    <g className="node-g node-g-4 transition-all duration-300" transform="translate(170, 160)">
                      <circle r="18" fill="oklch(0.23 0.02 262)" stroke="oklch(0.32 0 0)" strokeWidth="1.5" />
                      <text dy="3" textAnchor="middle" fill="oklch(0.92 0 0)" fontSize="7" fontWeight="bold">AUTH</text>
                      <text y="30" textAnchor="middle" fill="oklch(0.92 0 0)" fontSize="9">auth-service</text>
                    </g>
                  </svg>
                </div>
              </PerspectiveGrid>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 2.5: ENGINEERING MEMORY — Batched Stagger Rows */}
      <section 
        ref={ledgerContainerRef} 
        className="py-24 bg-[#0a0c10] border-t border-border/30 px-6"
      >
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <Badge variant="outline" className="border-success/20 text-success bg-success/5 font-mono text-xs uppercase px-3 py-1">Continuous Learning</Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Build a permanent ledger of causal context
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Every resolved incident commits human validation feedback directly to the model, improving downstream correlation matching.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
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

      {/* SECTION 2.6: TRUST STRIP */}
      <section className="trust-evidence-section py-16 bg-[#08090c] border-t border-border/30 px-6 text-center text-xs text-muted-foreground">
        <div className="max-w-2xl mx-auto space-y-2">
          <p className="font-bold text-slate-400">EVIDENCE-BASED CORRELATION</p>
          <p className="leading-relaxed">
            Detailed incident matching reasons and telemetry paths ship with every NexOps workspace tier. No simulated metrics, no black box algorithms.
          </p>
        </div>
      </section>

      {/* SECTION: PRICING & TIERS */}
      <section className="bg-[#090b0f] border-t border-border/30 py-12">
        <PricingComponent />
      </section>

      {/* SECTION 2.7: CTA SECTION with Vengeance UI AnimatedButton */}
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
              <AnimatedButton variant="primary" size="lg">
                Launch Engine Now
                <ArrowRight className="w-4 h-4" />
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Site Footer */}
      <footer className="border-t border-border/40 py-8 text-center text-xs text-muted-foreground bg-muted/5">
        <p>© 2026 NexOps Correlation Platform. All telemetry active.</p>
      </footer>

    </div>
  )
}

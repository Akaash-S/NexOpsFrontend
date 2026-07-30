'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppState } from '@/lib/hooks/use-app-state'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, ArrowRight, ShieldCheck, Cpu, Database, Activity } from 'lucide-react'
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
  const heroSectionRef = useRef<HTMLElement>(null)
  const problemSectionRef = useRef<HTMLElement>(null)
  const howSectionRef = useRef<HTMLElement>(null)
  const moatSectionRef = useRef<HTMLElement>(null)
  const scopeSectionRef = useRef<HTMLElement>(null)
  const pilotSectionRef = useRef<HTMLElement>(null)
  const ctaSectionRef = useRef<HTMLElement>(null)

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
        setIsMobile(window.innerWidth < 768)
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

  // GSAP Timeline & ScrollTrigger setup
  useEffect(() => {
    if (!gsapLoaded || !gsap || !ScrollTrigger) return

    const ctx = gsap.context(() => {
      // ----------------------------------------------------
      // 1. ALERT DOT INFINITE PULSE LOOP (Runs independently)
      // ----------------------------------------------------
      if (!reducedMotion) {
        gsap.to('.alert-dot-pulse', {
          scale: 1.15,
          opacity: 0.6,
          duration: 1.6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        })
      }

      // ----------------------------------------------------
      // 2. HERO PINNED SCROLLTRIGGER TIMELINE (Desktop / Non-Reduced Motion)
      // ----------------------------------------------------
      if (!reducedMotion && !isMobile && heroSectionRef.current) {
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top top',
            end: () => '+=' + (window.innerHeight * 2.5),
            pin: true,
            scrub: true,
            anticipatePin: 1
          }
        })

        // Initial setup for scrub elements
        gsap.set('.trace-line-path', { strokeDasharray: 1000, strokeDashoffset: 1000 })
        gsap.set(['.trace-node-0', '.trace-node-1', '.trace-node-2'], { scale: 0, transformOrigin: 'center center' })
        gsap.set('.trace-label-0', { x: 20, opacity: 0 })
        gsap.set('.trace-label-1', { x: 20, opacity: 0 })
        gsap.set('.trace-label-2', { x: 20, opacity: 0 })
        gsap.set('.node-1-checkmark', { opacity: 0, scale: 0 })
        gsap.set('.hero-headline-block', { y: 12, opacity: 0 })
        gsap.set('.hero-subhead-block', { y: 12, opacity: 0 })
        gsap.set('.hero-cta-block', { y: 12, opacity: 0 })

        // Timeline Progress sequence: 0.00 -> 1.00
        // Progress 0.00 - 0.08: Line draws to 65% (dashoffset 1000 -> 350)
        heroTl.to('.trace-line-path', {
          strokeDashoffset: 350,
          duration: 0.08,
          ease: 'none'
        }, 0)

        // Progress 0.08 - 0.12: Node 0 & Label 0 reveal
        heroTl.to('.trace-node-0', {
          scale: 1,
          duration: 0.04,
          ease: 'back.out(1.4)'
        }, 0.08)
        heroTl.to('.trace-label-0', {
          x: 0,
          opacity: 1,
          duration: 0.04,
          ease: 'none'
        }, 0.08)

        // Progress 0.12 - 0.35: Line draws to 40% (dashoffset 350 -> 180)
        heroTl.to('.trace-line-path', {
          strokeDashoffset: 180,
          duration: 0.23,
          ease: 'none'
        }, 0.12)

        // Progress 0.35 - 0.39: Node 1 & Label 1 reveal
        heroTl.to('.trace-node-1', {
          scale: 1,
          duration: 0.04,
          ease: 'back.out(1.4)'
        }, 0.35)
        heroTl.to('.trace-label-1', {
          x: 0,
          opacity: 1,
          duration: 0.04,
          ease: 'none'
        }, 0.35)

        // Progress 0.39 - 0.55: Line draws to 15% (dashoffset 180 -> 60)
        heroTl.to('.trace-line-path', {
          strokeDashoffset: 60,
          duration: 0.16,
          ease: 'none'
        }, 0.39)

        // Progress 0.55 - 0.59: Node 2 & Label 2 reveal
        heroTl.to('.trace-node-2', {
          scale: 1,
          duration: 0.04,
          ease: 'back.out(1.4)'
        }, 0.55)
        heroTl.to('.trace-label-2', {
          x: 0,
          opacity: 1,
          duration: 0.04,
          ease: 'none'
        }, 0.55)

        // Progress 0.59 - 0.75: Line completes drawing (dashoffset 60 -> 0)
        heroTl.to('.trace-line-path', {
          strokeDashoffset: 0,
          duration: 0.16,
          ease: 'none'
        }, 0.59)

        // Progress 0.75 - 0.85: RESOLUTION BEAT
        // Node 0 & 2 fade to 0.25 opacity. Node 1 scales up 1.2x. Amber -> Green transition. Checkmark reveals.
        heroTl.to(['.trace-node-0', '.trace-node-2', '.trace-label-0', '.trace-label-2'], {
          opacity: 0.25,
          duration: 0.1,
          ease: 'none'
        }, 0.75)

        heroTl.to('.trace-node-1', {
          scale: 1.3,
          duration: 0.1,
          ease: 'back.out(1.5)'
        }, 0.75)

        heroTl.to('.node-1-checkmark', {
          opacity: 1,
          scale: 1,
          duration: 0.1,
          ease: 'none'
        }, 0.75)

        heroTl.to('.trace-line-path', {
          stroke: 'oklch(0.62 0.16 142)',
          duration: 0.1,
          ease: 'none'
        }, 0.75)

        heroTl.to('.alert-dot-element', {
          fill: 'oklch(0.62 0.16 142)',
          duration: 0.1,
          ease: 'none'
        }, 0.75)

        heroTl.to('.trace-node-1-circle', {
          fill: 'oklch(0.62 0.16 142)',
          stroke: 'oklch(0.92 0 0)',
          duration: 0.1,
          ease: 'none'
        }, 0.75)

        // Progress 0.85 - 1.00: Eyebrow fades out; Headline, Subhead & CTA slide in
        heroTl.to('.hero-eyebrow-block', {
          opacity: 0,
          duration: 0.05,
          ease: 'none'
        }, 0.85)

        heroTl.to('.hero-headline-block', {
          y: 0,
          opacity: 1,
          duration: 0.06,
          ease: 'none'
        }, 0.85)

        heroTl.to('.hero-subhead-block', {
          y: 0,
          opacity: 1,
          duration: 0.06,
          ease: 'none'
        }, 0.90)

        heroTl.to('.hero-cta-block', {
          y: 0,
          opacity: 1,
          duration: 0.05,
          ease: 'none'
        }, 0.95)
      } else if (isMobile && !reducedMotion) {
        // ----------------------------------------------------
        // MOBILE PROGRESSIVE REVEAL (ScrollTrigger.batch)
        // ----------------------------------------------------
        ScrollTrigger.batch('.mobile-reveal', {
          onEnter: (batch: any) => gsap.fromTo(batch, {
            opacity: 0,
            y: 20
          }, {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.6,
            ease: 'power2.out',
            overwrite: 'auto'
          }),
          onLeaveBack: (batch: any) => gsap.set(batch, { opacity: 0, y: 20, overwrite: 'auto' }),
          start: 'top 85%'
        })
      }

      // ----------------------------------------------------
      // 3. REST-OF-PAGE ANIMATIONS (Sections 2 - 6 + CTA)
      // ----------------------------------------------------
      if (!reducedMotion) {
        const sections = [
          problemSectionRef.current,
          howSectionRef.current,
          moatSectionRef.current,
          scopeSectionRef.current,
          pilotSectionRef.current,
          ctaSectionRef.current
        ].filter(Boolean)

        sections.forEach((sec) => {
          gsap.fromTo(sec, {
            opacity: 0,
            y: 8
          }, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          })
        })

        // Staggered reveal for Section 3 panels
        ScrollTrigger.batch('.how-panel-card', {
          onEnter: (batch: any) => gsap.fromTo(batch, {
            opacity: 0,
            y: 12
          }, {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
          }),
          onLeaveBack: (batch: any) => gsap.set(batch, { opacity: 0, y: 12, overwrite: 'auto' }),
          start: 'top 85%'
        })
      }
    })

    return () => {
      ctx.revert()
    }
  }, [gsapLoaded, reducedMotion, isMobile])

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-[oklch(0.12_0_0)] flex flex-col justify-center items-center">
        <Activity className="w-8 h-8 text-[oklch(0.64_0.15_262)] animate-pulse mb-3" />
        <p className="text-xs text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[oklch(0.12_0_0)] text-[oklch(0.92_0_0)] selection:bg-[oklch(0.64_0.15_262)]/30 font-sans antialiased overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* PERSISTENT UTILITY NAV HEADER                                              */}
      {/* ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[oklch(0.12_0_0)]/90 backdrop-blur-md border-b border-border/40 px-6 py-4 flex items-center justify-between">
        {/* Left: Wordmark */}
        <Link href="/" className="font-extrabold text-lg tracking-tighter text-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[oklch(0.64_0.15_262)]" />
          NexOps
        </Link>

        {/* Center Links */}
        <nav className="hidden sm:flex items-center gap-6 text-xs font-medium text-muted-foreground">
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#pilot" className="hover:text-foreground transition-colors">Pilot</a>
        </nav>

        {/* Right CTA */}
        <div>
          <Link href="/login">
            <Button size="sm" className="bg-[oklch(0.64_0.15_262)] text-white hover:bg-[oklch(0.64_0.15_262)]/90 font-medium text-xs rounded-lg px-4">
              Join the pilot
            </Button>
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SECTION 1: HERO (GSAP ScrollTrigger Pinned Sequence)                     */}
      {/* ========================================================================= */}
      <section 
        id="hero"
        ref={heroSectionRef}
        style={{ backgroundImage: "url('/images/hero-poster.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        className={cn(
          "relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6 overflow-hidden bg-[oklch(0.12_0_0)]",
          (reducedMotion || isMobile) && "py-28"
        )}
      >
        {/* Background Grain & Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.15_0.02_262)]/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Hero Visual Container */}
        <div className="max-w-4xl w-full mx-auto relative flex flex-col items-center justify-center text-center">
          
          {/* Eyebrow Label */}
          <div className={cn(
            "hero-eyebrow-block mb-6 font-mono text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-2",
            reducedMotion && "hidden"
          )}>
            <span className="w-2 h-2 rounded-full bg-[oklch(0.82_0.22_85)] alert-dot-pulse" />
            INCIDENT CORRELATION ENGINE
          </div>

          {/* SVG & DOM Trace Line Visualization */}
          <div className="relative w-full max-w-xl my-4 py-4 flex flex-col items-center">
            
            {/* SVG Trace Line */}
            <svg className="w-full h-[280px] overflow-visible" viewBox="0 0 400 280">
              {/* Vertical Path */}
              <path 
                className="trace-line-path"
                d="M 200 20 L 200 260"
                stroke={reducedMotion ? "oklch(0.62 0.16 142)" : "oklch(0.82 0.22 85)"}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                style={reducedMotion ? { strokeDasharray: 'none' } : {}}
              />

              {/* Alert Dot */}
              <circle 
                className="alert-dot-element alert-dot-pulse" 
                cx="200" 
                cy="20" 
                r="6" 
                fill={reducedMotion ? "oklch(0.62 0.16 142)" : "oklch(0.82 0.22 85)"} 
              />

              {/* Node 0 Circle Marker */}
              <circle 
                className={cn("trace-node-0 trace-node-0-circle transition-colors")}
                cx="200" 
                cy="90" 
                r="7" 
                fill="oklch(0.82 0.22 85)"
                stroke="oklch(0.12 0 0)"
                strokeWidth="2"
                style={reducedMotion ? { opacity: 0.25 } : {}}
              />

              {/* Node 1 Circle Marker (Confirmed Cause) */}
              <circle 
                className="trace-node-1 trace-node-1-circle transition-colors" 
                cx="200" 
                cy="170" 
                r="8" 
                fill={reducedMotion ? "oklch(0.62 0.16 142)" : "oklch(0.82 0.22 85)"}
                stroke={reducedMotion ? "oklch(0.92 0 0)" : "oklch(0.12 0 0)"}
                strokeWidth="2"
                style={reducedMotion ? { transform: 'scale(1.3)', transformOrigin: '200px 170px' } : {}}
              />

              {/* Node 2 Circle Marker */}
              <circle 
                className="trace-node-2 trace-node-2-circle transition-colors" 
                cx="200" 
                cy="250" 
                r="7" 
                fill="oklch(0.82 0.22 85)"
                stroke="oklch(0.12 0 0)"
                strokeWidth="2"
                style={reducedMotion ? { opacity: 0.25 } : {}}
              />
            </svg>

            {/* DOM Overlay Trace Labels */}
            <div className="absolute inset-0 flex flex-col justify-between py-2 text-left pointer-events-none">
              
              {/* Label 0 (Node 0) */}
              <div 
                className="trace-label-0 absolute top-[72px] left-[calc(50%+24px)] bg-card/90 backdrop-blur-sm border border-border/60 rounded-lg p-2.5 shadow-lg max-w-[260px]"
                style={reducedMotion ? { opacity: 0.25, transform: 'none' } : {}}
              >
                <p className="font-mono text-[11px] text-foreground font-semibold">07:42:11 · deploy to payments-api</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">12 min before the alert</p>
              </div>

              {/* Label 1 (Node 1 - Confirmed Cause) */}
              <div 
                className="trace-label-1 absolute top-[150px] left-[calc(50%+24px)] bg-card/95 backdrop-blur-sm border border-border/80 rounded-lg p-2.5 shadow-xl max-w-[280px]"
                style={reducedMotion ? { opacity: 1, transform: 'none' } : {}}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <p className="font-mono text-[11px] text-foreground font-semibold">07:31:04 · config change · user-service</p>
                  <span className={cn("node-1-checkmark text-emerald-400 shrink-0", reducedMotion ? "opacity-100 scale-100" : "opacity-0 scale-0")}>
                    <Check className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">touches 2 of 3 alerting dependencies</p>
              </div>

              {/* Label 2 (Node 2) */}
              <div 
                className="trace-label-2 absolute top-[232px] left-[calc(50%+24px)] bg-card/90 backdrop-blur-sm border border-border/60 rounded-lg p-2.5 shadow-lg max-w-[260px]"
                style={reducedMotion ? { opacity: 0.25, transform: 'none' } : {}}
              >
                <p className="font-mono text-[11px] text-foreground font-semibold">06:58:47 · deploy to auth-service</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">same service, lower historical match rate</p>
              </div>

            </div>
          </div>

          {/* Headline, Subhead & CTA Block */}
          <div className="max-w-2xl mx-auto space-y-4 mt-6">
            <h1 
              className="hero-headline-block text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight"
              style={reducedMotion || isMobile ? { opacity: 1, transform: 'none' } : {}}
            >
              What caused this incident, and how do we know?
            </h1>
            
            <p 
              className="hero-subhead-block text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto"
              style={reducedMotion || isMobile ? { opacity: 1, transform: 'none' } : {}}
            >
              NexOps reads your deploys and alerts, ranks the likely cause, and shows its reasoning — so you're not guessing at 2 a.m.
            </p>

            <div 
              className="hero-cta-block pt-4 flex items-center justify-center gap-4"
              style={reducedMotion || isMobile ? { opacity: 1, transform: 'none' } : {}}
            >
              <Link href="/login">
                <Button size="lg" className="bg-[oklch(0.64_0.15_262)] text-white hover:bg-[oklch(0.64_0.15_262)]/90 font-semibold px-6 rounded-lg">
                  Join the pilot
                </Button>
              </Link>
              <a 
                href="#how-it-works" 
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors font-medium py-2"
              >
                See how it works ↓
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: PROBLEM STATEMENT                                              */}
      {/* ========================================================================= */}
      <section 
        id="problem"
        ref={problemSectionRef}
        className="py-24 px-6 border-t border-border/30 bg-[#0b0c10]"
      >
        <div className="max-w-3xl mx-auto space-y-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Every incident starts the same way: five tabs, one guess.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            GitHub. PagerDuty. Slack. A growing sense that whatever you find first is what you'll blame. Most of the first several minutes of an incident go to figuring out what changed — before anyone's even started fixing it.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: HOW IT WORKS                                                   */}
      {/* ========================================================================= */}
      <section 
        id="how-it-works"
        ref={howSectionRef}
        className="py-24 px-6 border-t border-border/30 bg-[oklch(0.12_0_0)]"
      >
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              One question. A real answer.
            </h2>
          </div>

          {/* 3 Staggered Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="how-panel-card p-6 bg-card/60 border border-border/60 rounded-xl space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[oklch(0.64_0.15_262)]/10 text-[oklch(0.64_0.15_262)] flex items-center justify-center font-mono font-bold text-xs">
                01
              </div>
              <h3 className="text-lg font-bold text-foreground">Reads what changed</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connects to GitHub and PagerDuty — no new agents, no new tabs.
              </p>
            </Card>

            <Card className="how-panel-card p-6 bg-card/60 border border-border/60 rounded-xl space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[oklch(0.64_0.15_262)]/10 text-[oklch(0.64_0.15_262)] flex items-center justify-center font-mono font-bold text-xs">
                02
              </div>
              <h3 className="text-lg font-bold text-foreground">Ranks likely causes</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Scores every recent deploy against the incident using deploy timing, dependency distance, and history — every score comes with the reasons behind it.
              </p>
            </Card>

            <Card className="how-panel-card p-6 bg-card/60 border border-border/60 rounded-xl space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[oklch(0.64_0.15_262)]/10 text-[oklch(0.64_0.15_262)] flex items-center justify-center font-mono font-bold text-xs">
                03
              </div>
              <h3 className="text-lg font-bold text-foreground">Learns what you confirm</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Mark a cause confirmed or ruled out, and NexOps remembers — the ranking gets sharper for your team over time.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: THE MOAT (ENGINEERING MEMORY)                                  */}
      {/* ========================================================================= */}
      <section 
        id="moat"
        ref={moatSectionRef}
        className="py-24 px-6 border-t border-border/30 bg-[#0b0c10]"
      >
        <div className="max-w-3xl mx-auto space-y-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            It gets smarter the longer you use it.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Every confirmed or rejected cause is stored, permanently. Over time, NexOps builds a private, compounding record of what actually causes incidents on your systems — accuracy a new tool, or a competitor, can't start with on day one.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: SCOPE STATEMENT (WHAT WE DON'T DO)                             */}
      {/* ========================================================================= */}
      <section 
        id="scope"
        ref={scopeSectionRef}
        className="py-24 px-6 border-t border-border/30 bg-[oklch(0.12_0_0)]"
      >
        <div className="max-w-3xl mx-auto space-y-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            What NexOps won't try to be.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            No paging. No log storage. No dashboard for the sake of having a dashboard. NexOps does one thing — trace an incident back to its cause — and stays out of the tools you already trust for everything else.
          </p>

          {/* 3 Muted Inline Tags */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Badge variant="outline" className="bg-muted/30 text-muted-foreground border-border/60 text-xs font-normal px-3 py-1">
              Not a paging system
            </Badge>
            <span className="text-muted-foreground/40">•</span>
            <Badge variant="outline" className="bg-muted/30 text-muted-foreground border-border/60 text-xs font-normal px-3 py-1">
              Not a log/metrics platform
            </Badge>
            <span className="text-muted-foreground/40">•</span>
            <Badge variant="outline" className="bg-muted/30 text-muted-foreground border-border/60 text-xs font-normal px-3 py-1">
              Not another catalog to maintain
            </Badge>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: PILOT / SOCIAL PROOF                                           */}
      {/* ========================================================================= */}
      <section 
        id="pilot"
        ref={pilotSectionRef}
        className="py-24 px-6 border-t border-border/30 bg-[#0b0c10]"
      >
        <div className="max-w-3xl mx-auto space-y-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Built in the open, early.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            NexOps is in an unpaid pilot with real engineering teams right now. If you want a second opinion the next time something breaks, we'd like yours to be one of them.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FINAL CTA SECTION                                                         */}
      {/* ========================================================================= */}
      <section 
        ref={ctaSectionRef}
        className="py-24 px-6 border-t border-border/30 bg-[oklch(0.12_0_0)] text-center"
      >
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Next incident, know why.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="bg-[oklch(0.64_0.15_262)] text-white hover:bg-[oklch(0.64_0.15_262)]/90 font-semibold px-8 rounded-lg w-full sm:w-auto">
                Join the pilot
              </Button>
            </Link>
          </div>
          <div>
            <a href="mailto:support@nexops.io" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              support@nexops.io
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER                                                                    */}
      {/* ========================================================================= */}
      <footer className="py-8 px-6 border-t border-border/40 text-center text-xs text-muted-foreground bg-[oklch(0.12_0_0)] flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto gap-4">
        <p>© 2026 NexOps. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/settings" className="hover:text-foreground transition-colors">Settings</Link>
          <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
        </div>
      </footer>

    </div>
  )
}

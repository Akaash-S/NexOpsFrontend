'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAppState } from '@/lib/hooks/use-app-state'
import { NexOpsLogo } from '@/components/ui/nexops-logo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  Terminal,
  ExternalLink,
  Check,
  Zap,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function LandingPage() {
  const router = useRouter()
  const { isAuthenticated } = useAppState()

  // Redirect authenticated users immediately to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const [reducedMotion, setReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const heroPinRef = useRef<HTMLDivElement>(null)
  const traceSvgRef = useRef<SVGSVGElement>(null)
  const traceLineRef = useRef<SVGPathElement>(null)
  const alertDotRef = useRef<SVGCircleElement>(null)

  const node0Ref = useRef<SVGCircleElement>(null)
  const node1Ref = useRef<SVGCircleElement>(null)
  const node2Ref = useRef<SVGCircleElement>(null)

  const label0Ref = useRef<HTMLDivElement>(null)
  const label1Ref = useRef<HTMLDivElement>(null)
  const label2Ref = useRef<HTMLDivElement>(null)
  const checkmark1Ref = useRef<HTMLDivElement>(null)

  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Detect media preferences
    const mediaQueryMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQueryMotion.matches)

    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    if (mediaQueryMotion.matches) {
      return () => window.removeEventListener('resize', checkMobile)
    }

    const ctx = gsap.context(() => {
      // 1. Alert Dot Infinite Pulse (Runs continuously, independent of scroll scrub)
      if (alertDotRef.current) {
        gsap.to(alertDotRef.current, {
          scale: 1.18,
          opacity: 0.6,
          duration: 1.6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          transformOrigin: 'center center',
        })
      }

      // 2. Desktop Hero Scroll-Pinned Timeline
      if (heroPinRef.current && window.innerWidth >= 768) {
        const pathLength = traceLineRef.current ? traceLineRef.current.getTotalLength() : 400
        if (traceLineRef.current) {
          gsap.set(traceLineRef.current, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          })
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroPinRef.current,
            start: 'top top',
            end: () => '+=' + window.innerHeight * 2.5,
            pin: true,
            scrub: true,
            anticipatePin: 1,
          },
        })

        // Progress 0.00 -> 0.08: Draw line towards Node 0
        tl.to(
          traceLineRef.current,
          {
            strokeDashoffset: pathLength * 0.65,
            ease: 'none',
          },
          0.00
        )

        // Progress 0.08 -> 0.12: Reveal Node 0 & Label 0
        tl.fromTo(node0Ref.current, { scale: 0 }, { scale: 1, ease: 'none' }, 0.08)
          .fromTo(label0Ref.current, { x: 20, opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.08)

        // Progress 0.12 -> 0.35: Draw line towards Node 1
        tl.to(
          traceLineRef.current,
          {
            strokeDashoffset: pathLength * 0.35,
            ease: 'none',
          },
          0.12
        )

        // Progress 0.35 -> 0.39: Reveal Node 1 & Label 1
        tl.fromTo(node1Ref.current, { scale: 0 }, { scale: 1, ease: 'none' }, 0.35)
          .fromTo(label1Ref.current, { x: 20, opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.35)

        // Progress 0.39 -> 0.55: Draw line towards Node 2
        tl.to(
          traceLineRef.current,
          {
            strokeDashoffset: pathLength * 0.1,
            ease: 'none',
          },
          0.39
        )

        // Progress 0.55 -> 0.59: Reveal Node 2 & Label 2
        tl.fromTo(node2Ref.current, { scale: 0 }, { scale: 1, ease: 'none' }, 0.55)
          .fromTo(label2Ref.current, { x: 20, opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.55)

        // Progress 0.59 -> 0.75: Finish line draw
        tl.to(
          traceLineRef.current,
          {
            strokeDashoffset: 0,
            ease: 'none',
          },
          0.59
        )

        // Progress 0.75 -> 0.85: Resolution Beat (Node 1 turns Green, Node 0 & 2 dim)
        tl.to([label0Ref.current, label2Ref.current], { opacity: 0.25, ease: 'none' }, 0.75)
          .to(
            [node0Ref.current, node2Ref.current],
            { opacity: 0.25, fill: '#52525b', ease: 'none' },
            0.75
          )
          .to(node1Ref.current, { scale: 1.3, fill: '#22c55e', ease: 'none' }, 0.75)
          .to(traceLineRef.current, { stroke: '#22c55e', ease: 'none' }, 0.75)
          .to(alertDotRef.current, { fill: '#22c55e', ease: 'none' }, 0.75)
          .fromTo(
            checkmark1Ref.current,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, ease: 'none' },
            0.75
          )

        // Progress 0.85 -> 1.00: Headline & Subhead & CTA Reveal
        tl.to(eyebrowRef.current, { opacity: 0, ease: 'none' }, 0.85)
          .fromTo(headlineRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.85)
          .fromTo(subheadRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.9)
          .fromTo(ctaRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.95)
      }

      // 3. Rest of Page Restrained Scroll Reveals
      const revealElements = gsap.utils.toArray('.gsap-section-reveal')
      revealElements.forEach((el: any) => {
        gsap.fromTo(
          el,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })

      // 4. Staggered Panels in Section 3
      gsap.fromTo(
        '.gsap-panel-stagger',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.gsap-panels-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })

    return () => {
      window.removeEventListener('resize', checkMobile)
      ctx.revert()
    }
  }, [])

  return (
    <div className="bg-[#0c0d12] text-zinc-100 min-h-screen selection:bg-blue-600/30 selection:text-blue-400 font-sans">
      {/* PERSISTENT UTILITY TOP NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0c0d12]/90 backdrop-blur-md border-b border-zinc-800/80 px-6 md:px-12 flex items-center justify-between">
        {/* Left: Wordmark Logo */}
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <NexOpsLogo size="md" />
        </Link>

        {/* Center/Right Nav Links */}
        <div className="flex items-center gap-6 md:gap-8">
          <a
            href="#how-it-works"
            className="text-xs font-medium uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            How it works
          </a>
          <a
            href="#pilot"
            className="text-xs font-medium uppercase tracking-wider text-zinc-400 hover:text-white transition-colors hidden sm:inline-block"
          >
            Pilot
          </a>

          <Link href="/login" prefetch={false}>
            <Button size="sm" className="font-semibold text-xs gap-1.5 bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20">
              Join the pilot <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* HERO SECTION — GSAP SCROLL-PINNED TRACE ANIMATION */}
      <section
        id="hero"
        ref={heroPinRef}
        className="relative min-h-screen pt-24 pb-16 px-6 md:px-12 flex flex-col justify-between max-w-6xl mx-auto overflow-hidden"
      >
        {/* Static Background Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/15 via-transparent to-transparent pointer-events-none -z-10" />

        {/* Eyebrow Label */}
        <div ref={eyebrowRef} className="pt-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-mono text-xs text-amber-500/90 tracking-widest font-semibold uppercase">
            INCIDENT CORRELATION ENGINE
          </span>
        </div>

        {/* CENTRAL SVG TRACE DIAGRAM & CANDIDATE NODES */}
        <div className="my-auto py-8 relative flex flex-col md:flex-row items-start justify-between gap-8 md:gap-16">
          {/* SVG Trace Line */}
          <div className="relative w-full md:w-1/2 h-[340px] md:h-[400px]">
            <svg ref={traceSvgRef} className="w-full h-full overflow-visible" viewBox="0 0 300 400" fill="none">
              {/* Trace Path */}
              <path
                ref={traceLineRef}
                d="M 50 20 L 50 120 L 50 240 L 50 360"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeLinecap="round"
                className="transition-colors duration-500"
              />

              {/* Alert Top Dot */}
              <circle ref={alertDotRef} cx="50" cy="20" r="7" fill="#f59e0b" className="transition-colors duration-500" />

              {/* Candidate Node 0 */}
              <circle
                ref={node0Ref}
                cx="50"
                cy="120"
                r="6"
                fill="#f59e0b"
                className="transition-transform transition-colors duration-500 origin-center"
                style={{ transform: reducedMotion ? 'scale(1)' : 'scale(0)', opacity: reducedMotion ? 0.25 : 1 }}
              />

              {/* Candidate Node 1 (Middle - Confirmed Cause) */}
              <circle
                ref={node1Ref}
                cx="50"
                cy="240"
                r="6"
                fill={reducedMotion ? '#22c55e' : '#f59e0b'}
                className="transition-transform transition-colors duration-500 origin-center"
                style={{ transform: reducedMotion ? 'scale(1.2)' : 'scale(0)' }}
              />

              {/* Candidate Node 2 */}
              <circle
                ref={node2Ref}
                cx="50"
                cy="360"
                r="6"
                fill="#f59e0b"
                className="transition-transform transition-colors duration-500 origin-center"
                style={{ transform: reducedMotion ? 'scale(1)' : 'scale(0)', opacity: reducedMotion ? 0.25 : 1 }}
              />
            </svg>

            {/* DOM CANDIDATE LABELS LAYER (Positioned alongside SVG nodes) */}
            <div className="absolute inset-0 pl-20 flex flex-col justify-between py-2">
              {/* Node 0 Label */}
              <div
                ref={label0Ref}
                className="space-y-0.5 transition-opacity duration-300"
                style={{ opacity: reducedMotion ? 0.25 : 0 }}
              >
                <div className="font-mono text-xs font-semibold text-zinc-300">
                  07:42:11 · deploy to payments-api
                </div>
                <div className="text-[11px] text-zinc-400">12 min before the alert</div>
              </div>

              {/* Node 1 Label (Confirmed Cause) */}
              <div
                ref={label1Ref}
                className="space-y-0.5 relative transition-opacity duration-300"
                style={{ opacity: reducedMotion ? 1 : 0 }}
              >
                <div className="flex items-center gap-2">
                  <div className="font-mono text-xs font-bold text-white">
                    07:31:04 · config change · user-service
                  </div>
                  <div
                    ref={checkmark1Ref}
                    className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full"
                    style={{ opacity: reducedMotion ? 1 : 0 }}
                  >
                    <Check className="w-3 h-3" /> CONFIRMED CAUSE
                  </div>
                </div>
                <div className="text-[11px] text-zinc-400">touches 2 of 3 alerting dependencies</div>
              </div>

              {/* Node 2 Label */}
              <div
                ref={label2Ref}
                className="space-y-0.5 transition-opacity duration-300"
                style={{ opacity: reducedMotion ? 0.25 : 0 }}
              >
                <div className="font-mono text-xs font-semibold text-zinc-300">
                  06:58:47 · deploy to auth-service
                </div>
                <div className="text-[11px] text-zinc-400">same service, lower historical match rate</div>
              </div>
            </div>
          </div>

          {/* HEADLINE & PAYOFF BLOCK (Reveals at end of trace sequence) */}
          <div className="w-full md:w-1/2 space-y-6 pt-4 md:pt-12">
            <h1
              ref={headlineRef}
              className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight"
              style={{ opacity: reducedMotion ? 1 : 0 }}
            >
              What caused this incident, and how do we know?
            </h1>

            <p
              ref={subheadRef}
              className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-lg"
              style={{ opacity: reducedMotion ? 1 : 0 }}
            >
              NexOps reads your deploys and alerts, ranks the likely cause, and shows its reasoning — so you're not guessing at 2 a.m.
            </p>

            <div
              ref={ctaRef}
              className="flex items-center gap-4 pt-2"
              style={{ opacity: reducedMotion ? 1 : 0 }}
            >
              <Link href="/login" prefetch={false}>
                <Button size="lg" className="font-bold gap-2 px-6 bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30">
                  Join the pilot <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <a href="#how-it-works" className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors">
                See how it works ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — PROBLEM STATEMENT */}
      <section className="gsap-section-reveal py-24 border-t border-zinc-800/80 bg-[#08090d]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-6 text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-snug">
            Every incident starts the same way: five tabs, one guess.
          </h2>
          <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            GitHub. PagerDuty. Slack. A growing sense that whatever you find first is what you'll blame. Most of the first several minutes of an incident go to figuring out what changed — before anyone's even started fixing it.
          </p>
        </div>
      </section>

      {/* SECTION 3 — HOW IT WORKS (3 STAGGERED PANELS) */}
      <section id="how-it-works" className="py-24 border-t border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-12">
          <div className="gsap-section-reveal space-y-3">
            <span className="font-mono text-xs font-semibold text-blue-400 uppercase tracking-widest">
              METHODOLOGY
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              One question. A real answer.
            </h2>
          </div>

          <div className="gsap-panels-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Panel 1 */}
            <div className="gsap-panel-stagger p-6 md:p-8 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Reads what changed</h3>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                Connects to GitHub and PagerDuty — no new agents, no new tabs.
              </p>
            </div>

            {/* Panel 2 */}
            <div className="gsap-panel-stagger p-6 md:p-8 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Ranks likely causes</h3>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                Scores every recent deploy against the incident using deploy timing, dependency distance, and history — every score comes with the reasons behind it.
              </p>
            </div>

            {/* Panel 3 */}
            <div className="gsap-panel-stagger p-6 md:p-8 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Learns what you confirm</h3>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                Mark a cause confirmed or ruled out, and NexOps remembers — the ranking gets sharper for your team over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — THE MOAT (ENGINEERING MEMORY) */}
      <section className="gsap-section-reveal py-24 border-t border-zinc-800/80 bg-[#08090d]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-6">
          <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-widest">
            ENGINEERING MEMORY
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            It gets smarter the longer you use it.
          </h2>
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
            Every confirmed or rejected cause is stored, permanently. Over time, NexOps builds a private, compounding record of what actually causes incidents on your systems — accuracy a new tool, or a competitor, can't start with on day one.
          </p>
        </div>
      </section>

      {/* SECTION 5 — SCOPE STATEMENT (WHAT WE DON'T DO) */}
      <section className="gsap-section-reveal py-24 border-t border-zinc-800/80">
        <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-8">
          <div className="space-y-3">
            <span className="font-mono text-xs font-semibold text-rose-400 uppercase tracking-widest">
              SCOPE STATEMENT
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              What NexOps won't try to be.
            </h2>
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-2xl">
              No paging. No log storage. No dashboard for the sake of having a dashboard. NexOps does one thing — trace an incident back to its cause — and stays out of the tools you already trust for everything else.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <span className="text-xs font-mono font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-full">
              Not a paging system
            </span>
            <span className="text-xs font-mono font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-full">
              Not a log/metrics platform
            </span>
            <span className="text-xs font-mono font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-full">
              Not another catalog to maintain
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 6 — PILOT / SOCIAL PROOF */}
      <section id="pilot" className="gsap-section-reveal py-24 border-t border-zinc-800/80 bg-[#08090d]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-6">
          <span className="font-mono text-xs font-semibold text-blue-400 uppercase tracking-widest">
            STARTER PILOT PROGRAM
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Built in the open, early.
          </h2>
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
            NexOps is in an unpaid pilot with real engineering teams right now. If you want a second opinion the next time something breaks, we'd like yours to be one of them.
          </p>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="gsap-section-reveal py-28 border-t border-zinc-800/80 text-center space-y-8">
        <div className="max-w-3xl mx-auto px-6 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Next incident, know why.
          </h2>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Link href="/login" prefetch={false}>
            <Button size="lg" className="font-bold gap-2 px-10 bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30">
              Join the pilot <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>

          <a
            href="mailto:akaashgithub21@gmail.com"
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            Questions? Contact engineering team
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800/80 bg-[#06070a] py-12 px-6 md:px-12 text-zinc-400 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <NexOpsLogo size="sm" />
            <span>© NexOps</span>
          </div>

          <div className="flex gap-6 font-medium">
            <Link href="/terms" prefetch={false} className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" prefetch={false} className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/login" prefetch={false} className="hover:text-white transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

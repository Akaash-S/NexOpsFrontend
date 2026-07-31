'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppState } from '@/lib/hooks/use-app-state'

export default function LandingPage() {
  const router = useRouter()
  const { isAuthenticated } = useAppState()

  // Sandbox feedback state
  const [sandboxFeedback, setSandboxFeedback] = useState<'confirmed' | 'rejected' | null>(null)
  const [learningProgress, setLearningProgress] = useState(85.4)

  // Accordion state for FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Redirect authenticated users immediately to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  // Intro Logo scroll docking logic
  const [isScrolled, setIsScrolled] = useState(false)
  const introLogoRef = useRef<HTMLDivElement>(null)
  const logoTargetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const threshold = 80 // Scroll threshold in px

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
          const initialFontSize = window.innerWidth < 768 ? '48px' : '64px'
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

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const handleSandboxConfirm = () => {
    setSandboxFeedback('confirmed')
    setLearningProgress((prev) => Math.min(99.9, parseFloat((prev + 0.3).toFixed(1))))
  }

  const handleSandboxReject = () => {
    setSandboxFeedback('rejected')
  }

  return (
    <div className="bg-[#111319] text-[#e1e2ea] min-h-screen selection:bg-[#5d8ef1]/20 selection:text-[#aec6ff]">
      {/* THE ANIMATING INTRO LOGO */}
      <div
        ref={introLogoRef}
        id="intro-logo"
        className="font-bold text-on-surface tracking-tight transition-all duration-700 ease-out select-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '64px',
        }}
      >
        NexOps
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <div
        id="main-content"
        className={`transition-all duration-700 ease-out ${
          isScrolled ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'
        }`}
      >
        {/* Navigation Shell */}
        <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6 max-w-container-max mx-auto left-0 right-0 bg-[#111319]/80 backdrop-blur-md border-b border-white/5">
          {/* Logo docking placeholder */}
          <div
            ref={logoTargetRef}
            id="logo-target"
            className="font-bold text-2xl tracking-tight text-transparent select-none"
          >
            NexOps
          </div>

          <div className="hidden md:flex gap-8 lg:gap-12 items-center">
            <a
              href="#engine"
              className="font-mono text-xs uppercase tracking-widest text-[#c3c6d4] hover:text-[#aec6ff] transition-colors"
            >
              Engine
            </a>
            <a
              href="#features"
              className="font-mono text-xs uppercase tracking-widest text-[#c3c6d4] hover:text-[#aec6ff] transition-colors"
            >
              Methodology
            </a>
            <a
              href="#sandbox"
              className="font-mono text-xs uppercase tracking-widest text-[#c3c6d4] hover:text-[#aec6ff] transition-colors"
            >
              Sandbox
            </a>
            <a
              href="#faq"
              className="font-mono text-xs uppercase tracking-widest text-[#c3c6d4] hover:text-[#aec6ff] transition-colors"
            >
              FAQ
            </a>

            <Link href="/login" prefetch={false}>
              <button className="bg-[#5d8ef1] text-[#00275e] px-6 py-2.5 font-mono text-xs font-semibold uppercase pill-button transition-all hover:brightness-110 active:scale-[0.98] shadow-lg shadow-[#5d8ef1]/20">
                Join the Pilot
              </button>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <Link href="/login" prefetch={false}>
              <button className="bg-[#5d8ef1] text-[#00275e] px-4 py-2 font-mono text-xs font-semibold uppercase pill-button">
                Join Pilot
              </button>
            </Link>
          </div>
        </nav>

        <main className="max-w-container-max mx-auto">
          {/* HERO SECTION */}
          <section id="engine" className="pt-[160px] md:pt-[200px] pb-24 px-6 md:px-12 border-b border-white/5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-7 space-y-8">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#282a30] rounded-full border border-white/10">
                  <span className="text-xs font-mono text-[#aec6ff] uppercase tracking-widest">
                    [ 🔴 LIVE PILOT ] Autonomous Incident Correlation Engine
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold text-[#e1e2ea] tracking-tight leading-[1.1]">
                  What caused this incident, and how do we know?
                </h1>

                <p className="text-base md:text-lg text-[#8d909e] max-w-xl leading-relaxed">
                  NexOps maps every deploy, schema change, and infrastructure event to your incident alerts in real-time. Stop guessing and start resolving with deterministic evidence.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link href="/login" prefetch={false}>
                    <button className="bg-[#5d8ef1] text-[#00275e] px-8 py-4 text-base font-bold pill-button transition-all hover:brightness-110 active:scale-[0.98] shadow-lg shadow-[#5d8ef1]/20">
                      Join the Pilot
                    </button>
                  </Link>

                  <a href="#sandbox">
                    <button className="bg-transparent border border-white/20 text-[#e1e2ea] px-8 py-4 text-base font-bold pill-button transition-all hover:bg-white/5 active:scale-[0.98]">
                      Explore Live Demo
                    </button>
                  </a>
                </div>
              </div>

              {/* HERO SCENARIO CARD */}
              <div className="lg:col-span-5 relative mt-6 lg:mt-0">
                <div className="glass-card p-6 md:p-8 rounded-3xl shadow-2xl relative z-10 border border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[#ffb4ab] text-xl">error</span>
                      <span className="font-mono text-xs text-[#c3c6d4] uppercase tracking-widest font-semibold">
                        Active Incident
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[#4de082] font-bold bg-[#4de082]/10 px-2.5 py-1 rounded-full border border-[#4de082]/20">
                      86.2% Confident
                    </span>
                  </div>

                  <div className="space-y-5">
                    <h3 className="font-mono text-lg md:text-xl text-[#e1e2ea] font-semibold leading-snug">
                      Scenario: Database Pool Exhausted
                    </h3>

                    <div className="h-px bg-white/10 w-full my-4"></div>

                    <div className="space-y-3 font-mono text-xs md:text-sm">
                      <div className="flex justify-between items-center text-[#8d909e]">
                        <span>Traffic spike on checkout-v3</span>
                        <span className="text-[#4de082] font-semibold">+35.0</span>
                      </div>
                      <div className="flex justify-between items-center text-[#8d909e]">
                        <span>Active pool config change #492</span>
                        <span className="text-[#4de082] font-semibold">+25.0</span>
                      </div>
                      <div className="flex justify-between items-center text-[#8d909e]">
                        <span>Upstream dependency latency</span>
                        <span className="text-[#4de082] font-semibold">+11.2</span>
                      </div>
                    </div>

                    <div className="pt-6 grid grid-cols-2 gap-3">
                      <Link href="/incidents" prefetch={false}>
                        <button className="w-full border border-white/20 py-3 text-center font-mono text-xs text-[#c3c6d4] rounded-xl uppercase tracking-widest bg-white/5 hover:bg-white/10 transition-colors font-semibold">
                          Analyze Cause
                        </button>
                      </Link>
                      <Link href="/dashboard" prefetch={false}>
                        <button className="w-full border border-white/20 py-3 text-center font-mono text-xs text-[#c3c6d4] rounded-xl uppercase tracking-widest bg-white/5 hover:bg-white/10 transition-colors font-semibold">
                          Open Playbook
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* Visual Glow */}
                <div className="absolute -top-6 -right-6 w-full h-full border border-white/5 rounded-3xl -z-0 bg-[#5d8ef1]/5 blur-xl"></div>
              </div>
            </div>
          </section>

          {/* PROBLEM SECTION */}
          <section className="py-24 px-6 md:px-12 border-b border-white/5 bg-[#0c0e14]">
            <div className="max-w-4xl mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#e1e2ea] tracking-tight">
                Incident Response is Broken by Alert Noise and Tribal Knowledge
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Item 1 */}
              <div className="bg-[#1d1f26] p-8 rounded-3xl border border-white/5 flex flex-col justify-between h-full">
                <div className="mb-6">
                  <span className="font-mono text-xs text-[#ffb4ab] uppercase tracking-widest block mb-2 font-semibold">
                    Traditional Triage
                  </span>
                  <h4 className="text-xl font-bold text-[#e1e2ea] mb-3">Alert Storms</h4>
                  <p className="text-[#8d909e] text-sm leading-relaxed">
                    On-call engineers are buried in hundreds of disconnected logs and traces during a microservice failure.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <span className="font-mono text-xs text-[#4de082] uppercase tracking-widest block mb-1 font-semibold">
                    The NexOps Solution
                  </span>
                  <p className="text-[#e1e2ea] text-sm font-medium">
                    Automatic signal de-noising through temporal and topological correlation.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="bg-[#1d1f26] p-8 rounded-3xl border border-white/5 flex flex-col justify-between h-full">
                <div className="mb-6">
                  <span className="font-mono text-xs text-[#ffb4ab] uppercase tracking-widest block mb-2 font-semibold">
                    Traditional Triage
                  </span>
                  <h4 className="text-xl font-bold text-[#e1e2ea] mb-3">Black Box AI</h4>
                  <p className="text-[#8d909e] text-sm leading-relaxed">
                    Legacy AIOps tools give "insights" without explaining the logic, leading to team distrust.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <span className="font-mono text-xs text-[#4de082] uppercase tracking-widest block mb-1 font-semibold">
                    The NexOps Solution
                  </span>
                  <p className="text-[#e1e2ea] text-sm font-medium">
                    Deterministic engine providing step-by-step reasoning for every correlation score.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="bg-[#1d1f26] p-8 rounded-3xl border border-white/5 flex flex-col justify-between h-full">
                <div className="mb-6">
                  <span className="font-mono text-xs text-[#ffb4ab] uppercase tracking-widest block mb-2 font-semibold">
                    Traditional Triage
                  </span>
                  <h4 className="text-xl font-bold text-[#e1e2ea] mb-3">Manual Postmortems</h4>
                  <p className="text-[#8d909e] text-sm leading-relaxed">
                    Tracing the sequence of events manually takes hours of archaeology after the fix.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <span className="font-mono text-xs text-[#4de082] uppercase tracking-widest block mb-1 font-semibold">
                    The NexOps Solution
                  </span>
                  <p className="text-[#e1e2ea] text-sm font-medium">
                    Real-time graph traversal generates the timeline as the incident unfolds.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS & WORKFLOW */}
          <section id="features" className="py-24 px-6 md:px-12 border-b border-white/5">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#e1e2ea] tracking-tight">
                From Webhook Trigger to Root Cause in Under 3 Seconds
              </h2>
            </div>

            {/* ASCII Correlation Flow Diagram */}
            <div className="mb-16 flex justify-center overflow-x-auto">
              <div className="font-mono text-xs text-[#8d909e] leading-tight whitespace-pre bg-[#0c0e14] p-6 md:p-10 rounded-2xl border border-white/10 shadow-inner">
{`[EVENT SOURCE] ----(webhook)----> [INGESTION]
                                    |
      (Correlation Engine) <--------+
      /        |        \\
[TOPOLOGY] [TEMPORAL] [BEHAVIOR]
      \\        |        /
       (Graph Traversal)
               |
[DETERMINISTIC ROOT CAUSE] 86.2%`}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-3 p-6 rounded-2xl bg-[#1d1f26] border border-white/5">
                <span className="font-mono text-[#5d8ef1] text-2xl font-bold">01</span>
                <h4 className="text-lg font-bold text-[#e1e2ea]">Zero-Config Ingestion</h4>
                <p className="text-[#8d909e] text-sm leading-relaxed">
                  Connect GitHub, PagerDuty, and your APM. NexOps begins building your system's dependency graph without manual tagging.
                </p>
              </div>

              <div className="space-y-3 p-6 rounded-2xl bg-[#1d1f26] border border-white/5">
                <span className="font-mono text-[#5d8ef1] text-2xl font-bold">02</span>
                <h4 className="text-lg font-bold text-[#e1e2ea]">Dynamic Graph Traversal</h4>
                <p className="text-[#8d909e] text-sm leading-relaxed">
                  When an alert fires, our engine traverses the system graph to find the earliest delta that correlates with the failure signature.
                </p>
              </div>

              <div className="space-y-3 p-6 rounded-2xl bg-[#1d1f26] border border-white/5">
                <span className="font-mono text-[#5d8ef1] text-2xl font-bold">03</span>
                <h4 className="text-lg font-bold text-[#e1e2ea]">Explainable Recalibration</h4>
                <p className="text-[#8d909e] text-sm leading-relaxed">
                  NexOps shows you exactly why it reached a conclusion. Human feedback recalibrates the engine's internal weights for your specific stack.
                </p>
              </div>
            </div>
          </section>

          {/* FEATURE CARDS & CONTINUOUS LEARNING MOAT */}
          <section className="py-24 px-6 md:px-12 border-b border-white/5 bg-[#0c0e14]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 space-y-4">
                <span className="px-3 py-1 bg-[#5d8ef1]/10 text-[#5d8ef1] text-[10px] font-mono rounded-full uppercase tracking-widest border border-[#5d8ef1]/20 font-semibold">
                  Real-Time Topology
                </span>
                <p className="text-[#e1e2ea] font-bold text-base">Live Infrastructure Mapping</p>
                <p className="text-[#8d909e] text-sm leading-relaxed">
                  Every container and service relationship updated in milliseconds.
                </p>
              </div>

              <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 space-y-4">
                <span className="px-3 py-1 bg-[#4de082]/10 text-[#4de082] text-[10px] font-mono rounded-full uppercase tracking-widest border border-[#4de082]/20 font-semibold">
                  Deterministic Engine
                </span>
                <p className="text-[#e1e2ea] font-bold text-base">Causal Inference Model</p>
                <p className="text-[#8d909e] text-sm leading-relaxed">
                  Built on logic, not LLM guesswork. No hallucinations, only evidence.
                </p>
              </div>

              <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 space-y-4">
                <span className="px-3 py-1 bg-[#ffb960]/10 text-[#ffb960] text-[10px] font-mono rounded-full uppercase tracking-widest border border-[#ffb960]/20 font-semibold">
                  Automated Governance
                </span>
                <p className="text-[#e1e2ea] font-bold text-base">Post-Mortem Automation</p>
                <p className="text-[#8d909e] text-sm leading-relaxed">
                  Generates timeline and incident reports automatically for compliance.
                </p>
              </div>

              <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 space-y-4">
                <span className="px-3 py-1 bg-[#8d909e]/10 text-[#8d909e] text-[10px] font-mono rounded-full uppercase tracking-widest border border-[#8d909e]/20 font-semibold">
                  Enterprise Grade
                </span>
                <p className="text-[#e1e2ea] font-bold text-base">SOC2 & VPC Ready</p>
                <p className="text-[#8d909e] text-sm leading-relaxed">
                  Deploy on-prem or via VPC peering. Telemetry stays isolated within your tenant.
                </p>
              </div>
            </div>

            {/* Moat Progress Card */}
            <div className="bg-[#1d1f26] border border-white/10 p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="md:w-1/2 space-y-4">
                <h3 className="text-2xl md:text-3xl font-extrabold text-[#e1e2ea]">
                  The Moat: Continuous Learning
                </h3>
                <p className="text-[#8d909e] text-sm md:text-base leading-relaxed">
                  Every confirm/reject is remembered permanently, per team. NexOps gets more accurate for that team's specific systems the longer they use it. We don't just solve incidents; we map your institutional knowledge.
                </p>
              </div>

              <div className="md:w-1/2 w-full flex justify-center">
                <div className="bg-[#111319] border border-white/10 p-6 md:p-8 w-full max-w-md rounded-2xl space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#8d909e] uppercase tracking-widest font-semibold">
                      Neural Weights
                    </span>
                    <span className="text-[#4de082] font-mono text-xs font-semibold animate-pulse">
                      Learning...
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-[#282a30] rounded-full overflow-hidden">
                      <div
                        className="bg-[#5d8ef1] h-full transition-all duration-700 ease-out"
                        style={{ width: `${learningProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between font-mono text-xs text-[#c3c6d4]">
                      <span>Team Specific Accuracy</span>
                      <span className="font-bold">{learningProgress.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* INTERACTIVE SANDBOX */}
          <section id="sandbox" className="py-24 px-6 md:px-12 border-b border-white/5">
            <div className="max-w-5xl mx-auto space-y-8">
              <div>
                <span className="font-mono text-xs text-[#5d8ef1] uppercase tracking-widest block mb-2 font-semibold">
                  Interactive Sandbox
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#e1e2ea]">
                  Sample Scenario: Payment Service Outage
                </h2>
              </div>

              <div className="bg-[#1d1f26] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="bg-[#282a30]/60 px-6 py-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ffb4ab]/50"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffb960]/50"></div>
                    <div className="w-3 h-3 rounded-full bg-[#4de082]/50"></div>
                  </div>
                  <span className="font-mono text-xs text-[#8d909e] tracking-widest">
                    NEXOPS_CONSOLE_V4
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-8 p-6 md:p-8 border-r border-white/5 space-y-6">
                    <div className="bg-[#111319] p-6 rounded-2xl border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="font-mono text-sm md:text-base text-[#e1e2ea] font-semibold">
                          Deploy #8192 (payment-gateway)
                        </h5>
                        <span className="text-[#4de082] font-mono text-xs font-bold bg-[#4de082]/10 px-2.5 py-1 rounded-full">
                          Match: 91%
                        </span>
                      </div>
                      <p className="text-[#8d909e] text-sm">
                        "Modified retry logic in client-pool causing recursive upstream timeouts."
                      </p>
                      <div className="space-y-2">
                        <div className="h-2 bg-[#282a30] rounded-full overflow-hidden">
                          <div className="h-full bg-[#4de082] w-[91%]"></div>
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-[#8d909e] uppercase">
                          <span>Temporal Alignment</span>
                          <span>Topological Link</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#111319] p-6 rounded-2xl border border-white/5 opacity-60 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-mono text-sm text-[#e1e2ea]">
                          Config Update (auth-sidecar)
                        </h5>
                        <span className="text-[#8d909e] font-mono text-xs">Match: 12%</span>
                      </div>
                      <div className="h-2 bg-[#282a30] rounded-full"></div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 p-6 md:p-8 flex flex-col justify-center text-center space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-[#e1e2ea] mb-2">Is this correct?</h4>
                      <p className="text-[#8d909e] text-xs">
                        Your feedback improves accuracy for the payment-v2 cluster.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={handleSandboxConfirm}
                        className={`w-full font-mono py-3.5 rounded-xl uppercase tracking-widest text-xs font-bold transition-all ${
                          sandboxFeedback === 'confirmed'
                            ? 'bg-[#4de082] text-[#003919] ring-2 ring-[#4de082]'
                            : 'bg-[#4de082] text-[#003919] hover:brightness-110'
                        }`}
                      >
                        {sandboxFeedback === 'confirmed' ? '✓ Feedback Saved' : 'Confirm Cause'}
                      </button>

                      <button
                        onClick={handleSandboxReject}
                        className={`w-full border border-white/20 text-[#e1e2ea] font-mono py-3.5 rounded-xl uppercase tracking-widest text-xs font-semibold transition-all ${
                          sandboxFeedback === 'rejected'
                            ? 'bg-white/10 border-white/40'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        {sandboxFeedback === 'rejected' ? '✕ Suggestion Rejected' : 'Reject Suggestion'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TECHNICAL FAQ SECTION */}
          <section id="faq" className="py-24 px-6 md:px-12 border-b border-white/5">
            <div className="max-w-4xl mx-auto space-y-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#e1e2ea] text-center tracking-tight">
                Technical FAQ
              </h2>

              <div className="space-y-6">
                <div className="border border-white/10 rounded-2xl bg-[#1d1f26] overflow-hidden">
                  <button
                    onClick={() => toggleFaq(0)}
                    className="w-full p-6 text-left flex justify-between items-center font-bold text-lg text-[#e1e2ea]"
                  >
                    <span>How does the correlation engine work without manual tagging?</span>
                    <span className="font-mono text-xl">{openFaq === 0 ? '−' : '+'}</span>
                  </button>
                  {openFaq === 0 && (
                    <div className="px-6 pb-6 text-[#8d909e] text-sm leading-relaxed border-t border-white/5 pt-4">
                      NexOps ingests Kubernetes manifests, commit hashes, and service mesh telemetry to infer relationships. We combine this topological data with temporal analysis to find common deltas across your stack without manual instrumentation.
                    </div>
                  )}
                </div>

                <div className="border border-white/10 rounded-2xl bg-[#1d1f26] overflow-hidden">
                  <button
                    onClick={() => toggleFaq(1)}
                    className="w-full p-6 text-left flex justify-between items-center font-bold text-lg text-[#e1e2ea]"
                  >
                    <span>Does NexOps replace my existing monitoring tools?</span>
                    <span className="font-mono text-xl">{openFaq === 1 ? '−' : '+'}</span>
                  </button>
                  {openFaq === 1 && (
                    <div className="px-6 pb-6 text-[#8d909e] text-sm leading-relaxed border-t border-white/5 pt-4">
                      No. NexOps sits on top of Datadog, PagerDuty, and GitHub. We ingest their alert events and deployment webhooks to provide the "Why" behind the signals they capture.
                    </div>
                  )}
                </div>

                <div className="border border-white/10 rounded-2xl bg-[#1d1f26] overflow-hidden">
                  <button
                    onClick={() => toggleFaq(2)}
                    className="w-full p-6 text-left flex justify-between items-center font-bold text-lg text-[#e1e2ea]"
                  >
                    <span>What is the latency between an incident and NexOps analysis?</span>
                    <span className="font-mono text-xl">{openFaq === 2 ? '−' : '+'}</span>
                  </button>
                  {openFaq === 2 && (
                    <div className="px-6 pb-6 text-[#8d909e] text-sm leading-relaxed border-t border-white/5 pt-4">
                      Sub-second. Our processing pipeline is built on a real-time stream architecture. Most correlations are visible within 3 seconds of the alert entering our system.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* EMOTIONAL BEAT & FINAL CTA */}
          <section className="py-24 px-6 md:px-12 relative overflow-hidden">
            <div className="glass-card p-10 md:p-16 rounded-3xl text-center relative z-10 border border-white/10 max-w-4xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#e1e2ea] tracking-tight">
                Enter the Limited Pilot Program
              </h2>

              <p className="text-sm md:text-base text-[#8d909e] max-w-2xl mx-auto leading-relaxed">
                We're onboarding a small number of real engineering teams into an unpaid pilot. In exchange for early access, we ask for real usage and honest feedback to harden the engine.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/login" prefetch={false}>
                  <button className="bg-[#5d8ef1] text-[#00275e] px-10 py-4 text-base pill-button font-bold transition-all hover:brightness-110 active:scale-[0.98] shadow-lg shadow-[#5d8ef1]/20">
                    Request pilot access
                  </button>
                </Link>

                <a href="#engine">
                  <button className="bg-transparent border border-white/20 text-[#e1e2ea] px-10 py-4 text-base pill-button font-bold transition-all hover:bg-white/5 active:scale-[0.98]">
                    View Benchmarks
                  </button>
                </a>
              </div>
            </div>
            {/* Ambient Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[#5d8ef1]/10 blur-[100px] rounded-full -z-0"></div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="max-w-container-max mx-auto px-6 md:px-12 py-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-[#8d909e]">
          <div className="font-bold text-xl text-[#e1e2ea] tracking-tight">NexOps</div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
            <div className="flex gap-6">
              <Link href="/terms" prefetch={false} className="hover:text-[#e1e2ea] transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" prefetch={false} className="hover:text-[#e1e2ea] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/dashboard" prefetch={false} className="hover:text-[#e1e2ea] transition-colors">
                Dashboard
              </Link>
              <Link href="/integrations" prefetch={false} className="hover:text-[#e1e2ea] transition-colors">
                Integrations
              </Link>
            </div>
            <p>© 2026 NexOps Engineering. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

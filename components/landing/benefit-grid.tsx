'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { Clock, CheckCircle2, Network, ShieldCheck } from 'lucide-react'

export function BenefitGrid() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Map vertical scroll progress to horizontal translateX on desktop
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-62%'])

  const benefits = [
    {
      title: 'See the likely cause in seconds',
      description: 'Not a dashboard full of uncoordinated metrics to interpret yourself during a 2 AM emergency.',
      icon: Clock,
    },
    {
      title: 'Every score comes with a reason',
      description: 'No bare, mysterious confidence numbers — ever. Every candidate cause displays a clear, human-readable rationale.',
      icon: CheckCircle2,
    },
    {
      title: 'Know the blast radius before you ship',
      description: 'Not after customers report outages. Understand downstream service impact directly on every pull request.',
      icon: Network,
    },
    {
      title: 'Built for GitHub + PagerDuty',
      description: 'Zero complex setup or data migration. NexOps hooks directly into your existing developer and on-call toolchain.',
      icon: ShieldCheck,
    },
  ]

  return (
    <section ref={sectionRef} className="relative bg-black text-white border-t border-zinc-900 md:h-[220vh]">
      {/* Desktop Sticky Viewport */}
      <div className="hidden md:flex sticky top-0 h-screen items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="mb-8">
            <div className="text-xs font-mono font-semibold tracking-wider text-primary uppercase mb-2">
              Core Capabilities
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Built for speed, clarity, and developer trust
            </h2>
          </div>

          <div className="overflow-hidden">
            <motion.div
              style={prefersReducedMotion ? undefined : { x }}
              className="flex gap-6 will-change-transform"
            >
              {benefits.map((benefit, idx) => {
                const IconComponent = benefit.icon
                return (
                  <div
                    key={idx}
                    className="relative overflow-hidden w-[380px] lg:w-[420px] shrink-0 p-8 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 group shadow-lg hover:shadow-2xl flex flex-col justify-between"
                  >
                    {/* Background Faded Monochrome Icon Motif */}
                    <IconComponent className="absolute -bottom-6 -right-6 w-44 h-44 text-white/[0.05] group-hover:text-primary/[0.08] transition-colors duration-300 pointer-events-none select-none" />

                    <div className="relative z-10">
                      <div className="text-xs font-mono text-zinc-500 mb-4 font-semibold">
                        0{idx + 1} &bull; BENEFIT
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-tight mb-3 group-hover:text-primary transition-colors duration-200">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed font-normal">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Fallback: Native Snap Horizontal Scroll Rail */}
      <div className="block md:hidden py-16 px-4 sm:px-6">
        <div className="mb-6">
          <div className="text-xs font-mono font-semibold tracking-wider text-primary uppercase mb-2">
            Core Capabilities
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Built for speed, clarity, and developer trust
          </h2>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-none">
          {benefits.map((benefit, idx) => {
            const IconComponent = benefit.icon
            return (
              <div
                key={idx}
                className="relative overflow-hidden snap-center shrink-0 w-[280px] p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80"
              >
                <IconComponent className="absolute -bottom-4 -right-4 w-32 h-32 text-white/[0.04] pointer-events-none select-none" />
                <div className="relative z-10">
                  <div className="text-xs font-mono text-zinc-500 mb-3 font-semibold">
                    0{idx + 1} &bull; BENEFIT
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    {benefit.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

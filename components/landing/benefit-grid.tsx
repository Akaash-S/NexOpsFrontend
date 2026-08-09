'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

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
    },
    {
      title: 'Every score comes with a reason',
      description: 'No bare, mysterious confidence numbers — ever. Every candidate cause displays a clear, human-readable rationale.',
    },
    {
      title: 'Know the blast radius before you ship',
      description: 'Not after customers report outages. Understand downstream service impact directly on every pull request.',
    },
    {
      title: 'Built for GitHub + PagerDuty',
      description: 'Zero complex setup or data migration. NexOps hooks directly into your existing developer and on-call toolchain.',
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
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="w-[380px] lg:w-[420px] shrink-0 p-8 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 group shadow-lg hover:shadow-2xl flex flex-col justify-between"
                >
                  <div>
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
              ))}
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
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="snap-center shrink-0 w-[280px] p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80"
            >
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
          ))}
        </div>
      </div>
    </section>
  )
}

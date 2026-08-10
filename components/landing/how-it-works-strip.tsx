'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Zap, GitMerge, CheckCircle } from 'lucide-react'

export function HowItWorksStrip() {
  const steps = [
    {
      step: '01',
      title: 'Alert Received',
      description: 'Webhook fires from PagerDuty, Datadog, or Sentry when service metrics degrade.',
      icon: Zap,
    },
    {
      step: '02',
      title: 'Automated Analysis',
      description: 'NexOps cross-references recent GitHub commits, PRs, and deployment logs instantly.',
      icon: GitMerge,
    },
    {
      step: '03',
      title: 'Ranked Root Causes',
      description: 'Engineers receive ranked candidate causes with plain-English rationales in under 3 minutes.',
      icon: CheckCircle,
    },
  ]

  return (
    <section id="how-it-works" className="py-20 md:py-28 lg:py-32 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono font-semibold tracking-wider text-primary uppercase mb-3">
            Workflow Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            From PagerDuty alert to confirmed fix in 3 steps
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 font-normal">
            No complex query languages to learn. NexOps operates autonomously alongside your team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const IconComponent = item.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="relative p-8 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold font-mono text-primary">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-primary">
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">{item.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

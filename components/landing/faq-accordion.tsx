'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'How does NexOps identify root causes without access to raw customer logs?',
      answer: 'NexOps analyzes deployment signals, pull request code diffs, infrastructure metrics, and alert timing. Instead of ingesting sensitive PII/log bodies, NexOps uses structural metadata and git commit correlation to determine candidate causes.',
    },
    {
      question: 'Does NexOps require write access to my GitHub repositories?',
      answer: 'No. NexOps operates strictly with read-only OAuth permissions for code commits, PR metadata, and deployment status events.',
    },
    {
      question: 'How long does setup take for an engineering team?',
      answer: 'Under 5 minutes. Simply connect your GitHub organization via OAuth and input your PagerDuty REST API token.',
    },
    {
      question: 'What happens when multiple deployments occur simultaneously?',
      answer: 'NexOps evaluates blast radius graphs and alert timing metrics independently across all concurrent deployments, ranking candidates by relative confidence.',
    },
  ]

  return (
    <section id="faq" className="py-20 md:py-28 lg:py-32 bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="text-xs font-mono font-semibold tracking-wider text-primary uppercase mb-3">
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Everything you need to know about NexOps
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/90 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-0 text-sm text-zinc-400 font-normal leading-relaxed border-t border-zinc-900 mt-2 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      q: 'Does NexOps replace PagerDuty or GitHub?',
      a: 'No. NexOps connects directly to your existing GitHub and PagerDuty accounts via secure webhooks and APIs. It acts as an intelligent investigation layer on top of your current toolchain without replacing any part of it.',
    },
    {
      q: 'What permissions does NexOps require?',
      a: 'NexOps requests read-only access to GitHub repository metadata, commits, and deployment events, along with read access to PagerDuty alerts. We never modify your source code or deployment pipelines.',
    },
    {
      q: 'What does "confirmed cause" mean?',
      a: 'When an incident is resolved, an on-call engineer can mark a candidate cause as "Confirmed" or "Rejected". This feedback validates root cause analysis for postmortems and sharpens future correlation accuracy for your workspace specifically.',
    },
    {
      q: 'Is NexOps free right now?',
      a: 'Yes. During our early access pilot, NexOps is completely free with full access to root cause correlation, blast radius risk scoring, and unlimited integration webhooks.',
    },
    {
      q: 'What is NexOps *not* trying to be?',
      a: 'NexOps is strictly focused on root-cause investigation and pre-deploy risk assessment. We are explicitly not an observability metric platform (like Datadog), not an on-call dispatcher (like PagerDuty), and not a CI/CD runner. We answer one question: what caused this incident, and how do we know?',
    },
  ]

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-20 md:py-28 lg:py-32 bg-black text-white border-t border-zinc-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="text-xs font-mono font-semibold tracking-wider text-primary uppercase mb-3">
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Everything you need to know
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="rounded-2xl bg-zinc-950/90 border border-zinc-800/80 overflow-hidden transition-colors duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-semibold text-lg text-white hover:text-primary transition-colors duration-200"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-sm text-zinc-400 font-normal leading-relaxed border-t border-zinc-900 mt-2 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

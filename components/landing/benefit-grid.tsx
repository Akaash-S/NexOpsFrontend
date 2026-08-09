'use client'

export function BenefitGrid() {
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
    <section className="py-20 md:py-28 lg:py-32 bg-black text-white border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 group shadow-lg hover:shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white tracking-tight mb-3 group-hover:text-primary transition-colors duration-200">
                {benefit.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-normal">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

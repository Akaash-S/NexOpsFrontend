'use client'

export function HowItWorksStrip() {
  const steps = [
    {
      step: '01',
      title: 'Deploy happens',
      description: 'GitHub sends the deployment signal directly to NexOps via webhook as soon as a commit or PR is merged.',
    },
    {
      step: '02',
      title: 'Alert fires',
      description: 'PagerDuty sends the incident alert when error spikes or latency thresholds are breached in production.',
    },
    {
      step: '03',
      title: 'NexOps ranks the cause',
      description: 'Surfaces the breaking deployment with plain-English evidence and downstream blast radius — in seconds.',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 md:py-28 lg:py-32 bg-black text-white border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-mono font-semibold tracking-wider text-primary uppercase mb-3">
            Simple 3-Step Execution
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            How NexOps works in your toolchain
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-zinc-950/90 border border-zinc-800/80 relative flex flex-col justify-between group hover:border-primary/50 transition-all duration-300 shadow-xl"
            >
              <div>
                <div className="text-4xl font-extrabold font-mono text-zinc-700 group-hover:text-primary transition-colors duration-300 mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-400 font-normal leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

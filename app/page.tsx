'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppState } from '@/lib/hooks/use-app-state'

import { SiteHeader } from '@/components/landing/site-header'
import { HeroPrimary } from '@/components/landing/hero-primary'
import { BenefitGrid } from '@/components/landing/benefit-grid'
import { FlagshipProductShowcase } from '@/components/landing/flagship-product-showcase'
import { BackwardCorrelationBand } from '@/components/landing/backward-correlation-band'
import { BlastRadiusBand } from '@/components/landing/blast-radius-band'
import { ProductPreviewRail } from '@/components/landing/product-preview-rail'
import { HowItWorksStrip } from '@/components/landing/how-it-works-strip'
import { IntegrationMarks } from '@/components/landing/integration-marks'
import { FaqAccordion } from '@/components/landing/faq-accordion'
import { FinalCtaBanner } from '@/components/landing/final-cta-banner'
import { SlimFooter } from '@/components/landing/slim-footer'

export default function LandingPage() {
  const router = useRouter()
  const { isAuthenticated } = useAppState()

  // Redirect authenticated users immediately to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-primary-foreground font-sans antialiased">
      {/* 1. Sticky Header */}
      <SiteHeader />

      <main>
        {/* 2. Primary Hero */}
        <HeroPrimary />

        {/* 3. Benefit Grid (4 text-led cards) */}
        <BenefitGrid />

        {/* 4. Flagship Product Showcase */}
        <FlagshipProductShowcase />

        {/* 5. Feature Bands (Exactly 2: Backward Correlation & Blast Radius) */}
        <BackwardCorrelationBand />
        <BlastRadiusBand />

        {/* 6. Product Preview Rail */}
        <ProductPreviewRail />

        {/* 7. How It Works Strip (3 steps) */}
        <HowItWorksStrip />

        {/* 8. Integration Marks (GitHub & PagerDuty) */}
        <IntegrationMarks />

        {/* 10. FAQ Accordion (Testimonials omitted per spec) */}
        <FaqAccordion />

        {/* 11. Final CTA Banner */}
        <FinalCtaBanner />
      </main>

      {/* 12. Slim Footer */}
      <SlimFooter />
    </div>
  )
}

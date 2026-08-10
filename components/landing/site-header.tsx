'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { NexOpsLogo } from '@/components/ui/nexops-logo'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function SiteHeader() {
  const [visible, setVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Set scrolled state for background backdrop blur
      setScrolled(currentScrollY > 20)

      // Always visible near top of page
      if (currentScrollY <= 20) {
        setVisible(true)
      } else {
        // Hide when scrolling down (forward), show when scrolling up (backward)
        if (currentScrollY > lastScrollY.current + 5) {
          setVisible(false)
        } else if (currentScrollY < lastScrollY.current - 5) {
          setVisible(true)
        }
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      } ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Wordmark Left */}
        <Link href="/" className="flex items-center group">
          <NexOpsLogo size="md" showText={true} className="transition-transform group-hover:scale-105" />
        </Link>

        {/* Minimal Nav Center */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-300">
          <a
            href="#product"
            className="hover:text-white transition-colors duration-200"
          >
            Product
          </a>
          <a
            href="#how-it-works"
            className="hover:text-white transition-colors duration-200"
          >
            How it works
          </a>
          <a
            href="#faq"
            className="hover:text-white transition-colors duration-200"
          >
            FAQ
          </a>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-4">
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2 rounded-lg transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40"
          >
            <Link href="/login" className="flex items-center gap-2">
              <span>Join the pilot</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

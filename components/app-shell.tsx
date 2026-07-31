'use client'

import { ReactNode, useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { TopNav } from './top-nav'
import { PageLayout } from './layout'
import { useAppState } from '@/lib/hooks/use-app-state'
import { Loader2 } from 'lucide-react'

import { useRealtime } from '@/lib/hooks/use-realtime'

/**
 * Main application shell wrapper
 * Handles authentication redirection, top navigation, sidebar, and layout structure
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, onboardingComplete, authLoading } = useAppState()

  // Initialize global real-time WebSocket connection
  useRealtime()

  const isPreApp = ['/', '/login', '/onboarding', '/terms', '/privacy'].includes(pathname)
  const isStandalonePublic = ['/terms', '/privacy'].includes(pathname)
  
  // Synchronous check to see if a redirect is pending
  const isRedirecting = !authLoading && (
    (!isAuthenticated && (!isPreApp || pathname === '/onboarding')) ||
    (isAuthenticated && !onboardingComplete && pathname !== '/onboarding' && !isStandalonePublic) ||
    (isAuthenticated && onboardingComplete && ['/', '/login', '/onboarding'].includes(pathname))
  )

  const [checkingAuth, setCheckingAuth] = useState(() => authLoading || isRedirecting)

  useEffect(() => {
    if (authLoading) {
      setCheckingAuth(true)
      return
    }

    const checkAuthAndRedirect = () => {
      if (!isAuthenticated) {
        if (!isPreApp || pathname === '/onboarding') {
          router.replace('/login')
          return
        }
      } else {
        if (!onboardingComplete) {
          if (pathname !== '/onboarding' && !isStandalonePublic) {
            router.replace('/onboarding')
            return
          }
        } else {
          if (['/', '/login', '/onboarding'].includes(pathname)) {
            router.replace('/dashboard')
            return
          }
        }
      }
      
      setCheckingAuth(false)
    }

    checkAuthAndRedirect()
  }, [pathname, isAuthenticated, onboardingComplete, router, isPreApp, isStandalonePublic, authLoading])


  // Avoid flash of wrong content: render loading state during redirects or auth checks
  if (isRedirecting || checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-xl font-black text-primary-foreground">N</span>
        </div>
        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        <p className="text-xs text-muted-foreground">Redirecting...</p>
      </div>
    )
  }

  if (isPreApp) {
    return <>{children}</>
  }

  return (
    <>
      <TopNav />
      <PageLayout>
        {children}
      </PageLayout>
    </>
  )
}

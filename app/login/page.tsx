'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppState } from '@/lib/hooks/use-app-state'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Github, Chrome, ArrowRight, ShieldAlert, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, githubProvider, googleProvider } from '@/lib/firebase'

import { TermsGateModal } from '@/components/terms-gate-modal'
import { NexOpsLogo } from '@/components/ui/nexops-logo'

type AuthProvider = 'GitHub' | 'Google' | 'email' | null

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, onboardingComplete } = useAppState()
  const [email, setEmail] = useState('')
  const [activeProvider, setActiveProvider] = useState<AuthProvider>(null)
  const [transitioning, setTransitioning] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [showTermsModal, setShowTermsModal] = useState(false)

  const loading = activeProvider !== null

  const proceedToApp = (isComplete: boolean) => {
    if (isComplete) {
      router.push('/dashboard')
    } else {
      router.push('/onboarding')
    }
  }

  // Automatically check terms acknowledgment after successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      setTransitioning(true)

      async function checkTermsStatus() {
        try {
          const { apiFetch } = await import('@/lib/api-client')
          const statusData = await apiFetch('/integrations/status') as { terms_acknowledged: boolean }
          if (!statusData.terms_acknowledged) {
            setShowTermsModal(true)
            setTransitioning(false)
          } else {
            proceedToApp(onboardingComplete)
          }
        } catch (err) {
          console.error('Failed to check terms status:', err)
          setShowTermsModal(true)
          setTransitioning(false)
        }
      }

      checkTermsStatus()
    } else {
      setTransitioning(false)
      setShowTermsModal(false)
    }
  }, [isAuthenticated, onboardingComplete, router])

  const handleTermsSuccess = () => {
    setShowTermsModal(false)
    setTransitioning(true)
    proceedToApp(onboardingComplete)
  }

  const handleLogin = async (provider: AuthProvider) => {
    if (loading) return
    setActiveProvider(provider)
    setEmailError('')

    try {
      if (provider === 'GitHub') {
        await signInWithPopup(auth, githubProvider)
      } else if (provider === 'Google') {
        await signInWithPopup(auth, googleProvider)
      }
    } catch (err: any) {
      console.error(`${provider} Login failed:`, err)
      setEmailError(err.message || `${provider} authentication failed.`)
      setActiveProvider(null)
    }
  }

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')

    if (!email.trim()) {
      setEmailError('Please enter your work email to continue.')
      return
    }

    setActiveProvider('email')
    try {
      // Try signing in with a default local development password
      await signInWithEmailAndPassword(auth, email, 'password123')
    } catch (signInErr: any) {
      // If user doesn't exist or credentials fail, try to sign them up automatically
      if (
        signInErr.code === 'auth/user-not-found' || 
        signInErr.code === 'auth/invalid-credential' || 
        signInErr.code === 'auth/invalid-email'
      ) {
        try {
          await createUserWithEmailAndPassword(auth, email, 'password123')
        } catch (signUpErr: any) {
          console.error('Email sign up failed:', signUpErr)
          setEmailError(signUpErr.message || 'Auto-registration failed.')
          setActiveProvider(null)
        }
      } else {
        console.error('Email sign in failed:', signInErr)
        setEmailError(signInErr.message || 'Email authentication failed.')
        setActiveProvider(null)
      }
    }
  }

  // Full-screen transition overlay
  if (transitioning) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-4 animate-in fade-in duration-300">
        <NexOpsLogo size="xl" className="h-12" />
        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        <p className="text-xs text-muted-foreground">Setting up your workspace…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <div className={cn(
        "w-full max-w-[420px] space-y-6 z-10 transition-all duration-300",
        loading && "opacity-95"
      )}>
        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <NexOpsLogo size="xl" className="h-12" />
          <h1 className="text-2xl font-bold tracking-tight mt-4">Welcome to NexOps</h1>
          <p className="text-sm text-muted-foreground max-w-sm">
            Sign in to start correlating alerts, changes, and service graphs in real time.
          </p>
        </div>

        {/* Auth card */}
        <Card className="p-6 border border-border/80 backdrop-blur-md bg-card/50 shadow-2xl space-y-6">
          <div className="space-y-3">
            {/* Github SSO */}
            <Button
              variant="outline"
              className="w-full h-11 justify-center gap-3 font-medium border-border hover:bg-muted/80 transition-all"
              onClick={() => handleLogin('GitHub')}
              disabled={loading}
            >
              {activeProvider === 'GitHub' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">Connecting to GitHub…</span>
                </>
              ) : (
                <>
                  <Github className="w-5 h-5 text-foreground" />
                  Continue with GitHub
                </>
              )}
            </Button>

            {/* Google SSO */}
            <Button
              variant="outline"
              className="w-full h-11 justify-center gap-3 font-medium border-border hover:bg-muted/80 transition-all"
              onClick={() => handleLogin('Google')}
              disabled={loading}
            >
              {activeProvider === 'Google' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">Connecting to Google…</span>
                </>
              ) : (
                <>
                  <Chrome className="w-5 h-5 text-foreground" />
                  Continue with Google
                </>
              )}
            </Button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border/60"></div>
            <span className="flex-shrink mx-4 text-xs text-muted-foreground uppercase font-semibold tracking-wider">
              or continue with
            </span>
            <div className="flex-grow border-t border-border/60"></div>
          </div>

          {/* Email Form Option */}
          <form onSubmit={handleSubmitEmail} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Work Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailError) setEmailError('')
                }}
                className={cn(
                  "h-11 bg-background/50 border-border",
                  emailError && "border-destructive focus-visible:ring-destructive/30"
                )}
                disabled={loading}
              />
              {emailError && (
                <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                  {emailError}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-11 font-medium gap-2 text-sm shadow-lg shadow-primary/10"
              disabled={loading}
            >
              {activeProvider === 'email' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating…
                </>
              ) : (
                <>
                  Sign In with Email
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Bottom helper info */}
        <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5 p-2 bg-muted/20 border border-border/30 rounded-lg">
          <ShieldAlert className="w-3.5 h-3.5 text-primary" />
          <span>Real Firebase Auth integration is active.</span>
        </div>
      </div>

      {/* Post-Authentication Terms of Service & Privacy Notice Gate Modal */}
      <TermsGateModal
        isOpen={showTermsModal}
        onSuccess={handleTermsSuccess}
      />
    </div>
  )
}


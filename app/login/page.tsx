'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAppState } from '@/lib/hooks/use-app-state'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Github, Chrome, ArrowRight, Loader2, ArrowLeft, RefreshCw, KeyRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signInWithPopup, signInWithCustomToken } from 'firebase/auth'
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

  // 2-Step OTP State
  const [otpStep, setOtpStep] = useState<'email' | 'code'>('email')
  const [otpCode, setOtpCode] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const loading = activeProvider !== null || sendingOtp || verifyingOtp

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setTimeout(() => setCooldown((c) => c - 1), 1000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [cooldown])

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

  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setEmailError('')

    const emailTrimmed = email.trim().toLowerCase()
    if (!emailTrimmed || !emailTrimmed.includes('@')) {
      setEmailError('Please enter a valid work email address.')
      return
    }

    setSendingOtp(true)
    try {
      const { apiFetch } = await import('@/lib/api-client')
      const res = await apiFetch('/auth/otp/request', {
        method: 'POST',
        body: JSON.stringify({ email: emailTrimmed })
      }) as { status: string; cooldown_seconds: number; dev_code?: string }

      setOtpStep('code')
      setCooldown(res.cooldown_seconds || 60)
      if (res.dev_code) {
        console.log(`[Dev OTP Code for ${emailTrimmed}]: ${res.dev_code}`)
      }
    } catch (err: any) {
      console.error('Failed to request OTP:', err)
      setEmailError(err.message || 'Failed to send verification code. Please check your email.')
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')

    const codeTrimmed = otpCode.trim()
    if (codeTrimmed.length !== 6 || !/^\d+$/.test(codeTrimmed)) {
      setEmailError('Please enter the 6-digit numeric verification code.')
      return
    }

    setVerifyingOtp(true)
    setActiveProvider('email')
    try {
      const { apiFetch } = await import('@/lib/api-client')
      const res = await apiFetch('/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: codeTrimmed
        })
      }) as { custom_token: string }

      await signInWithCustomToken(auth, res.custom_token)
    } catch (err: any) {
      console.error('OTP Verification failed:', err)
      setEmailError(err.message || 'Invalid or expired verification code.')
      setActiveProvider(null)
    } finally {
      setVerifyingOtp(false)
    }
  }

  // Full-screen transition overlay
  if (transitioning) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-4 animate-in fade-in duration-300">
        <NexOpsLogo size="xl" showText={false} />
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
          <NexOpsLogo size="xl" showText={false} />
          <h1 className="text-2xl font-bold tracking-tight mt-4">Welcome to NexOps</h1>
          <p className="text-sm text-muted-foreground max-w-sm">
            Sign in to start correlating alerts, changes, and service graphs in real time.
          </p>
        </div>

        {/* Auth card */}
        <Card className="p-6 border border-border/80 backdrop-blur-md bg-card/50 shadow-2xl space-y-6">
          {otpStep === 'email' ? (
            <>
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

              {/* Email Form Step 1: Request OTP */}
              <form onSubmit={handleRequestOtp} className="space-y-4">
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
                    <p className="text-xs text-destructive mt-1.5 flex items-center gap-1 font-medium">
                      {emailError}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 font-medium gap-2 text-sm shadow-lg shadow-primary/10"
                  disabled={loading}
                >
                  {sendingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending Code…
                    </>
                  ) : (
                    <>
                      Send Verification Code
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            /* Email Form Step 2: Verify 6-digit OTP */
            <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="space-y-2 text-center">
                <div className="inline-flex p-2.5 rounded-full bg-primary/10 text-primary mb-1">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Enter Verification Code</h3>
                <p className="text-xs text-muted-foreground">
                  We sent a 6-digit code to <span className="font-semibold text-foreground">{email}</span>.
                </p>
              </div>

              <div className="space-y-1.5">
                <Input
                  type="text"
                  maxLength={6}
                  placeholder="849201"
                  value={otpCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setOtpCode(val)
                    if (emailError) setEmailError('')
                  }}
                  className={cn(
                    "h-12 text-center text-xl font-mono tracking-[0.5em] bg-background/50 border-border font-bold",
                    emailError && "border-destructive focus-visible:ring-destructive/30"
                  )}
                  disabled={loading}
                  autoFocus
                />
                {emailError && (
                  <p className="text-xs text-destructive text-center mt-1.5 font-medium">
                    {emailError}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 font-medium gap-2 text-sm shadow-lg shadow-primary/10"
                disabled={loading || otpCode.length !== 6}
              >
                {verifyingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying Code…
                  </>
                ) : (
                  <>
                    Verify & Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-between pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep('email')
                    setOtpCode('')
                    setEmailError('')
                  }}
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change email
                </button>

                <button
                  type="button"
                  disabled={cooldown > 0 || sendingOtp}
                  onClick={() => handleRequestOtp()}
                  className={cn(
                    "inline-flex items-center gap-1 font-medium",
                    cooldown > 0 ? "text-muted-foreground/60 cursor-not-allowed" : "text-primary hover:underline"
                  )}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                </button>
              </div>
            </form>
          )}
        </Card>
      </div>

      {/* Post-Authentication Terms of Service & Privacy Notice Gate Modal */}
      <TermsGateModal
        isOpen={showTermsModal}
        onSuccess={handleTermsSuccess}
      />
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShieldCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TermsGateModalProps {
  isOpen: boolean
  onSuccess: () => void
  onCancel?: () => void
  showCancelButton?: boolean
}

export function TermsGateModal({
  isOpen,
  onSuccess,
  onCancel,
  showCancelButton = false,
}: TermsGateModalProps) {
  const [termsAcceptedCheckbox, setTermsAcceptedCheckbox] = useState(false)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [acknowledgingTerms, setAcknowledgingTerms] = useState(false)

  if (!isOpen) return null

  const handleTermsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const maxScroll = scrollHeight - clientHeight
    if (maxScroll > 0) {
      const pct = Math.min(100, Math.round((scrollTop / maxScroll) * 100))
      setScrollProgress(pct)
      if (maxScroll - scrollTop <= 25) {
        setHasScrolledToBottom(true)
      }
    } else {
      setHasScrolledToBottom(true)
      setScrollProgress(100)
    }
  }

  const handleConfirmAcknowledgment = async () => {
    if (!hasScrolledToBottom || !termsAcceptedCheckbox) return
    setAcknowledgingTerms(true)
    try {
      const { apiFetch } = await import('@/lib/api-client')
      await apiFetch('/integrations/terms/acknowledge', { method: 'POST' })
      onSuccess()
    } catch (err) {
      console.error('Failed to acknowledge terms:', err)
      alert('Failed to record agreement. Please try again.')
    } finally {
      setAcknowledgingTerms(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-card border border-border rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
        <div className="space-y-1.5 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> One-Time Workspace Requirement
          </div>
          <h3 className="text-xl font-bold text-foreground">
            Pilot Program Agreement & Privacy Notice
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Scroll to the very bottom of the agreement panel below to review both documents in full and unlock the acknowledgment checkbox before entering your workspace.
          </p>
        </div>

        {/* Scroll Indicator & Progress Bar */}
        <div className="flex items-center justify-between text-xs font-mono font-semibold px-1 pt-1">
          <span className={cn('flex items-center gap-1.5', hasScrolledToBottom ? 'text-emerald-500 font-bold' : 'text-amber-500')}>
            {hasScrolledToBottom ? '✓ Document Reviewed (100%)' : `Scroll to bottom to unlock (${scrollProgress}%)`}
          </span>
          <span className="text-muted-foreground text-[11px]">
            {hasScrolledToBottom ? 'Checkbox Unlocked' : 'Checkbox Locked 🔒'}
          </span>
        </div>

        {/* Option A Inline Scroll Panel */}
        <div
          onScroll={handleTermsScroll}
          className="max-h-72 overflow-y-auto border border-border/80 rounded-lg p-5 bg-muted/20 space-y-6 text-xs sm:text-sm text-foreground/90 leading-relaxed scrollbar-thin select-text text-left"
        >
          {/* SECTION 1: PILOT PROGRAM AGREEMENT */}
          <div className="space-y-3">
            <div className="border-b border-border/60 pb-2">
              <h4 className="font-bold text-foreground text-sm uppercase tracking-wide">
                Part I — Pilot Program Agreement
              </h4>
              <p className="text-[11px] text-muted-foreground">Effective Version: v1.0 • NexOps Platform</p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-foreground">1. What this covers</p>
              <p className="text-muted-foreground">
                This agreement covers your ("Participant") use of NexOps ("the Product"), operated by NexOps Platform ("we", "us"), during an unpaid pilot period. It's meant to set clear, honest expectations for both sides while the product is still early.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-foreground">2. What the pilot is</p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li><strong>Free of charge:</strong> No payment is requested or expected during the pilot.</li>
                <li>You connect your GitHub organization and PagerDuty account so NexOps can read deploy and incident data and surface likely causes for incidents.</li>
                <li>In exchange, we ask for honest feedback and real usage — specifically, using the confirm/reject controls on suggested causes when you have a real incident.</li>
                <li>Either side can end the pilot at any time, for any reason, with reasonable notice.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-foreground">3. What data we access, and why</p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li><strong>GitHub:</strong> repository metadata, deploy/commit history, and CODEOWNERS-derived ownership — used to build the dependency graph and correlation logic.</li>
                <li><strong>PagerDuty:</strong> incident trigger/acknowledge/resolve events — used to detect incidents and match them against recent deploys.</li>
                <li>We do not access source code contents, secrets, or repository file contents beyond what's needed for deploy/dependency metadata.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-foreground">4. Liability & Promises</p>
              <p className="text-muted-foreground">
                The Product is provided "as is" during the pilot period without warranties of any kind. NexOps surfaces likely cause suggestions with visible reasoning — a human should always confirm a suggested cause before taking production actions.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-foreground">5. Confidentiality & Contact</p>
              <p className="text-muted-foreground">
                We will not share your repository names or incident data with third parties. Questions about this agreement: <span className="text-primary underline">akaashgithub21@gmail.com</span>.
              </p>
            </div>
          </div>

          {/* SECTION 2: PRIVACY NOTICE */}
          <div className="space-y-3 pt-4 border-t border-border/60">
            <div className="border-b border-border/60 pb-2">
              <h4 className="font-bold text-foreground text-sm uppercase tracking-wide">
                Part II — Privacy Notice
              </h4>
              <p className="text-[11px] text-muted-foreground">NexOps Platform Data Protection</p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-foreground">1. Data Collection & Usage</p>
              <p className="text-muted-foreground">
                We collect account identifiers (name, email), authorized integration metadata, and confirm/reject feedback metrics to compute workspace-specific scoring weights. We do not sell your data or train public AI models on your inputs.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-foreground">2. Security & Retention</p>
              <p className="text-muted-foreground">
                We enforce PostgreSQL Row-Level Security (RLS) tenant isolation and Fernet secret encryption. Data is retained for active pilot workspaces and deleted within 30 days upon request or pilot termination.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/40 text-center">
              <p className="font-bold text-emerald-500 text-xs">
                --- END OF AGREEMENT & PRIVACY NOTICE ---
              </p>
            </div>
          </div>
        </div>

        {/* Checkbox Container */}
        <div className={cn(
          'p-3.5 rounded-lg border transition-all duration-200 text-left',
          hasScrolledToBottom
            ? 'border-emerald-500/50 bg-emerald-500/5'
            : 'border-border/60 bg-muted/20 opacity-75'
        )}>
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms-checkbox"
              disabled={!hasScrolledToBottom}
              checked={termsAcceptedCheckbox}
              onChange={(e) => setTermsAcceptedCheckbox(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            />
            <label
              htmlFor="terms-checkbox"
              className={cn(
                'text-xs font-medium leading-relaxed select-none',
                hasScrolledToBottom ? 'cursor-pointer text-foreground' : 'cursor-not-allowed text-muted-foreground'
              )}
            >
              {hasScrolledToBottom ? (
                <span>
                  I have read and agree to the <strong>Pilot Program Agreement</strong> and <strong>Privacy Notice</strong> above.
                </span>
              ) : (
                <span className="text-amber-500/90 font-medium">
                  🔒 Checkbox disabled — Please scroll to the very bottom of the document box above to enable this checkbox.
                </span>
              )}
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="text-[11px] text-muted-foreground">
            <Link href="/terms" target="_blank" className="hover:underline text-primary">Open Terms Page</Link> • <Link href="/privacy" target="_blank" className="hover:underline text-primary">Open Privacy Page</Link>
          </div>
          <div className="flex gap-2">
            {showCancelButton && onCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <Button
              size="sm"
              className="font-semibold px-6 gap-2"
              disabled={!hasScrolledToBottom || !termsAcceptedCheckbox || acknowledgingTerms}
              onClick={handleConfirmAcknowledgment}
            >
              {acknowledgingTerms ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm & Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

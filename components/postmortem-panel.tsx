'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, CheckCircle, Save, Loader2, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

import { apiFetch } from '@/lib/api-client'

interface PostmortemData {
  id: string
  incident_id: string
  workspace_id: string
  author_id?: string
  summary?: string
  timeline?: string
  root_cause?: string
  contributing_factors?: string
  impact?: string
  action_items?: string
  lessons_learned?: string
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

interface PostmortemPanelProps {
  incidentId: string
  incidentStatus: string
}

export function PostmortemPanel({ incidentId, incidentStatus }: PostmortemPanelProps) {
  const [data, setData] = useState<PostmortemData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [publishing, setPublishing] = useState<boolean>(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle')
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch postmortem on mount
  useEffect(() => {
    let isMounted = true
    async function fetchPostmortem() {
      try {
        setLoading(true)
        const pmData: PostmortemData = await apiFetch(`/incidents/${incidentId}/postmortem`)
        if (isMounted) {
          setData(pmData)
        }
      } catch (err: any) {
        if (isMounted) setError(err?.message || 'Failed to load postmortem document')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (incidentStatus === 'resolved') {
      fetchPostmortem()
    }

    return () => {
      isMounted = false
    }
  }, [incidentId, incidentStatus])

  // Debounced auto-save function
  const savePostmortemPatch = useCallback(async (fieldsToUpdate: Partial<PostmortemData>) => {
    try {
      setSaving(true)
      setSaveStatus('saving')
      const updated: PostmortemData = await apiFetch(`/incidents/${incidentId}/postmortem`, {
        method: 'PATCH',
        body: JSON.stringify(fieldsToUpdate),
      })
      setData((prev) => (prev ? { ...prev, ...updated } : updated))
      setSaveStatus('saved')
    } catch (err) {
      console.error('Auto-save error:', err)
    } finally {
      setSaving(false)
    }
  }, [incidentId])

  const handleFieldChange = (field: keyof PostmortemData, value: string) => {
    if (!data) return
    const newData = { ...data, [field]: value }
    setData(newData)
    setSaveStatus('idle')

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      savePostmortemPatch({ [field]: value })
    }, 1000)
  }

  const handlePublish = async () => {
    if (!data?.summary || !data?.root_cause) return
    try {
      setPublishing(true)
      const published: PostmortemData = await apiFetch(`/incidents/${incidentId}/postmortem/publish`, {
        method: 'POST',
      })
      setData((prev) => (prev ? { ...prev, ...published } : published))
    } catch (err: any) {
      alert(err?.message || 'Error publishing postmortem')
    } finally {
      setPublishing(false)
    }
  }

  // Only render for resolved incidents
  if (incidentStatus !== 'resolved') {
    return null
  }

  if (loading) {
    return (
      <Card className="p-6 flex items-center justify-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading Incident Postmortem...</span>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6 border-destructive/20 bg-destructive/5">
        <p className="text-sm text-destructive font-medium">{error}</p>
      </Card>
    )
  }

  const isPublished = data?.status === 'published'
  const canPublish = Boolean(data?.summary?.trim() && data?.root_cause?.trim() && !isPublished)

  return (
    <Card className="p-6 space-y-5 border-border bg-card/60">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Incident Postmortem</h2>
          <Badge
            variant="outline"
            className={cn(
              'text-xs font-semibold uppercase tracking-wider',
              isPublished
                ? 'bg-success/10 text-success border-success/30'
                : 'bg-warning/10 text-warning border-warning/30'
            )}
          >
            {isPublished ? 'Published' : 'Draft'}
          </Badge>
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" /> Saving changes...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1 text-xs text-success">
              <CheckCircle className="w-3 h-3" /> Auto-saved
            </span>
          )}
        </div>

        <Button
          size="sm"
          disabled={!canPublish || publishing}
          onClick={handlePublish}
          className={cn(
            'gap-2 font-semibold',
            isPublished
              ? 'bg-success/20 text-success hover:bg-success/20 cursor-default'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          )}
        >
          {publishing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isPublished ? (
            <>
              <CheckCircle className="w-4 h-4" /> Published
            </>
          ) : (
            <>
              <Send className="w-4 h-4" /> Publish Postmortem
            </>
          )}
        </Button>
      </div>

      <div className="space-y-4">
        {/* Executive Summary */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Executive Summary <span className="text-destructive">*</span>
          </label>
          <textarea
            value={data?.summary || ''}
            onChange={(e) => handleFieldChange('summary', e.target.value)}
            placeholder="High-level description of what failed, duration, and resolution..."
            rows={3}
            disabled={isPublished}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-80 resize-y"
          />
        </div>

        {/* Root Cause (Pre-filled from confirmed candidate cause) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Root Cause & Reasoning Diagnosis <span className="text-destructive">*</span>
            </label>
            {data?.root_cause && (
              <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                Pre-filled from Candidate Cause Score
              </Badge>
            )}
          </div>
          <textarea
            value={data?.root_cause || ''}
            onChange={(e) => handleFieldChange('root_cause', e.target.value)}
            placeholder="Detailed technical explanation of the root cause..."
            rows={3}
            disabled={isPublished}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground font-mono text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-80 resize-y"
          />
        </div>

        {/* Two-column layout for Impact & Contributing Factors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Customer & System Impact
            </label>
            <textarea
              value={data?.impact || ''}
              onChange={(e) => handleFieldChange('impact', e.target.value)}
              placeholder="Number of affected users, latency degradation, error rates..."
              rows={3}
              disabled={isPublished}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-80 resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Contributing Factors
            </label>
            <textarea
              value={data?.contributing_factors || ''}
              onChange={(e) => handleFieldChange('contributing_factors', e.target.value)}
              placeholder="Deployments, infrastructure load, external service dependencies..."
              rows={3}
              disabled={isPublished}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-80 resize-y"
            />
          </div>
        </div>

        {/* Two-column layout for Action Items & Lessons Learned */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Corrective Action Items
            </label>
            <textarea
              value={data?.action_items || ''}
              onChange={(e) => handleFieldChange('action_items', e.target.value)}
              placeholder="Preventive code fixes, automated rollback triggers, alerting updates..."
              rows={3}
              disabled={isPublished}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-80 resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Lessons Learned
            </label>
            <textarea
              value={data?.lessons_learned || ''}
              onChange={(e) => handleFieldChange('lessons_learned', e.target.value)}
              placeholder="Key architectural and operational takeaways..."
              rows={3}
              disabled={isPublished}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-80 resize-y"
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

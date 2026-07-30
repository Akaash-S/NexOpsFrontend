'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, Save, Send, CheckCircle2, AlertCircle, FileText } from 'lucide-react'
import { apiFetch } from '@/lib/api-client'
import { cn } from '@/lib/utils'

interface PostmortemEditorProps {
  incidentId: string | null
  incidentTitle?: string
  open: boolean
  onClose: () => void
  onSaved?: () => void
}

export function PostmortemEditor({
  incidentId,
  incidentTitle,
  open,
  onClose,
  onSaved,
}: PostmortemEditorProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const [form, setForm] = useState({
    summary: '',
    timeline: '',
    root_cause: '',
    contributing_factors: '',
    impact: '',
    action_items: '',
    lessons_learned: '',
    status: 'draft',
  })

  useEffect(() => {
    if (!open || !incidentId) return

    async function loadPostmortem() {
      setLoading(true)
      setError(null)
      setSuccessMsg(null)
      try {
        const data = await apiFetch(`/incidents/${incidentId}/postmortem`)
        setForm({
          summary: data.summary || '',
          timeline: data.timeline || '',
          root_cause: data.root_cause || '',
          contributing_factors: data.contributing_factors || '',
          impact: data.impact || '',
          action_items: data.action_items || '',
          lessons_learned: data.lessons_learned || '',
          status: data.status || 'draft',
        })
      } catch (err: any) {
        console.error('Failed to fetch postmortem:', err)
        setError(err.message || 'Failed to load postmortem.')
      } finally {
        setLoading(false)
      }
    }

    loadPostmortem()
  }, [open, incidentId])

  const handleSave = async () => {
    if (!incidentId) return
    setSaving(true)
    setError(null)
    setSuccessMsg(null)

    try {
      const updated = await apiFetch(`/incidents/${incidentId}/postmortem`, {
        method: 'PATCH',
        body: JSON.stringify({
          summary: form.summary,
          timeline: form.timeline,
          root_cause: form.root_cause,
          contributing_factors: form.contributing_factors,
          impact: form.impact,
          action_items: form.action_items,
          lessons_learned: form.lessons_learned,
        }),
      })

      setForm((prev) => ({ ...prev, status: updated.status || prev.status }))
      setSuccessMsg('Draft saved successfully.')
      if (onSaved) onSaved()
    } catch (err: any) {
      console.error('Failed to save postmortem:', err)
      setError(err.message || 'Failed to save draft.')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!incidentId) return
    setPublishing(true)
    setError(null)
    setSuccessMsg(null)

    try {
      // Save first to ensure server has latest fields
      await apiFetch(`/incidents/${incidentId}/postmortem`, {
        method: 'PATCH',
        body: JSON.stringify({
          summary: form.summary,
          timeline: form.timeline,
          root_cause: form.root_cause,
          contributing_factors: form.contributing_factors,
          impact: form.impact,
          action_items: form.action_items,
          lessons_learned: form.lessons_learned,
        }),
      })

      const updated = await apiFetch(`/incidents/${incidentId}/postmortem/publish`, {
        method: 'POST',
      })

      setForm((prev) => ({ ...prev, status: 'published' }))
      setSuccessMsg('Postmortem published successfully.')
      if (onSaved) onSaved()
    } catch (err: any) {
      console.error('Failed to publish postmortem:', err)
      setError(err.message || 'Validation failed. Check required fields (Summary, Root Cause).')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Postmortem Report
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                {incidentTitle ? `Incident: ${incidentTitle}` : 'Structured incident retrospective & root cause analysis'}
              </DialogDescription>
            </div>
            <Badge
              variant={form.status === 'published' ? 'default' : 'outline'}
              className={cn(
                'capitalize text-xs font-semibold px-2.5 py-1',
                form.status === 'published'
                  ? 'bg-success/20 text-success border-success/30'
                  : 'bg-warning/10 text-warning border-warning/30'
              )}
            >
              {form.status === 'published' ? 'Published' : 'Draft'}
            </Badge>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-5 py-4 pr-1">
            {error && (
              <div className="p-3 text-xs rounded-md bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 text-xs rounded-md bg-success/10 text-success border border-success/20 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Executive Summary */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Executive Summary <span className="text-destructive">*</span>
              </Label>
              <Textarea
                placeholder="High-level overview of what happened, key impact, and resolution..."
                rows={3}
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="text-sm"
              />
            </div>

            {/* Root Cause */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Root Cause Analysis <span className="text-destructive">*</span>
              </Label>
              <Textarea
                placeholder="Technical root cause identified through investigation..."
                rows={3}
                value={form.root_cause}
                onChange={(e) => setForm({ ...form, root_cause: e.target.value })}
                className="text-sm font-mono"
              />
            </div>

            {/* Timeline */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Incident Timeline</Label>
              <Textarea
                placeholder="HH:MM UTC - Alert triggered&#10;HH:MM UTC - On-call engaged&#10;HH:MM UTC - Fix deployed..."
                rows={4}
                value={form.timeline}
                onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                className="text-sm font-mono"
              />
            </div>

            {/* Grid 2-col for Contributing Factors & Impact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Contributing Factors</Label>
                <Textarea
                  placeholder="Secondary causes, missing monitoring, delayed escalation..."
                  rows={3}
                  value={form.contributing_factors}
                  onChange={(e) => setForm({ ...form, contributing_factors: e.target.value })}
                  className="text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Impact Assessment</Label>
                <Textarea
                  placeholder="Users impacted, SLA breaches, data loss status..."
                  rows={3}
                  value={form.impact}
                  onChange={(e) => setForm({ ...form, impact: e.target.value })}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Grid 2-col for Action Items & Lessons Learned */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Corrective Action Items</Label>
                <Textarea
                  placeholder="- [ ] Add retry logic to auth client&#10;- [ ] Improve alerting threshold..."
                  rows={3}
                  value={form.action_items}
                  onChange={(e) => setForm({ ...form, action_items: e.target.value })}
                  className="text-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Lessons Learned</Label>
                <Textarea
                  placeholder="What went well, what could be improved for next time..."
                  rows={3}
                  value={form.lessons_learned}
                  onChange={(e) => setForm({ ...form, lessons_learned: e.target.value })}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="border-t pt-4 flex items-center justify-between gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSave}
              disabled={loading || saving || publishing}
              className="gap-1.5"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save Draft
            </Button>
            <Button
              size="sm"
              onClick={handlePublish}
              disabled={loading || saving || publishing || form.status === 'published'}
              className="gap-1.5"
            >
              {publishing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              {form.status === 'published' ? 'Published' : 'Publish Report'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { cn } from '@/lib/utils'

interface InvestigationWorkspaceProps {
  mainContent: React.ReactNode
  intelligencePanel: React.ReactNode
  className?: string
}

/**
 * Two-panel layout for investigation workflows
 * Main content: 70% | Intelligence panel: 30%
 */
export function InvestigationWorkspace({
  mainContent,
  intelligencePanel,
  className,
}: InvestigationWorkspaceProps) {
  return (
    <div className={cn('flex h-full gap-6', className)}>
      {/* Main Content - 70% */}
      <div className="flex-1 overflow-auto">
        {mainContent}
      </div>

      {/* Intelligence Panel - 30% */}
      <div className="hidden lg:flex lg:w-[30%] flex-col rounded-lg border border-border bg-card p-6 overflow-auto">
        {intelligencePanel}
      </div>
    </div>
  )
}

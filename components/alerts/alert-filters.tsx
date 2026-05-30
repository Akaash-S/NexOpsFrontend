'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface AlertFiltersProps {
  severityFilter: string
  statusFilter: string
  onSeverityChange: (filter: string) => void
  onStatusChange: (filter: string) => void
}

const SEVERITY_OPTIONS = ['all', 'critical', 'high', 'medium', 'low']
const STATUS_OPTIONS = ['all', 'firing', 'resolved']

export function AlertFilters({
  severityFilter,
  statusFilter,
  onSeverityChange,
  onStatusChange,
}: AlertFiltersProps) {
  return (
    <Card className="p-4 mb-8">
      <div className="grid grid-cols-2 gap-6">
        {/* Severity */}
        <div>
          <h3 className="font-semibold mb-3">Severity</h3>
          <div className="flex flex-wrap gap-2">
            {SEVERITY_OPTIONS.map((option) => (
              <Button
                key={option}
                variant={severityFilter === option ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSeverityChange(option)}
                className="capitalize"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <h3 className="font-semibold mb-3">Status</h3>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((option) => (
              <Button
                key={option}
                variant={statusFilter === option ? 'default' : 'outline'}
                size="sm"
                onClick={() => onStatusChange(option)}
                className="capitalize"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

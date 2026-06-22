'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Search, ZoomIn, ZoomOut, ArrowDown, ArrowUp } from 'lucide-react'

interface DependencyControlsProps {
  impactMode: boolean
  onImpactModeChange: (value: boolean) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function DependencyControls({
  impactMode,
  onImpactModeChange,
  searchQuery,
  onSearchChange,
}: DependencyControlsProps) {
  return (
    <div className="bg-background border border-border rounded-lg p-4 space-y-4">
      {/* Search and Filters Row */}
      <div className="flex gap-4 items-center flex-wrap">
        {/* Search Input */}
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search services, dependencies..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm text-muted-foreground hidden md:inline">View Mode:</span>
          <ToggleGroup
            type="single"
            value={impactMode ? 'impact' : 'dependency'}
            onValueChange={(value) => onImpactModeChange(value === 'impact')}
            className="border border-border rounded-lg"
          >
            <ToggleGroupItem value="dependency" className="gap-2 px-3.5">
              <ArrowUp className="w-4 h-4" />
              Dependencies
            </ToggleGroupItem>
            <ToggleGroupItem value="impact" className="gap-2 px-3.5">
              <ArrowDown className="w-4 h-4" />
              Impact
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Info Bar */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="space-y-1">
          <p>
            <span className="font-medium">{impactMode ? 'Impact Mode:' : 'Dependency Mode:'}</span>
            <span className="ml-2">
              {impactMode
                ? 'Shows services affected by changes to the selected service'
                : 'Shows services this one depends on'}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">8 Services</Badge>
          <Badge variant="outline">9 Dependencies</Badge>
        </div>
      </div>
    </div>
  )
}

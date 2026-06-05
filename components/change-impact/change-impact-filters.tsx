'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Search, X } from 'lucide-react'

interface ChangeImpactFiltersProps {
  filters: {
    search: string
    impact: string
    sortBy: string
  }
  setFilters: (filters: any) => void
}

export function ChangeImpactFilters({ filters, setFilters }: ChangeImpactFiltersProps) {
  const hasActiveFilters = filters.impact !== 'all'
  const impacts = ['high', 'medium', 'low']
  
  const sortOptions = [
    { value: 'time-desc', label: 'Newest First' },
    { value: 'time-asc', label: 'Oldest First' },
  ]

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search changes by message, service, or hash..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="pl-9 bg-background"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2 flex-wrap">
        {/* Impact Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={filters.impact !== 'all' ? 'default' : 'outline'}
              className="gap-2"
            >
              Impact: {filters.impact === 'all' ? 'All' : filters.impact.charAt(0).toUpperCase() + filters.impact.slice(1)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setFilters({ ...filters, impact: 'all' })}>
              All
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {impacts.map((imp) => (
              <DropdownMenuItem
                key={imp}
                onClick={() => setFilters({ ...filters, impact: imp })}
              >
                {imp.charAt(0).toUpperCase() + imp.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort By Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Sort: {sortOptions.find((o) => o.value === filters.sortBy)?.label || 'Newest First'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setFilters({ ...filters, sortBy: option.value })}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({ ...filters, impact: 'all' })}
            className="gap-1"
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}

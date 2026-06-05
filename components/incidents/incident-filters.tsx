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

interface IncidentFiltersProps {
  filters: {
    search: string
    severity: string
    sortBy: string
  }
  setFilters: (filters: any) => void
}

export function IncidentFilters({ filters, setFilters }: IncidentFiltersProps) {
  const hasActiveFilters = filters.severity !== 'all'
  const severities = ['critical', 'high', 'medium']
  
  const sortOptions = [
    { value: 'severity-desc', label: 'Severity (High to Low)' },
    { value: 'severity-asc', label: 'Severity (Low to High)' },
    { value: 'duration-desc', label: 'Duration (Longest)' },
    { value: 'duration-asc', label: 'Duration (Shortest)' },
    { value: 'impact-desc', label: 'Impact (Most Users)' },
    { value: 'impact-asc', label: 'Impact (Least Users)' },
    { value: 'date-desc', label: 'Date (Newest)' },
    { value: 'date-asc', label: 'Date (Oldest)' },
  ]

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search incidents by title or service..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="pl-9 bg-background"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2 flex-wrap">
        {/* Severity Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={filters.severity !== 'all' ? 'default' : 'outline'}
              className="gap-2"
            >
              Severity: {filters.severity === 'all' ? 'All' : filters.severity.charAt(0).toUpperCase() + filters.severity.slice(1)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setFilters({ ...filters, severity: 'all' })}>
              All
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {severities.map((sev) => (
              <DropdownMenuItem
                key={sev}
                onClick={() => setFilters({ ...filters, severity: sev })}
              >
                {sev.charAt(0).toUpperCase() + sev.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort By Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Sort: {sortOptions.find((o) => o.value === filters.sortBy)?.label || 'Date (Newest)'}
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
            onClick={() => setFilters({ ...filters, severity: 'all' })}
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

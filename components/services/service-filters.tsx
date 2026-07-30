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

interface ServiceFiltersProps {
  filters: {
    search: string
    status: string
    sortBy: string
  }
  setFilters: (filters: any) => void
  activeCount?: number
  disconnectedCount?: number
}

export function ServiceFilters({ filters, setFilters, activeCount = 0, disconnectedCount = 0 }: ServiceFiltersProps) {
  const hasActiveFilters = filters.status !== 'active' || filters.search !== ''
  
  const statusOptions = [
    { value: 'active', label: `Active Services (${activeCount})` },
    { value: 'healthy', label: 'Healthy' },
    { value: 'warning', label: 'Warning' },
    { value: 'critical', label: 'Critical' },
    { value: 'disconnected', label: `Disconnected (${disconnectedCount})` },
    { value: 'all', label: `All Services (${activeCount + disconnectedCount})` },
  ]
  
  const sortOptions = [
    { value: 'health-asc', label: 'Health (Low to High)' },
    { value: 'health-desc', label: 'Health (High to Low)' },
    { value: 'incidents-desc', label: 'Incidents (High to Low)' },
    { value: 'deployments-desc', label: 'Deployments (High to Low)' },
    { value: 'name-asc', label: 'Name (A-Z)' },
  ]

  const currentStatusLabel = statusOptions.find(o => o.value === filters.status)?.label || 'Active Services'

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search services by name or team..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="pl-9 bg-background"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2 flex-wrap items-center">
        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={filters.status !== 'active' ? 'default' : 'outline'}
              className="gap-2"
            >
              Status: {currentStatusLabel}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {statusOptions.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => setFilters({ ...filters, status: opt.value })}
                className={filters.status === opt.value ? 'font-semibold bg-accent' : ''}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort By Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Sort: {sortOptions.find((o) => o.value === filters.sortBy)?.label || 'Health (Low to High)'}
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
            onClick={() => setFilters({ search: '', status: 'active', sortBy: 'health-asc' })}
            className="gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
            Reset to Active
          </Button>
        )}
      </div>
    </div>
  )
}

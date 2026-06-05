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
import { Search, X, SlidersHorizontal } from 'lucide-react'

interface WorkflowFiltersProps {
  filters: {
    search: string
    status: string
    sortBy: string
  }
  setFilters: (filters: any) => void
}

export function WorkflowFilters({ filters, setFilters }: WorkflowFiltersProps) {
  const hasActiveFilters = filters.status !== 'all'
  const statuses = ['active', 'scheduled', 'disabled']
  
  const sortOptions = [
    { value: 'runs-desc', label: 'Total Runs' },
    { value: 'success-desc', label: 'Success Rate' },
    { value: 'name-asc', label: 'Name (A to Z)' },
  ]

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search workflows by name..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="pl-9 bg-background w-full"
        />
      </div>

      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={filters.status !== 'all' ? 'default' : 'outline'}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Status: {filters.status === 'all' ? 'All' : filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilters({ ...filters, status: 'all' })}>
              All Statuses
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {statuses.map((s) => (
              <DropdownMenuItem
                key={s}
                onClick={() => setFilters({ ...filters, status: s })}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Sort: {sortOptions.find((o) => o.value === filters.sortBy)?.label || 'Total Runs'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
            onClick={() => setFilters({ ...filters, status: 'all' })}
            className="gap-1 px-2 sm:px-4"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        )}
      </div>
    </div>
  )
}

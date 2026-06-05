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

interface HealthFiltersProps {
  filters: {
    search: string
    status: string
    sortBy: string
  }
  setFilters: (filters: any) => void
}

export function HealthFilters({ filters, setFilters }: HealthFiltersProps) {
  const hasActiveFilters = filters.status !== 'all'
  const statuses = ['healthy', 'warning', 'critical']
  
  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'health-desc', label: 'Health (High to Low)' },
    { value: 'health-asc', label: 'Health (Low to High)' },
    { value: 'availability-desc', label: 'Availability (Highest)' },
    { value: 'availability-asc', label: 'Availability (Lowest)' },
  ]

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search clusters and services..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="pl-9 bg-background"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2 flex-wrap">
        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={filters.status !== 'all' ? 'default' : 'outline'}
              className="gap-2"
            >
              Status: {filters.status === 'all' ? 'All' : filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setFilters({ ...filters, status: 'all' })}>
              All
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {statuses.map((stat) => (
              <DropdownMenuItem
                key={stat}
                onClick={() => setFilters({ ...filters, status: stat })}
              >
                {stat.charAt(0).toUpperCase() + stat.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort By Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Sort: {sortOptions.find((o) => o.value === filters.sortBy)?.label || 'Name (A-Z)'}
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
            onClick={() => setFilters({ ...filters, status: 'all' })}
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

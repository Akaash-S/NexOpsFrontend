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

interface RiskFiltersProps {
  filters: {
    search: string
    trend: string
    sortBy: string
  }
  setFilters: (filters: any) => void
}

export function RiskFilters({ filters, setFilters }: RiskFiltersProps) {
  const hasActiveFilters = filters.trend !== 'all'
  const trends = ['increasing', 'stable', 'decreasing']
  
  const sortOptions = [
    { value: 'risk-desc', label: 'Risk Score (High to Low)' },
    { value: 'risk-asc', label: 'Risk Score (Low to High)' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
  ]

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search services..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="pl-9 bg-background"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2 flex-wrap">
        {/* Trend Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={filters.trend !== 'all' ? 'default' : 'outline'}
              className="gap-2"
            >
              Trend: {filters.trend === 'all' ? 'All' : filters.trend.charAt(0).toUpperCase() + filters.trend.slice(1)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setFilters({ ...filters, trend: 'all' })}>
              All
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {trends.map((t) => (
              <DropdownMenuItem
                key={t}
                onClick={() => setFilters({ ...filters, trend: t })}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort By Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Sort: {sortOptions.find((o) => o.value === filters.sortBy)?.label || 'Risk Score (High to Low)'}
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
            onClick={() => setFilters({ ...filters, trend: 'all' })}
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

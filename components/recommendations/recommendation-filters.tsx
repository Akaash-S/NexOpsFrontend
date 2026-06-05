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

interface RecommendationFiltersProps {
  filters: {
    search: string
    priority: string
    effort: string
    sortBy: string
  }
  setFilters: (filters: any) => void
}

export function RecommendationFilters({ filters, setFilters }: RecommendationFiltersProps) {
  const hasActiveFilters = filters.priority !== 'all' || filters.effort !== 'all'
  const priorities = ['critical', 'high', 'medium', 'low']
  const efforts = ['high', 'medium', 'low']
  
  const sortOptions = [
    { value: 'confidence-desc', label: 'Confidence (High to Low)' },
    { value: 'confidence-asc', label: 'Confidence (Low to High)' },
    { value: 'savings-desc', label: 'Potential Savings' },
    { value: 'priority-desc', label: 'Priority Level' },
  ]

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by issue, action, or category..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="pl-9 bg-background w-full"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        {/* Priority Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={filters.priority !== 'all' ? 'default' : 'outline'}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Priority: {filters.priority === 'all' ? 'All' : filters.priority.charAt(0).toUpperCase() + filters.priority.slice(1)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilters({ ...filters, priority: 'all' })}>
              All Priorities
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {priorities.map((p) => (
              <DropdownMenuItem
                key={p}
                onClick={() => setFilters({ ...filters, priority: p })}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Effort Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={filters.effort !== 'all' ? 'default' : 'outline'}
              className="gap-2"
            >
              Effort: {filters.effort === 'all' ? 'All' : filters.effort.charAt(0).toUpperCase() + filters.effort.slice(1)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilters({ ...filters, effort: 'all' })}>
              All Efforts
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {efforts.map((e) => (
              <DropdownMenuItem
                key={e}
                onClick={() => setFilters({ ...filters, effort: e })}
              >
                {e.charAt(0).toUpperCase() + e.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort By Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Sort: {sortOptions.find((o) => o.value === filters.sortBy)?.label || 'Confidence (High to Low)'}
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
            onClick={() => setFilters({ ...filters, priority: 'all', effort: 'all' })}
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

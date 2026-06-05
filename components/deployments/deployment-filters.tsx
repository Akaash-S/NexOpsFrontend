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

interface DeploymentFiltersProps {
  filters: {
    search: string
    status: string
    environment: string
    sortBy: string
  }
  setFilters: (filters: any) => void
}

export function DeploymentFilters({ filters, setFilters }: DeploymentFiltersProps) {
  const hasActiveFilters = filters.status !== 'all' || filters.environment !== 'all'
  const statuses = ['success', 'pending', 'rollback', 'failed']
  const environments = ['production', 'staging', 'qa', 'development']
  
  const sortOptions = [
    { value: 'risk-desc', label: 'Risk Score (High to Low)' },
    { value: 'risk-asc', label: 'Risk Score (Low to High)' },
    { value: 'confidence-desc', label: 'Confidence (High to Low)' },
    { value: 'changes-desc', label: 'Changes (High to Low)' },
  ]

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search deployments by service or version..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="pl-9 bg-background"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2 flex-wrap">
        {/* Environment Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={filters.environment !== 'all' ? 'default' : 'outline'}
              className="gap-2"
            >
              Environment: {filters.environment === 'all' ? 'All' : filters.environment.charAt(0).toUpperCase() + filters.environment.slice(1)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setFilters({ ...filters, environment: 'all' })}>
              All
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {environments.map((env) => (
              <DropdownMenuItem
                key={env}
                onClick={() => setFilters({ ...filters, environment: env })}
              >
                {env.charAt(0).toUpperCase() + env.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

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
            {statuses.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => setFilters({ ...filters, status })}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
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
            onClick={() => setFilters({ ...filters, status: 'all', environment: 'all' })}
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

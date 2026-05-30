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

interface ClusterFiltersProps {
  filters: {
    status: string
    region: string
    provider: string
    search: string
  }
  setFilters: (filters: any) => void
}

export function ClusterFilters({ filters, setFilters }: ClusterFiltersProps) {
  const hasActiveFilters = filters.status !== 'all' || filters.region !== 'all' || filters.provider !== 'all'

  const regions = ['us-east-1', 'eu-west-1', 'us-west-2', 'multi', 'global']
  const providers = ['aws', 'gke', 'custom']
  const statuses = ['healthy', 'warning', 'critical']

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search clusters by name..."
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
              Status: {filters.status === 'all' ? 'All' : filters.status}
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

        {/* Region Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={filters.region !== 'all' ? 'default' : 'outline'}
              className="gap-2"
            >
              Region: {filters.region === 'all' ? 'All' : filters.region}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setFilters({ ...filters, region: 'all' })}>
              All
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {regions.map((region) => (
              <DropdownMenuItem
                key={region}
                onClick={() => setFilters({ ...filters, region })}
              >
                {region}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Provider Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={filters.provider !== 'all' ? 'default' : 'outline'}
              className="gap-2"
            >
              Provider: {filters.provider === 'all' ? 'All' : filters.provider.toUpperCase()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setFilters({ ...filters, provider: 'all' })}>
              All
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {providers.map((provider) => (
              <DropdownMenuItem
                key={provider}
                onClick={() => setFilters({ ...filters, provider })}
              >
                {provider.toUpperCase()}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({ status: 'all', region: 'all', provider: 'all', search: '' })}
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

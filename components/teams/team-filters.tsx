import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TeamFiltersProps {
  filters: {
    search: string
    onCallFilter: string
    sortBy: string
  }
  setFilters: (filters: any) => void
}

export function TeamFilters({ filters, setFilters }: TeamFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search teams or members..." 
          className="pl-9"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>
      
      <div className="flex gap-4">
        <Select 
          value={filters.onCallFilter} 
          onValueChange={(value) => setFilters({ ...filters, onCallFilter: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="On-Call Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            <SelectItem value="has-incidents">Has Active Incidents</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.sortBy} 
          onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="members-desc">Most Members</SelectItem>
            <SelectItem value="services-desc">Most Services</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface IntegrationFiltersProps {
  filters: {
    search: string
    status: string
    health: string
    sortBy: string
  }
  setFilters: (filters: any) => void
}

export function IntegrationFilters({ filters, setFilters }: IntegrationFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search integrations by name or configuration..." 
          className="pl-9"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>
      
      <div className="flex gap-4">
        <Select 
          value={filters.status} 
          onValueChange={(value) => setFilters({ ...filters, status: value })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="connected">Connected</SelectItem>
            <SelectItem value="disconnected">Disconnected</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.health} 
          onValueChange={(value) => setFilters({ ...filters, health: value })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Health" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Health</SelectItem>
            <SelectItem value="healthy">Healthy</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.sortBy} 
          onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="health-asc">Health (Best)</SelectItem>
            <SelectItem value="health-desc">Health (Worst)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { RepositoryGrid } from '@/components/repositories/repository-grid'
import { RepositoryDrawer } from '@/components/repositories/repository-drawer'
import { RepositoryFilters } from '@/components/repositories/repository-filters'
import { ConnectRepositoryDrawer } from '@/components/repositories/connect-repository-drawer'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { REPOSITORIES_DATA } from '@/lib/mock-data'
import { useAppState } from '@/lib/hooks/use-app-state'

export default function RepositoriesPage() {
  const { setConnectRepoOpen } = useAppState()
  const [repositories, setRepositories] = useState(REPOSITORIES_DATA)
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)
  
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: 'health-asc',
  })

  // Filter and Sort Logic
  const filteredAndSortedRepos = repositories
    .filter((repo) => {
      // Search
      const searchMatch = repo.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                          repo.description.toLowerCase().includes(filters.search.toLowerCase());
      if (!searchMatch) return false;

      // Status
      if (filters.status !== 'all' && repo.status !== filters.status) return false;

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'health-asc': return a.health - b.health;
        case 'health-desc': return b.health - a.health;
        case 'quality-desc': return b.codeQuality - a.codeQuality;
        case 'coverage-desc': return b.coverage - a.coverage;
        case 'commits-desc': return b.commits30d - a.commits30d;
        case 'prs-desc': return b.prs - a.prs;
        case 'name-asc': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  const selectedRepoData = repositories.find((r) => r.id === selectedRepo)

  return (
    <>
      <PageContent>
        <div className="flex items-center justify-between mb-8">
          <PageHeader
            title="Repositories"
            description="Source control visibility with health, security, and code quality metrics"
          />
          <Button 
            className="gap-2"
            onClick={() => setConnectRepoOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Connect Repository
          </Button>
        </div>

        <RepositoryFilters 
          filters={filters}
          setFilters={setFilters}
        />

        <RepositoryGrid
          repositories={filteredAndSortedRepos}
          selectedRepo={selectedRepo}
          onSelectRepo={setSelectedRepo}
        />
      </PageContent>

      {/* Connect Wizard */}
      <ConnectRepositoryDrawer 
        onSuccess={(newRepos) => setRepositories([...repositories, ...newRepos])} 
      />

      {/* Details Drawer */}
      {selectedRepoData && (
        <RepositoryDrawer
          repository={selectedRepoData}
          onClose={() => setSelectedRepo(null)}
        />
      )}
    </>
  )
}

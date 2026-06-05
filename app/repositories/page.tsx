'use client'

import { useState } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { RepositoryGrid } from '@/components/repositories/repository-grid'
import { RepositoryDrawer } from '@/components/repositories/repository-drawer'
import { Button } from '@/components/ui/button'
import { Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { mockRepositories } from '@/lib/mock-data'

// Transform mock repositories to page format
const transformRepositories = () => {
  return mockRepositories.map((repo) => ({
    id: repo.id,
    name: repo.name,
    owner: repo.owner,
    description: repo.description,
    health: 90 + Math.floor(Math.random() * 10),
    status: 'healthy' as 'healthy' | 'critical' | 'warning',
    prs: Math.floor(Math.random() * 10),
    commits30d: repo.commits,
    stars: repo.stars,
    securityIssues: Math.floor(Math.random() * 2),
    dependencies: Math.floor(Math.random() * 30) + 10,
    codeQuality: 85 + Math.floor(Math.random() * 15),
    coverage: 75 + Math.floor(Math.random() * 20),
    lastUpdated: new Date(repo.lastCommit).toLocaleString(),
  }));
};

const REPOSITORIES = transformRepositories();

export default function RepositoriesPage() {
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRepos = REPOSITORIES.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedRepoData = REPOSITORIES.find((r) => r.id === selectedRepo)

  return (
    <>
      
      <>
        <PageContent>
          <div className="flex items-center justify-between mb-8">
            <PageHeader
              title="Repositories"
              description="Source control visibility with health, security, and code quality metrics"
            />
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Connect Repository
            </Button>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Repository Grid */}
          <RepositoryGrid
            repositories={filteredRepos}
            selectedRepo={selectedRepo}
            onSelectRepo={setSelectedRepo}
          />
        </PageContent>
      </>

      {/* Repository Drawer */}
      {selectedRepoData && (
        <RepositoryDrawer
          repository={selectedRepoData}
          onClose={() => setSelectedRepo(null)}
        />
      )}
    </>
  )
}

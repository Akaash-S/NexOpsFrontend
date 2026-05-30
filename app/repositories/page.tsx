'use client'

import { useState } from 'react'
import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'
import { RepositoryGrid } from '@/components/repositories/repository-grid'
import { RepositoryDrawer } from '@/components/repositories/repository-drawer'
import { Button } from '@/components/ui/button'
import { Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

const REPOSITORIES = [
  {
    id: 'nexops-api',
    name: 'nexops-api',
    owner: 'Platform',
    description: 'Core API server and gateway',
    health: 98,
    status: 'healthy',
    prs: 3,
    commits30d: 47,
    stars: 234,
    securityIssues: 0,
    dependencies: 24,
    codeQuality: 92,
    coverage: 87,
    lastUpdated: '1 hour ago',
  },
  {
    id: 'nexops-ui',
    name: 'nexops-ui',
    owner: 'Frontend',
    description: 'React frontend application',
    health: 95,
    status: 'healthy',
    prs: 2,
    commits30d: 32,
    stars: 156,
    securityIssues: 0,
    dependencies: 18,
    codeQuality: 89,
    coverage: 91,
    lastUpdated: '45 minutes ago',
  },
  {
    id: 'nexops-cli',
    name: 'nexops-cli',
    owner: 'Platform',
    description: 'Command-line interface tool',
    health: 88,
    status: 'healthy',
    prs: 1,
    commits30d: 18,
    stars: 89,
    securityIssues: 1,
    dependencies: 12,
    codeQuality: 85,
    coverage: 78,
    lastUpdated: '3 days ago',
  },
  {
    id: 'nexops-docs',
    name: 'nexops-docs',
    owner: 'Documentation',
    description: 'Technical documentation',
    health: 92,
    status: 'healthy',
    prs: 4,
    commits30d: 56,
    stars: 412,
    securityIssues: 0,
    dependencies: 5,
    codeQuality: 94,
    coverage: 0,
    lastUpdated: '2 hours ago',
  },
  {
    id: 'nexops-helm',
    name: 'nexops-helm',
    owner: 'Infrastructure',
    description: 'Kubernetes Helm charts',
    health: 91,
    status: 'healthy',
    prs: 2,
    commits30d: 22,
    stars: 67,
    securityIssues: 0,
    dependencies: 8,
    codeQuality: 88,
    coverage: 0,
    lastUpdated: '5 days ago',
  },
]

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
      <TopNav />
      <PageLayout>
        <Section>
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
        </Section>
      </PageLayout>

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

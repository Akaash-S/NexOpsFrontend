'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout'
import { DependencyGraph } from '@/components/dependencies/dependency-graph'
import { DependencyControls } from '@/components/dependencies/dependency-controls'
import { DependencyIntelligence } from '@/components/dependencies/dependency-intelligence'

export default function DependenciesPage() {
  const [impactMode, setImpactMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  return (
    <>
      <div className="flex flex-col h-full gap-4 p-4">
        {/* Header */}
        <div>
          <PageHeader
            title="Dependency Graph"
            description="Interactive service topology with impact analysis and critical path visualization"
          />
        </div>

        {/* Controls */}
        <DependencyControls
          impactMode={impactMode}
          onImpactModeChange={setImpactMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Main Content Area */}
        <div className="flex gap-4 flex-1 h-[calc(100vh-240px)] min-h-[500px]">
          {/* Graph Area */}
          <div className="flex-1 border border-border rounded-lg overflow-hidden" style={{ minHeight: '500px' }}>
            <DependencyGraph
              impactMode={impactMode}
              searchQuery={searchQuery}
              onNodeSelect={setSelectedNode}
              selectedNode={selectedNode}
            />
          </div>

          {/* Intelligence Panel */}
          {selectedNode && (
            <div className="w-96 flex-shrink-0 h-full">
              <DependencyIntelligence 
                nodeId={selectedNode} 
                onClose={() => setSelectedNode(null)} 
                onSelectNode={setSelectedNode}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
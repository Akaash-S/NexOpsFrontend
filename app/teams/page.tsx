'use client'

import { useState, useMemo } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Users, AlertCircle, ShieldAlert } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { TEAMS_DATA, TEAM_MEMBERS_DATA } from '@/lib/mock-data'
import { useAppState } from '@/lib/hooks/use-app-state'
import { TeamFilters } from '@/components/teams/team-filters'
import { CreateTeamDrawer } from '@/components/teams/create-team-drawer'

export default function TeamsPage() {
  const { setCreateTeamOpen } = useAppState()
  
  const [teams, setTeams] = useState<any[]>(TEAMS_DATA)
  const [members, setMembers] = useState<any[]>(TEAM_MEMBERS_DATA)

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    onCallFilter: 'all',
    sortBy: 'name-asc',
  })

  const filteredAndSortedTeams = useMemo(() => {
    return teams
      .filter((team) => {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          team.name.toLowerCase().includes(searchLower) ||
          team.onCall.toLowerCase().includes(searchLower)
        
        let matchesStatus = true
        if (filters.onCallFilter === 'has-incidents') matchesStatus = team.activeIncidents > 0
        
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'name-asc':
            return a.name.localeCompare(b.name)
          case 'members-desc':
            return b.members - a.members
          case 'services-desc':
            return b.ownedServices - a.ownedServices
          default:
            return 0
        }
      })
  }, [teams, filters])

  const filteredMembers = useMemo(() => {
    if (!filters.search) return members
    const searchLower = filters.search.toLowerCase()
    return members.filter(m => 
      m.name.toLowerCase().includes(searchLower) ||
      m.role.toLowerCase().includes(searchLower) ||
      m.team.toLowerCase().includes(searchLower)
    )
  }, [members, filters.search])

  const handleCreateSuccess = (newTeam: any) => {
    setTeams([newTeam, ...teams])
  }

  const activeIncidentsCount = teams.reduce((acc, t) => acc + t.activeIncidents, 0)
  const totalServices = teams.reduce((acc, t) => acc + t.ownedServices, 0)

  return (
    <>
      <PageContent>
        <PageHeader
          title="Teams"
          description="Enterprise team management with ownership mapping, on-call assignments, and collaboration"
        />

        {/* Action */}
        <div className="mb-8 flex justify-between items-center">
          <Button className="gap-2" onClick={() => setCreateTeamOpen(true)}>
            <Plus className="w-4 h-4" />
            Create Team
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Teams</div>
            <div className="text-2xl font-bold">{teams.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Team Members</div>
            <div className="text-2xl font-bold">{members.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Services Covered</div>
            <div className="text-2xl font-bold">{totalServices}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Active Incidents</div>
            <div className={activeIncidentsCount > 0 ? "text-2xl font-bold text-destructive" : "text-2xl font-bold text-success"}>
              {activeIncidentsCount}
            </div>
          </Card>
        </div>

        {/* Filters */}
        <TeamFilters filters={filters} setFilters={setFilters} />

        {/* Teams Grid */}
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4">Teams</h3>
          {filteredAndSortedTeams.length > 0 ? (
            <div className="grid grid-cols-2 gap-6">
              {filteredAndSortedTeams.map((team) => (
                <Card key={team.id} className="p-6 hover:border-primary/50 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold text-lg">{team.name}</h4>
                    {team.activeIncidents > 0 && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {team.activeIncidents} Incident{team.activeIncidents > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Team Size</span>
                      <Badge variant="outline" className="bg-muted/50">{team.members} members</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Owned Services</span>
                      <span className="font-semibold">{team.ownedServices}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Owned Clusters</span>
                      <span className="font-semibold">{team.ownedClusters}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/30 border border-border mt-2">
                      <span className="text-muted-foreground font-semibold">Current On-Call</span>
                      <span className="font-semibold text-primary">{team.onCall}</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4" variant="outline">
                    Manage Team
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 text-muted-foreground border border-dashed rounded-lg bg-muted/20">
              <ShieldAlert className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
              <p>No teams found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Team Members */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Team Members</h3>
          <Card>
            {filteredMembers.length > 0 ? (
              <div className="space-y-1 p-2">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-transparent hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {member.name
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {member.team}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`text-xs capitalize w-16 justify-center ${
                          member.status === 'active'
                            ? 'bg-success/10 text-success'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-12 text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
                <p>No members found matching your search.</p>
              </div>
            )}
          </Card>
        </div>
      </PageContent>

      <CreateTeamDrawer onSuccess={handleCreateSuccess} />
    </>
  )
}

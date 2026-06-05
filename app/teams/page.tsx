'use client'

import { PageContent, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Users, Shield, AlertCircle } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const TEAMS = [
  {
    id: 'team-1',
    name: 'Platform',
    members: 8,
    ownedServices: 12,
    ownedClusters: 2,
    activeIncidents: 1,
    onCall: 'Sarah Chen',
  },
  {
    id: 'team-2',
    name: 'Frontend',
    members: 6,
    ownedServices: 5,
    ownedClusters: 1,
    activeIncidents: 0,
    onCall: 'James Liu',
  },
  {
    id: 'team-3',
    name: 'Search',
    members: 4,
    ownedServices: 3,
    ownedClusters: 1,
    activeIncidents: 1,
    onCall: 'Marcus Johnson',
  },
  {
    id: 'team-4',
    name: 'Infrastructure',
    members: 5,
    ownedServices: 2,
    ownedClusters: 4,
    activeIncidents: 0,
    onCall: 'Elena Rodriguez',
  },
]

const TEAM_MEMBERS = [
  { id: 'u-1', name: 'Sarah Chen', role: 'Engineering Manager', team: 'Platform', status: 'active' },
  { id: 'u-2', name: 'James Liu', role: 'Senior Engineer', team: 'Frontend', status: 'active' },
  { id: 'u-3', name: 'Marcus Johnson', role: 'Engineer', team: 'Search', status: 'active' },
  { id: 'u-4', name: 'Elena Rodriguez', role: 'DevOps Engineer', team: 'Infrastructure', status: 'active' },
  { id: 'u-5', name: 'Lisa Wang', role: 'Engineer', team: 'Frontend', status: 'away' },
]

export default function TeamsPage() {
  return (
    <>
      
      <>
        <PageContent>
          <PageHeader
            title="Teams"
            description="Enterprise team management with ownership mapping, on-call assignments, and collaboration"
          />

          {/* Action */}
          <div className="mb-8">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Team
            </Button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Total Teams</div>
              <div className="text-2xl font-bold">{TEAMS.length}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Team Members</div>
              <div className="text-2xl font-bold">{TEAM_MEMBERS.length}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Services Covered</div>
              <div className="text-2xl font-bold">22</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Active Incidents</div>
              <div className="text-2xl font-bold text-warning">2</div>
            </Card>
          </div>

          {/* Teams Grid */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-4">Teams</h3>
            <div className="grid grid-cols-2 gap-6">
              {TEAMS.map((team) => (
                <Card key={team.id} className="p-6 hover:border-primary transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold text-lg">{team.name}</h4>
                    {team.activeIncidents > 0 && (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Team Size</span>
                      <Badge variant="outline">{team.members} members</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Owned Services</span>
                      <span className="font-semibold">{team.ownedServices}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Owned Clusters</span>
                      <span className="font-semibold">{team.ownedClusters}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">On-Call</span>
                      <span className="font-semibold">{team.onCall}</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4" variant="outline">
                    Manage Team
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Team Members</h3>
            <Card>
              <div className="space-y-3 p-4">
                {TEAM_MEMBERS.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10">
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
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
                        className={`text-xs ${
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
            </Card>
          </div>
        </PageContent>
      </>
    </>
  )
}

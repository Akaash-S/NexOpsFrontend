'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const healthData = [
  { time: '12 AM', overall: 94, clusters: 96, services: 92, deployments: 91 },
  { time: '2 AM', overall: 92, clusters: 94, services: 90, deployments: 89 },
  { time: '4 AM', overall: 89, clusters: 91, services: 87, deployments: 86 },
  { time: '6 AM', overall: 91, clusters: 93, services: 89, deployments: 88 },
  { time: '8 AM', overall: 93, clusters: 95, services: 91, deployments: 90 },
  { time: '10 AM', overall: 95, clusters: 97, services: 93, deployments: 92 },
  { time: '12 PM', overall: 94, clusters: 96, services: 92, deployments: 91 },
  { time: '2 PM', overall: 92, clusters: 94, services: 90, deployments: 89 },
  { time: '4 PM', overall: 94, clusters: 96, services: 92, deployments: 91 },
]

export function HealthOverview() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Engineering Health Trend</h3>
        <p className="text-sm text-muted-foreground mt-1">24-hour health score across your infrastructure</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={healthData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="time" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" domain={[80, 100]} />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
            }}
            cursor={{ stroke: 'var(--primary)', strokeDasharray: '3 3' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="overall" 
            stroke="var(--primary)" 
            dot={false}
            strokeWidth={2}
            name="Overall Health"
          />
          <Line 
            type="monotone" 
            dataKey="clusters" 
            stroke="var(--success)" 
            dot={false}
            strokeWidth={2}
            name="Clusters"
          />
          <Line 
            type="monotone" 
            dataKey="services" 
            stroke="var(--warning)" 
            dot={false}
            strokeWidth={2}
            name="Services"
          />
          <Line 
            type="monotone" 
            dataKey="deployments" 
            stroke="var(--accent)" 
            dot={false}
            strokeWidth={2}
            name="Deployments"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

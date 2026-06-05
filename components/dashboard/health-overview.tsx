'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const data12H = [
  { time: '8 AM', overall: 96, clusters: 98, services: 94, deployments: 95 },
  { time: '10 AM', overall: 94, clusters: 96, services: 92, deployments: 91 },
  { time: '12 PM', overall: 92, clusters: 95, services: 89, deployments: 88 },
  { time: '2 PM', overall: 89, clusters: 92, services: 85, deployments: 86 },
  { time: '4 PM', overall: 91, clusters: 94, services: 88, deployments: 90 },
  { time: '6 PM', overall: 94, clusters: 97, services: 92, deployments: 93 },
  { time: '8 PM', overall: 95, clusters: 98, services: 94, deployments: 94 },
]

const data24H = [
  { time: '12 AM', overall: 94, clusters: 96, services: 92, deployments: 91 },
  { time: '4 AM', overall: 89, clusters: 91, services: 87, deployments: 86 },
  { time: '8 AM', overall: 93, clusters: 95, services: 91, deployments: 90 },
  { time: '12 PM', overall: 94, clusters: 96, services: 92, deployments: 91 },
  { time: '4 PM', overall: 91, clusters: 94, services: 88, deployments: 90 },
  { time: '8 PM', overall: 95, clusters: 98, services: 94, deployments: 94 },
]

const data7D = [
  { time: 'Mon', overall: 96, clusters: 98, services: 94, deployments: 95 },
  { time: 'Tue', overall: 95, clusters: 97, services: 93, deployments: 94 },
  { time: 'Wed', overall: 92, clusters: 95, services: 89, deployments: 88 },
  { time: 'Thu', overall: 88, clusters: 90, services: 85, deployments: 84 },
  { time: 'Fri', overall: 91, clusters: 94, services: 88, deployments: 90 },
  { time: 'Sat', overall: 94, clusters: 96, services: 92, deployments: 91 },
  { time: 'Sun', overall: 95, clusters: 98, services: 94, deployments: 94 },
]

const timeRanges = {
  '12H': data12H,
  '24H': data24H,
  '7D': data7D
}

type TimeRange = keyof typeof timeRanges

export function HealthOverview() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24H')
  const data = timeRanges[timeRange]

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Engineering Health Trend</h3>
          <p className="text-sm text-muted-foreground mt-1">Health score across your infrastructure</p>
        </div>
        <div className="flex bg-muted rounded-lg p-1">
          {(Object.keys(timeRanges) as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer",
                timeRange === range 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="var(--muted-foreground)" 
            tick={{ fill: 'var(--muted-foreground)' }} 
            tickLine={false} 
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="var(--muted-foreground)" 
            domain={[80, 100]} 
            tick={{ fill: 'var(--muted-foreground)' }} 
            tickLine={false} 
            axisLine={false}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--foreground)'
            }}
            itemStyle={{ color: 'var(--foreground)' }}
            cursor={{ stroke: 'var(--primary)', strokeDasharray: '3 3', opacity: 0.2 }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Line 
            type="monotone" 
            dataKey="overall" 
            stroke="var(--primary)" 
            dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            strokeWidth={2}
            name="Overall Health"
          />
          <Line 
            type="monotone" 
            dataKey="clusters" 
            stroke="var(--success)" 
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            strokeWidth={2}
            name="Clusters"
          />
          <Line 
            type="monotone" 
            dataKey="services" 
            stroke="var(--warning)" 
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            strokeWidth={2}
            name="Services"
          />
          <Line 
            type="monotone" 
            dataKey="deployments" 
            stroke="var(--destructive)" 
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            strokeWidth={2}
            name="Deployments"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

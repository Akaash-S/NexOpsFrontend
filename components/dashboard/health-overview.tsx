'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { EmptyState } from '@/components/layout'
import { Activity, Loader2 } from 'lucide-react'

export function HealthOverview() {
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])
  const [isSparse, setIsSparse] = useState(true)

  useEffect(() => {
    async function loadActivityData() {
      try {
        const { apiFetch } = await import('@/lib/api-client')
        const response = await apiFetch('/analytics/activity')
        if (response && response.data && response.data.length > 0) {
          setChartData(response.data)
          
          // Determine if data is too sparse to display a meaningful chart
          const totalEvents = response.data.reduce(
            (sum: number, pt: any) => sum + (pt.commits || 0) + (pt.issues || 0) + (pt.deployed || 0),
            0
          )
          
          // We define sparse as having 2 or fewer events total across the 7-day period
          setIsSparse(totalEvents <= 2)
        } else {
          setIsSparse(true)
        }
      } catch (err) {
        console.error("Failed to load activity analytics:", err)
        setIsSparse(true)
      } finally {
        setLoading(false)
      }
    }
    loadActivityData()
  }, [])

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12 min-h-[300px]">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    )
  }

  if (isSparse) {
    return (
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Engineering Health Trend</h3>
          <p className="text-sm text-muted-foreground mt-1">Health score across your infrastructure</p>
        </div>
        <div className="flex items-center justify-center min-h-[300px] border border-dashed border-border rounded-xl bg-card/25 p-6">
          <EmptyState
            icon={<Activity className="w-10 h-10 text-muted-foreground/60" />}
            title="Insufficient Activity Data"
            description="We need more activity events (commits, issues, or deployments) over the last 7 days to generate a meaningful trend chart."
          />
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Engineering Health Trend</h3>
          <p className="text-sm text-muted-foreground mt-1">Activity and velocity trends across your infrastructure</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="var(--muted-foreground)" 
            tick={{ fill: 'var(--muted-foreground)' }} 
            tickLine={false} 
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="var(--muted-foreground)" 
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
            dataKey="commits" 
            stroke="var(--primary)" 
            dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            strokeWidth={2}
            name="Commits"
          />
          <Line 
            type="monotone" 
            dataKey="deployed" 
            stroke="var(--success)" 
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            strokeWidth={2}
            name="Deployments"
          />
          <Line 
            type="monotone" 
            dataKey="issues" 
            stroke="var(--warning)" 
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            strokeWidth={2}
            name="Issues"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

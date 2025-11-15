"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StatsPage() {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<{ totalWorkouts?: number; totalDuration?: number; totalCalories?: number; prCount?: number } | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await fetch("/api/workouts/stats", { cache: "no-store" })
        const data = await res.json()
        if (res.ok) setStats(data.stats || {})
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const cards = [
    { label: "Total Workouts", value: stats?.totalWorkouts ?? 0 },
    { label: "Total Duration (min)", value: stats?.totalDuration ?? 0 },
    { label: "Total Calories", value: stats?.totalCalories ?? 0 },
    { label: "Personal Records", value: stats?.prCount ?? 0 },
  ]

  return (
    <div className="p-8">
      <div>
        <h1 className="text-4xl font-bold text-balance">Statistics</h1>
        <p className="text-muted-foreground mt-2">Track your fitness progress and achievements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {(loading ? cards : cards).map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-sidebar-primary">{loading ? "..." : stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

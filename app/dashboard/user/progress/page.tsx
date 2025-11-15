"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function ProgressPage() {
  const [loading, setLoading] = useState(false)
  const [dailyStats, setDailyStats] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await fetch("/api/profile", { cache: "no-store" })
        const data = await res.json()
        if (res.ok) {
          setDailyStats(Array.isArray(data.dailyStats) ? data.dailyStats : [])
          setStats(data.stats || {})
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const weightData = useMemo(() => {
    // Map dailyStats to chart-friendly structure; use 'weight' if present else cumulative duration as proxy
    // Expect dailyStats items like { date, workouts, duration, calories, weight? }
    return dailyStats.map((d) => ({ week: new Date(d.date).toLocaleDateString(), weight: d.weight ?? d.duration ?? 0 }))
  }, [dailyStats])

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 text-balance">Your Progress</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weight Progress</CardTitle>
            <CardDescription>Last days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              {loading ? (
                <div className="text-muted-foreground text-center">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="var(--sidebar-primary)"
                      dot={{ fill: "var(--sidebar-primary)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workout Frequency</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-muted-foreground">Loading...</div>
            ) : (
              <div className="space-y-4">
                {dailyStats.map((d) => (
                  <div key={d.date} className="flex items-center justify-between">
                    <span className="text-sm">{new Date(d.date).toLocaleDateString()}</span>
                    <div className="flex gap-1">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={i}
                            className={`h-8 w-3 rounded-sm ${i < Math.min(5, Math.round((d.workouts || 0) / 1)) ? "bg-sidebar-primary" : "bg-muted"}`}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Your fitness milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-3xl mb-2">🎯</p>
              <p className="font-semibold">Streak</p>
              <p className="text-xs text-muted-foreground mt-1">{loading ? "..." : (stats?.streak ?? 0)} day streak</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-3xl mb-2">🔥</p>
              <p className="font-semibold">Weekly Workouts</p>
              <p className="text-xs text-muted-foreground mt-1">{loading ? "..." : (stats?.weeklyWorkouts ?? 0)} this week</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-3xl mb-2">💪</p>
              <p className="font-semibold">Total Duration</p>
              <p className="text-xs text-muted-foreground mt-1">{loading ? "..." : (stats?.totalDuration ?? 0)} min</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

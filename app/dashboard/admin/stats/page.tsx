"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminStatsPage() {
  const [counts, setCounts] = useState<{ userCount: number; exerciseCount: number; sessionCount: number; programCount: number } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await fetch("/api/admin/analytics", { cache: "no-store" })
        const data = await res.json()
        if (res.ok) setCounts(data.counts)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-balance">Detailed Statistics</h1>
        <p className="text-muted-foreground mt-2">Comprehensive system and user statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sidebar-primary">{counts?.userCount ?? (loading ? "..." : 0)}</div>
            <CardDescription>Total users</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sidebar-primary">{counts?.exerciseCount ?? (loading ? "..." : 0)}</div>
            <CardDescription>Total exercises</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sidebar-primary">{counts?.sessionCount ?? (loading ? "..." : 0)}</div>
            <CardDescription>Total workout sessions</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sidebar-primary">{counts?.programCount ?? (loading ? "..." : 0)}</div>
            <CardDescription>Total programs</CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>More detailed graphs</CardTitle>
          <CardDescription>Charts and trends (à venir)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Charts coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

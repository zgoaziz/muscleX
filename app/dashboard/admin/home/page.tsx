"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminHomePage() {
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
        <h1 className="text-4xl font-bold text-balance">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage the MuscleX system and monitor platform health</p>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sidebar-primary">{counts?.userCount ?? (loading ? "..." : 0)}</div>
            <CardDescription className="mt-2">Active users</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sidebar-primary">{counts?.programCount ?? (loading ? "..." : 0)}</div>
            <CardDescription className="mt-2">Published programs</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sidebar-primary">{counts?.exerciseCount ?? (loading ? "..." : 0)}</div>
            <CardDescription className="mt-2">Available exercises</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Workout Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sidebar-primary">{counts?.sessionCount ?? (loading ? "..." : 0)}</div>
            <CardDescription className="mt-2">Total sessions</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
          <CardDescription>Current system status and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm">Server Status</span>
              <span className="text-green-600 font-semibold">✓ Operational</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm">Database Status</span>
              <span className="text-green-600 font-semibold">✓ Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Last Backup</span>
              <span className="text-muted-foreground">Today at 02:00 AM</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

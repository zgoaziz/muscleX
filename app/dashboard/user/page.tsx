"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UserDashboard() {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [recent, setRecent] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const [pRes, sRes] = await Promise.all([
          fetch("/api/profile", { cache: "no-store" }),
          fetch("/api/workouts/sessions", { cache: "no-store" }),
        ])
        const p = await pRes.json()
        const s = await sRes.json()
        if (pRes.ok) setProfile(p)
        if (sRes.ok) setRecent((s.items || []).slice(0, 5))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 text-balance">Welcome{profile?.user?.name ? `, ${profile.user.name}` : " to Your Fitness Dashboard"}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sidebar-primary">{loading ? "..." : (profile?.user?.totalWorkouts ?? 0)}</div>
            <CardDescription>All-time</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Duration (min)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sidebar-primary">{loading ? "..." : (profile?.stats?.totalDuration ?? 0)}</div>
            <CardDescription>All-time</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sidebar-primary">{loading ? "..." : (profile?.stats?.streak ?? 0)}</div>
            <CardDescription>Days</CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest workouts</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : recent.length === 0 ? (
            <>
              <p className="text-muted-foreground mb-4">No recent workouts yet.</p>
              <Link href="/dashboard/user/workouts">
                <Button className="bg-sidebar-primary hover:bg-sidebar-primary/90">Start Your First Workout</Button>
              </Link>
            </>
          ) : (
            <div className="space-y-4">
              {recent.map((w: any) => (
                <div key={w._id} className="border-b pb-4 last:border-b-0 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{w.title || w.workoutName || "Workout"}</p>
                    <p className="text-sm text-muted-foreground">{new Date(w.createdAt).toLocaleString()} • {w.duration || 0} mins</p>
                  </div>
                  <Link href="/dashboard/user/workouts">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

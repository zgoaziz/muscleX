"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UserHomePage() {
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
      <h1 className="text-4xl font-bold text-balance mb-2">Welcome{profile?.user?.name ? `, ${profile.user.name}` : " to MuscleX"}</h1>
      <p className="text-muted-foreground mb-8">Track your fitness journey and achieve your goals</p>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sidebar-primary">{loading ? "..." : (profile?.user?.totalWorkouts ?? 0)}</div>
            <CardDescription className="mt-2">All-time</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Weekly Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sidebar-primary">{loading ? "..." : (profile?.stats?.weeklyWorkouts ?? 0)}</div>
            <CardDescription className="mt-2">Last 7 days</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Streak Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sidebar-primary">{loading ? "..." : (profile?.stats?.streak ?? 0)}</div>
            <CardDescription className="mt-2">Keep it up!</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest workouts and progress</CardDescription>
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
            <div className="space-y-3">
              {recent.map((w: any) => (
                <div key={w._id} className="flex items-center justify-between border-b last:border-b-0 pb-2">
                  <div>
                    <div className="font-medium">{w.title || w.workoutName || "Workout"}</div>
                    <div className="text-xs text-muted-foreground">{new Date(w.createdAt).toLocaleString()} • {w.duration || 0} min</div>
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

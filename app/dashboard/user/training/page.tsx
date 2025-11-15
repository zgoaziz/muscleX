"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TrainingPage() {
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await fetch("/api/workouts/sessions", { cache: "no-store" })
        const data = await res.json()
        if (res.ok) setItems(data.items || [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-balance">Training Log</h1>
          <p className="text-muted-foreground mt-2">Review and log your training sessions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Training Sessions</CardTitle>
          <CardDescription>View your training history</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : items.length === 0 ? (
            <>
              <p className="text-muted-foreground mb-6">No training logs yet. Start logging your workouts!</p>
              <Link href="/dashboard/user/workouts/create">
                <Button className="bg-sidebar-primary hover:bg-sidebar-primary/90">Log New Session</Button>
              </Link>
            </>
          ) : (
            <div className="space-y-3">
              {items.map((w: any) => (
                <div key={w._id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                  <div>
                    <div className="font-medium">{w.title || w.workoutName || "Workout"}</div>
                    <div className="text-xs text-muted-foreground">{new Date(w.createdAt).toLocaleString()} • {w.duration || 0} min • {w.status || "in_progress"}</div>
                  </div>
                  <Link href="/dashboard/user/workouts">
                    <Button variant="outline" size="sm">Open</Button>
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

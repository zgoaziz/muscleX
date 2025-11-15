"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProgramsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await fetch("/api/programs", { cache: "no-store" })
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
          <h1 className="text-4xl font-bold text-balance">Training Programs</h1>
          <p className="text-muted-foreground mt-2">Browse and select training programs to get started</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Programs</CardTitle>
          <CardDescription>Select a program to begin your training</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : items.length === 0 ? (
            <div>
              <p className="text-muted-foreground mb-6">No programs available yet.</p>
              <Link href="/workouts">
                <Button className="bg-sidebar-primary hover:bg-sidebar-primary/90">Browse All Programs</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((p: any) => (
                <div key={p._id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.level} • {p.duration}w • {p.sessionsPerWeek}x/week</div>
                  </div>
                  <Link href={`/workouts`}>
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

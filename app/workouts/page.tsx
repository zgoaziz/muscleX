"use client"

import { Navbar } from "@/components/navbar"
import { WorkoutCard } from "@/components/workout-card"
import type { Level } from "@/lib/types"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"

export default function WorkoutsPage() {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const filteredWorkouts = useMemo(() => {
    const arr = items
    if (!selectedLevel) return arr
    return arr.filter((w) => w.level === selectedLevel)
  }, [selectedLevel, items])

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const qs = selectedLevel ? `?level=${encodeURIComponent(selectedLevel)}` : ""
        const res = await fetch(`/api/programs${qs}`, { cache: "no-store" })
        const data = await res.json()
        if (res.ok) setItems(data.items || [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [selectedLevel])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Training Programs</h1>
            <p className="text-lg text-muted-foreground">
              Choose a pre-designed program or create your own custom workout
            </p>
          </div>

          {/* Level Filter */}
          <div className="flex gap-3 mb-10 flex-wrap">
            <Button
              onClick={() => setSelectedLevel(null)}
              variant={selectedLevel === null ? "default" : "outline"}
              className={selectedLevel === null ? "bg-primary hover:bg-primary/90" : ""}
            >
              All Programs
            </Button>
            {(["beginner", "intermediate", "advanced"] as Level[]).map((level) => (
              <Button
                key={level}
                onClick={() => setSelectedLevel(level)}
                variant={selectedLevel === level ? "default" : "outline"}
                className={selectedLevel === level ? "bg-primary hover:bg-primary/90" : ""}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </div>

          {/* Workouts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {!loading && filteredWorkouts.map((workout: any) => (
              <WorkoutCard key={workout._id || workout.id} workout={{ ...workout, id: workout._id || workout.id } as any} />
            ))}
            {loading && <div className="col-span-3 text-center text-muted-foreground">Loading...</div>}
          </div>

          {/* Create Custom */}
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-8 border border-primary/30">
            <h2 className="text-2xl font-bold mb-3">Create Custom Workout</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Mix and match exercises from our catalog to create a personalized training program
            </p>
            <Button className="bg-primary hover:bg-primary/90">Build Workout</Button>
          </div>
        </div>
      </main>
    </>
  )
}

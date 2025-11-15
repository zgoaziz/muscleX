import * as React from "react"
import { exercises } from "@/lib/data"
import ExerciseDetailClient from "@/components/exercises/ExerciseDetailClient"

export default function ExerciseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const exercise = exercises.find((e) => e.id === id)
  return <ExerciseDetailClient exercise={exercise} />
}

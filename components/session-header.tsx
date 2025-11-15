"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, X } from "lucide-react"

interface SessionHeaderProps {
  workoutName: string
  currentExerciseIndex: number
  totalExercises: number
  elapsed: number
  onQuit: () => void
}

export function SessionHeader({
  workoutName,
  currentExerciseIndex,
  totalExercises,
  elapsed,
  onQuit,
}: SessionHeaderProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return hours > 0
      ? `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      : `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = (currentExerciseIndex / totalExercises) * 100

  return (
    <div className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{workoutName}</h1>
            <p className="text-sm text-muted-foreground">
              Exercise {currentExerciseIndex + 1} of {totalExercises}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold tabular-nums">{formatTime(elapsed)}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onQuit}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <Progress value={progress} className="h-2" />
      </div>
    </div>
  )
}

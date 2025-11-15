"use client"

import { useWorkoutStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { WorkoutMetrics } from "@/components/workout-metrics"
import type { WorkoutSession, Workout } from "@/lib/types"

interface SessionStatsProps {
  elapsed: number
  workout: WorkoutSession
  workoutTemplate: Workout
}

export function SessionStats({ elapsed, workout, workoutTemplate }: SessionStatsProps) {
  const { getWorkoutProgress, getExerciseProgress, currentExerciseIndex } = useWorkoutStore()
  const progress = getWorkoutProgress()
  const exerciseProgress = getExerciseProgress(currentExerciseIndex)

  return (
    <div className="space-y-4 sticky top-24">
      <Card className="p-6 border-border">
        <h3 className="font-semibold mb-4">Session Statistics</h3>

        {/* Overall Progress */}
        <div className="space-y-3 pb-4 border-b border-border mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold">{progress.percentage}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress.percentage}%` }} />
          </div>
        </div>

        {/* Exercise Progress */}
        <div className="space-y-3 pb-4 border-b border-border mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Exercise</span>
            <span className="font-semibold">
              {exerciseProgress.completedSets}/{exerciseProgress.totalSets}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${exerciseProgress.percentage}%` }}
            />
          </div>
        </div>

        {/* Workout Metrics */}
        <WorkoutMetrics
          elapsed={elapsed}
          workout={workout}
          workoutTemplate={workoutTemplate}
          completedExercises={progress.completedExercises}
          totalExercises={progress.totalExercises}
        />
      </Card>
    </div>
  )
}

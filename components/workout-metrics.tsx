"use client"

import { useMemo } from "react"
import type { WorkoutSession, Workout } from "@/lib/types"
import { Flame, Heart, TrendingUp, Zap } from "lucide-react"

interface WorkoutMetricsProps {
  elapsed: number
  workout: WorkoutSession
  workoutTemplate: Workout
  completedExercises: number
  totalExercises: number
}

export function WorkoutMetrics({
  elapsed,
  workout,
  workoutTemplate,
  completedExercises,
  totalExercises,
}: WorkoutMetricsProps) {
  const metrics = useMemo(() => {
    // Calculate metrics based on elapsed time and exercises
    const minutes = Math.max(1, elapsed / 60)

    // Estimate calories burned (varies by exercise intensity and body weight)
    const baseCaloriesPerMinute = 5 // average for moderate intensity
    const caloriesBurned = Math.floor(minutes * baseCaloriesPerMinute)

    // Calculate average time per exercise
    const avgTimePerExercise = elapsed / Math.max(1, completedExercises)

    // Estimate remaining time
    const remainingExercises = totalExercises - completedExercises
    const estimatedTimeRemaining = Math.floor(avgTimePerExercise * remainingExercises)

    // Calculate heart rate estimate (for display purposes)
    const baseHeartRate = 70
    const intensityMultiplier = 1.2 + completedExercises / (totalExercises * 0.5)
    const estimatedHeartRate = Math.floor(baseHeartRate * intensityMultiplier)

    // Calculate total sets completed
    const totalSetsCompleted = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)

    // Estimate total reps
    const totalRepsCompleted = workout.exercises.reduce(
      (sum, ex) => sum + ex.sets.reduce((setSum, set) => setSum + (set.repsCompleted || 0), 0),
      0,
    )

    return {
      caloriesBurned,
      estimatedTimeRemaining,
      estimatedHeartRate,
      totalSetsCompleted,
      totalRepsCompleted,
      avgTimePerExercise: Math.floor(avgTimePerExercise),
    }
  }, [elapsed, workout, completedExercises, totalExercises])

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center justify-between p-3 rounded-lg bg-background">
          <div className="flex items-center gap-2 min-w-0">
            <Flame className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span className="text-xs text-muted-foreground truncate">Calories</span>
          </div>
          <span className="font-semibold text-sm">{metrics.caloriesBurned}</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-background">
          <div className="flex items-center gap-2 min-w-0">
            <Heart className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-xs text-muted-foreground truncate">Est. HR</span>
          </div>
          <span className="font-semibold text-sm">{metrics.estimatedHeartRate}</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-background">
          <div className="flex items-center gap-2 min-w-0">
            <Zap className="w-4 h-4 text-yellow-500 flex-shrink-0" />
            <span className="text-xs text-muted-foreground truncate">Sets</span>
          </div>
          <span className="font-semibold text-sm">{metrics.totalSetsCompleted}</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-background">
          <div className="flex items-center gap-2 min-w-0">
            <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-xs text-muted-foreground truncate">Reps</span>
          </div>
          <span className="font-semibold text-sm">{metrics.totalRepsCompleted}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-border space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Est. Time Remaining</span>
          <span className="font-semibold">
            {Math.floor(metrics.estimatedTimeRemaining / 60)}m {metrics.estimatedTimeRemaining % 60}s
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Avg Time/Exercise</span>
          <span className="font-semibold">{metrics.avgTimePerExercise}s</span>
        </div>
      </div>
    </div>
  )
}

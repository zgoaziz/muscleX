"use client"

import { Navbar } from "@/components/navbar"
import { useWorkoutStore } from "@/lib/store"
import { workouts, exercises } from "@/lib/data"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ExerciseTracker } from "@/components/exercise-tracker"
import { SessionStats } from "@/components/session-stats"
import { SessionHeader } from "@/components/session-header"

export default function WorkoutSessionPage() {
  const {
    currentWorkout,
    workoutStartTime,
    currentExerciseIndex,
    setCurrentWorkout,
    setWorkoutStartTime,
    setCurrentExerciseIndex,
  } = useWorkoutStore()
  const router = useRouter()
  const [elapsed, setElapsed] = useState(0)

  const workout = currentWorkout ? workouts.find((w) => w.id === currentWorkout.workoutId) : null
  const currentExerciseData = currentExerciseIndex >= 0 && workout ? workout.exercises[currentExerciseIndex] : null
  const currentExerciseInfo = currentExerciseData
    ? exercises.find((e) => e.id === currentExerciseData.exerciseId)
    : null

  // Timer for elapsed time
  useEffect(() => {
    if (!workoutStartTime) return
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - workoutStartTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [workoutStartTime])

  // Redirect if no active workout
  useEffect(() => {
    if (!currentWorkout) {
      router.push("/workouts")
    }
  }, [currentWorkout, router])

  if (!currentWorkout || !workout || !currentExerciseInfo || !currentExerciseData) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">No active workout. Starting one now...</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <SessionHeader
          workoutName={workout.name}
          currentExerciseIndex={currentExerciseIndex}
          totalExercises={workout.exercises.length}
          elapsed={elapsed}
          onQuit={() => {
            setCurrentWorkout(null)
            setWorkoutStartTime(null)
            setCurrentExerciseIndex(0)
            router.push("/workouts")
          }}
        />

        <div className="flex flex-col lg:flex-row gap-8 p-6 max-w-7xl mx-auto">
          {/* Main Exercise Tracker */}
          <div className="flex-1">
            <ExerciseTracker
              exercise={currentExerciseInfo}
              exerciseData={currentExerciseData}
              exerciseIndex={currentExerciseIndex}
              totalExercises={workout.exercises.length}
              workout={currentWorkout}
            />
          </div>

          {/* Sidebar Stats */}
          <div className="w-full lg:w-80">
            <SessionStats elapsed={elapsed} workout={currentWorkout} workoutTemplate={workout} />
          </div>
        </div>
      </main>
    </>
  )
}

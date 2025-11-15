"use client"

import { useState, useEffect } from "react"
import { useWorkoutStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, ChevronDown } from "lucide-react"
import type { Exercise, WorkoutSession } from "@/lib/types"

interface ExerciseTrackerProps {
  exercise: Exercise | undefined
  exerciseData: any
  exerciseIndex: number
  totalExercises: number
  workout: WorkoutSession
}

export function ExerciseTracker({
  exercise,
  exerciseData,
  exerciseIndex,
  totalExercises,
  workout,
}: ExerciseTrackerProps) {
  const {
    completeExerciseSet,
    setCurrentExerciseIndex,
    addWorkoutSession,
    completeWorkout,
    setCurrentWorkout,
    setWorkoutStartTime,
  } = useWorkoutStore()

  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  const [repsInput, setRepsInput] = useState("")
  const [restTimeLeft, setRestTimeLeft] = useState(0)

  // Rest timer countdown
  useEffect(() => {
    if (restTimeLeft <= 0) return
    const interval = setInterval(() => {
      setRestTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [restTimeLeft])

  if (!exercise || !exerciseData) {
    return <div className="text-center text-muted-foreground">Loading exercise...</div>
  }

  const handleSetComplete = () => {
    if (!repsInput) return

    completeExerciseSet(exerciseIndex, currentSetIndex + 1, Number.parseInt(repsInput))

    if (currentSetIndex < exerciseData.sets - 1) {
      // More sets for this exercise
      setRestTimeLeft(exerciseData.rest)
      setCurrentSetIndex(currentSetIndex + 1)
      setRepsInput("")
    } else if (exerciseIndex < totalExercises - 1) {
      // Next exercise
      setCurrentExerciseIndex(exerciseIndex + 1)
      setCurrentSetIndex(0)
      setRepsInput("")
      setRestTimeLeft(0)
    } else {
      // Workout complete
      const completedWorkout = {
        ...workout,
        completed: true,
      }
      addWorkoutSession(completedWorkout)
      completeWorkout()
      setCurrentWorkout(null)
      setWorkoutStartTime(null)
    }
  }

  const handleSkipExercise = () => {
    if (exerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(exerciseIndex + 1)
      setCurrentSetIndex(0)
      setRepsInput("")
      setRestTimeLeft(0)
    }
  }

  const completedSets = workout.exercises[exerciseIndex]?.sets.length || 0
  const totalSets = exerciseData.sets

  return (
    <div className="space-y-6">
      {/* Exercise Image */}
      <div className="rounded-2xl overflow-hidden bg-muted aspect-video w-full">
        <img src={exercise.image || "/placeholder.svg"} alt={exercise.name} className="w-full h-full object-cover" />
      </div>

      {/* Exercise Info */}
      <div>
        <h2 className="text-4xl font-bold mb-2">{exercise.name}</h2>
        <p className="text-muted-foreground mb-4">{exercise.description}</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Set</p>
            <p className="text-2xl font-bold">
              {currentSetIndex + 1}/{totalSets}
            </p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Target Reps</p>
            <p className="text-2xl font-bold">{exerciseData.reps}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Rest (sec)</p>
            <p className="text-2xl font-bold">{restTimeLeft || exerciseData.rest}</p>
          </div>
        </div>
      </div>

      {/* Rest Timer */}
      {restTimeLeft > 0 && (
        <div className="bg-card rounded-2xl p-8 border border-border text-center">
          <p className="text-sm text-muted-foreground mb-4">Rest period</p>
          <div className="text-7xl font-bold text-primary mb-4">{restTimeLeft}</div>
          <Button variant="outline" onClick={() => setRestTimeLeft(0)} className="w-full">
            Skip Rest
          </Button>
        </div>
      )}

      {/* Reps Input */}
      {restTimeLeft === 0 && (
        <div className="bg-card rounded-2xl p-6 border border-border">
          <label className="block text-sm font-semibold mb-4">Reps Completed</label>
          <div className="flex gap-2 mb-4">
            <Input
              type="number"
              value={repsInput}
              onChange={(e) => setRepsInput(e.target.value)}
              placeholder={`Target: ${exerciseData.reps}`}
              className="flex-1 text-lg font-semibold"
              autoFocus
            />
          </div>
          <Button
            onClick={handleSetComplete}
            disabled={!repsInput}
            className="w-full bg-primary hover:bg-primary/90 py-6 text-lg"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Complete Set
          </Button>
        </div>
      )}

      {/* Completed Sets */}
      {completedSets > 0 && (
        <div className="bg-green-500/5 rounded-2xl p-6 border border-green-500/20">
          <h3 className="font-semibold mb-3">Completed Sets</h3>
          <div className="space-y-2">
            {workout.exercises[exerciseIndex]?.sets.map((s, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm font-semibold">
                  Set {s.setNumber}: {s.repsCompleted} reps
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={handleSkipExercise} className="flex-1 bg-transparent">
          <ChevronDown className="w-4 h-4 mr-2" />
          Skip Exercise
        </Button>
      </div>
    </div>
  )
}

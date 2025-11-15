"use client"

import { useEffect, useState } from "react"
import { useWorkoutStore } from "@/lib/store"
import { workouts, exercises } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, X } from "lucide-react"

export function ActiveWorkout() {
  const {
    currentWorkout,
    workoutStartTime,
    currentExerciseIndex,
    user,
    setCurrentExerciseIndex,
    completeExerciseSet,
    completeWorkout,
    setCurrentWorkout,
    addWorkoutSession,
    setWorkoutStartTime,
  } = useWorkoutStore()

  const [elapsed, setElapsed] = useState(0)
  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  const [repsInput, setRepsInput] = useState("")
  const [restTimeLeft, setRestTimeLeft] = useState(0)

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

  // Rest timer
  useEffect(() => {
    if (restTimeLeft <= 0) return
    const interval = setInterval(() => {
      setRestTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [restTimeLeft])

  const handleSetComplete = () => {
    if (!repsInput) return

    completeExerciseSet(currentExerciseIndex, currentSetIndex + 1, Number.parseInt(repsInput))

    if (currentExerciseData && currentSetIndex < currentExerciseData.sets - 1) {
      // More sets for this exercise
      setRestTimeLeft(currentExerciseData.rest)
      setCurrentSetIndex(currentSetIndex + 1)
      setRepsInput("")
    } else if (workout && currentExerciseIndex < workout.exercises.length - 1) {
      // Next exercise
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setCurrentSetIndex(0)
      setRepsInput("")
      setRestTimeLeft(0)
    } else {
      // Workout complete
      handleCompleteWorkout()
    }
  }

  const handleCompleteWorkout = () => {
    if (currentWorkout) {
      currentWorkout.completed = true
      currentWorkout.duration = elapsed
      addWorkoutSession(currentWorkout)
      completeWorkout()
      setCurrentWorkout(null)
      setWorkoutStartTime(null)
    }
  }

  const handleSkipExercise = () => {
    if (workout && currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setCurrentSetIndex(0)
      setRepsInput("")
      setRestTimeLeft(0)
    } else {
      handleCompleteWorkout()
    }
  }

  if (!currentWorkout || !workout || !currentExerciseInfo || !currentExerciseData) {
    return null
  }

  const totalExercises = workout.exercises.length
  const completedExercises = currentExerciseIndex
  const completedSets = currentWorkout.exercises[currentExerciseIndex]?.sets.length || 0
  const totalSets = currentExerciseData.sets
  const progress = (completedExercises + completedSets / totalSets) / totalExercises

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{workout.name}</h1>
          <p className="text-sm text-muted-foreground">
            Exercise {currentExerciseIndex + 1} of {totalExercises}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold">{formatTime(elapsed)}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setCurrentWorkout(null)
              setWorkoutStartTime(null)
              setCurrentExerciseIndex(0)
            }}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 sm:px-6 py-4 bg-card border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <Progress value={progress * 100} className="flex-1" />
          <span className="text-sm font-semibold text-muted-foreground">{Math.round(progress * 100)}%</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Exercise Image */}
          <div className="mb-8 rounded-2xl overflow-hidden bg-muted aspect-video">
            <img
              src={currentExerciseInfo.image || "/placeholder.svg"}
              alt={currentExerciseInfo.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Exercise Name & Details */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-4">{currentExerciseInfo.name}</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="text-sm text-muted-foreground mb-1">Set</p>
                <p className="text-2xl font-bold">
                  {currentSetIndex + 1}/{totalSets}
                </p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="text-sm text-muted-foreground mb-1">Target Reps</p>
                <p className="text-2xl font-bold">{currentExerciseData.reps}</p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="text-sm text-muted-foreground mb-1">Rest (sec)</p>
                <p className="text-2xl font-bold">{restTimeLeft || currentExerciseData.rest}</p>
              </div>
            </div>
          </div>

          {/* Rest Timer */}
          {restTimeLeft > 0 && (
            <div className="mb-8 text-center">
              <div className="inline-block">
                <div className="text-6xl font-bold text-primary mb-4">{restTimeLeft}</div>
                <p className="text-lg text-muted-foreground">Rest period</p>
              </div>
            </div>
          )}

          {/* Reps Input */}
          {restTimeLeft === 0 && (
            <div className="mb-8 bg-card rounded-2xl p-6 border border-border">
              <label className="block text-sm font-semibold mb-4">Reps Completed</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="number"
                  value={repsInput}
                  onChange={(e) => setRepsInput(e.target.value)}
                  placeholder={`Target: ${currentExerciseData.reps}`}
                  className="flex-1 px-4 py-3 bg-input border border-border rounded-lg text-lg font-semibold"
                  autoFocus
                />
              </div>
              <Button
                onClick={handleSetComplete}
                disabled={!repsInput}
                className="w-full bg-primary hover:bg-primary/90 py-6 text-lg rounded-lg"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Complete Set
              </Button>
            </div>
          )}

          {/* Completed Sets */}
          {currentWorkout.exercises[currentExerciseIndex]?.sets.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold mb-3">Completed Sets</h3>
              <div className="space-y-2">
                {currentWorkout.exercises[currentExerciseIndex].sets.map((s, idx) => (
                  <div
                    key={idx}
                    className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-semibold">
                      Set {s.setNumber}: {s.repsCompleted} reps
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-card border-t border-border px-4 sm:px-6 py-4 flex gap-3">
        <Button variant="outline" onClick={handleSkipExercise} className="flex-1 bg-transparent">
          Skip Exercise
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            setCurrentWorkout(null)
            setWorkoutStartTime(null)
            setCurrentExerciseIndex(0)
          }}
          className="flex-1"
        >
          End Workout
        </Button>
      </div>
    </div>
  )
}

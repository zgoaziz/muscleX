"use client"

import { Navbar } from "@/components/navbar"
import { workouts, exercises } from "@/lib/data"
import { notFound, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Calendar, Users } from "lucide-react"
import Link from "next/link"
import { useWorkoutStore } from "@/lib/store"
import { useMemo, useState } from "react"

const levelColors = {
  beginner: "bg-green-500/20 text-green-700 dark:text-green-400",
  intermediate: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  advanced: "bg-red-500/20 text-red-700 dark:text-red-400",
}

export default function WorkoutDetailPage({ params }: { params: { id: string } }) {
  const workout = workouts.find((w) => w.id === params.id)
  const { currentWorkout, setCurrentWorkout, setWorkoutStartTime, resumeWorkout, user } = useWorkoutStore()
  const router = useRouter()
  const [showResumeDialog, setShowResumeDialog] = useState(false)

  if (!workout) {
    notFound()
  }

  const workoutExercises = useMemo(
    () =>
      workout.exercises.map((we) => {
        const exercise = exercises.find((e) => e.id === we.exerciseId)
        return { ...exercise, ...we }
      }),
    [workout],
  )

  // Check if there's an incomplete session of this workout to resume
  const lastIncompleteSession = useMemo(() => {
    return user.stats.workoutHistory.find(
      (session) =>
        session.workoutId === workout.id &&
        !session.completed &&
        new Date(session.date) > new Date(Date.now() - 24 * 60 * 60 * 1000),
    )
  }, [user.stats.workoutHistory, workout.id])

  const handleStartWorkout = () => {
    const session = {
      id: `session-${Date.now()}`,
      date: new Date().toISOString(),
      workoutId: workout.id,
      duration: 0,
      completed: false,
      exercises: workout.exercises.map(() => ({
        exerciseId: "",
        sets: [],
        totalTime: 0,
      })),
    }
    setCurrentWorkout(session)
    setWorkoutStartTime(Date.now())
    router.push("/workout/session")
  }

  const handleResumeWorkout = () => {
    if (lastIncompleteSession) {
      resumeWorkout(lastIncompleteSession)
      router.push("/workout/session")
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Link href="/workouts" className="flex items-center gap-2 text-primary hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to programs
          </Link>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-start justify-between gap-6 mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-4">{workout.name}</h1>
                <Badge className={levelColors[workout.level]}>{workout.level}</Badge>
              </div>
            </div>

            {/* Image */}
            <div className="w-full rounded-2xl overflow-hidden bg-muted mb-8">
              <img src={workout.image || "/placeholder.svg"} alt={workout.name} className="w-full h-96 object-cover" />
            </div>

            {/* Description */}
            <div className="bg-card rounded-2xl p-6 border border-border mb-8">
              <p className="text-lg text-muted-foreground leading-relaxed">{workout.description}</p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Duration</h3>
              </div>
              <p className="text-2xl font-bold">{workout.duration} weeks</p>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Sessions Per Week</h3>
              </div>
              <p className="text-2xl font-bold">{workout.sessionsPerWeek}x</p>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-2">
                <Play className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Exercises</h3>
              </div>
              <p className="text-2xl font-bold">{workoutExercises.length}</p>
            </div>
          </div>

          {/* Exercises List */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Exercises in this Program</h2>
            <div className="space-y-4">
              {workoutExercises.map((exercise, idx) => (
                <div key={idx} className="bg-card rounded-xl p-5 border border-border">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex gap-4 flex-1">
                      <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        <img
                          src={exercise?.image || "/placeholder.svg"}
                          alt={exercise?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{exercise?.name}</h3>
                        <p className="text-sm text-muted-foreground">{exercise?.equipment?.join(", ")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-semibold">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Sets</p>
                        <p className="text-lg">{exercise.sets}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Reps</p>
                        <p className="text-lg">{exercise.reps}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Rest (sec)</p>
                        <p className="text-lg">{exercise.rest}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            {lastIncompleteSession && (
              <Button
                onClick={handleResumeWorkout}
                variant="outline"
                className="w-full py-7 text-lg rounded-2xl bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20"
              >
                <Play className="w-5 h-5 mr-2" />
                Resume Workout
              </Button>
            )}
            <Button
              onClick={handleStartWorkout}
              className="w-full bg-primary hover:bg-primary/90 py-7 text-lg rounded-2xl"
            >
              <Play className="w-5 h-5 mr-2" />
              {lastIncompleteSession ? "Start New Session" : "Start This Workout"}
            </Button>
          </div>
        </div>
      </main>

      {/* Resume Confirmation Dialog */}
      {showResumeDialog && lastIncompleteSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-2xl p-6 max-w-sm mx-4 border border-border">
            <h2 className="text-xl font-bold mb-2">Resume Workout?</h2>
            <p className="text-muted-foreground mb-6">
              You have an incomplete session from {new Date(lastIncompleteSession.date).toLocaleDateString()}. Would you
              like to resume it?
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowResumeDialog(false)
                  handleStartWorkout()
                }}
                className="flex-1"
              >
                Start New
              </Button>
              <Button
                onClick={() => {
                  setShowResumeDialog(false)
                  handleResumeWorkout()
                }}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Resume
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Lightbulb, ArrowLeft } from "lucide-react"
import Link from "next/link"

const muscleColors: Record<string, string> = {
  chest: "bg-red-500/20 text-red-700 dark:text-red-400",
  back: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
  arms: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  legs: "bg-green-500/20 text-green-700 dark:text-green-400",
  shoulders: "bg-purple-500/20 text-purple-700 dark:text-purple-400",
  abs: "bg-orange-500/20 text-orange-700 dark:text-orange-400",
  glutes: "bg-pink-500/20 text-pink-700 dark:text-pink-400",
}

const levelColors = {
  beginner: "bg-green-500/20 text-green-700 dark:text-green-400",
  intermediate: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  advanced: "bg-red-500/20 text-red-700 dark:text-red-400",
}

export type Exercise = {
  id: string
  name: string
  description: string
  image?: string
  videoUrl?: string
  level: keyof typeof levelColors
  muscles: string[]
  equipment: string[]
  steps: string[]
  tips: string[]
  commonMistakes: string[]
}

export default function ExerciseDetailClient({ exercise }: { exercise: Exercise | undefined }) {
  if (!exercise) {
    notFound()
  }
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/exercises" className="flex items-center gap-2 text-primary hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to exercises
          </Link>

          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-4">{exercise.name}</h1>
                <div className="flex flex-wrap gap-3">
                  <Badge className={levelColors[exercise.level]}>{exercise.level}</Badge>
                  {exercise.muscles.map((muscle) => (
                    <Badge key={muscle} className={muscleColors[muscle]}>
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative w-full rounded-2xl overflow-hidden bg-muted mb-8 cursor-pointer group" onClick={() => setVideoOpen(!videoOpen)}>
              {videoOpen ? (
                <iframe
                  width="100%"
                  height="500"
                  src={(exercise.videoUrl || "").concat("?autoplay=1")}
                  title={exercise.name}
                  frameBorder={0}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-2xl"
                />
              ) : (
                <>
                  <img
                    src={exercise.image || "/placeholder.svg"}
                    alt={exercise.name}
                    className="w-full h-96 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 ml-1" fill="white" viewBox="0 0 24 24">
                        <path d="M5 3v18l15-9z" />
                      </svg>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">{exercise.description}</p>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="text-2xl font-bold mb-4">How to Perform</h2>
                <ol className="space-y-3">
                  {exercise.steps.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Pro Tips</h2>
                </div>
                <ul className="space-y-2">
                  {exercise.tips.map((tip, index) => (
                    <li key={index} className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-6 h-6 text-orange-500" />
                  <h2 className="text-2xl font-bold">Common Mistakes</h2>
                </div>
                <ul className="space-y-2">
                  {exercise.commonMistakes.map((mistake, index) => (
                    <li key={index} className="flex gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-card rounded-2xl p-6 border border-border space-y-6">
                <h3 className="text-xl font-bold">Equipment Needed</h3>
                <div className="flex flex-wrap gap-2">
                  {exercise.equipment.map((equip) => (
                    <Badge key={equip} variant="outline" className="capitalize">
                      {equip}
                    </Badge>
                  ))}
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-xl font-bold mb-4">Muscles Worked</h3>
                  <div className="space-y-2">
                    {exercise.muscles.map((muscle) => (
                      <div key={muscle} className="flex items-center justify-between text-sm">
                        <span className="capitalize">{muscle}</span>
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90">Add to Workout</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

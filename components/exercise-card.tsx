import Link from "next/link"
import type { Exercise } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

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

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <Link href={`/exercises/${exercise.id}`}>
      <div className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer h-full">
        {/* Image */}
        <div className="relative w-full h-48 bg-muted overflow-hidden">
          <img
            src={exercise.image || "/placeholder.svg"}
            alt={exercise.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute top-3 right-3">
            <Badge className={`${levelColors[exercise.level]}`}>{exercise.level}</Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-3">
          <h3 className="font-semibold text-lg line-clamp-1">{exercise.name}</h3>

          {/* Muscles */}
          <div className="flex flex-wrap gap-2">
            {exercise.muscles.map((muscle) => (
              <Badge key={muscle} className={muscleColors[muscle]}>
                {muscle}
              </Badge>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">{exercise.equipment.join(", ")}</span>
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}

import Link from "next/link"
import type { Workout } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Calendar } from "lucide-react"

const levelColors = {
  beginner: "bg-green-500/20 text-green-700 dark:text-green-400",
  intermediate: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  advanced: "bg-red-500/20 text-red-700 dark:text-red-400",
}

export function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <Link href={`/workouts/${workout.id}`}>
      <div className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer h-full">
        {/* Image */}
        <div className="relative w-full h-56 bg-muted overflow-hidden">
          <img
            src={workout.image || "/placeholder.svg"}
            alt={workout.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute top-3 right-3">
            <Badge className={`${levelColors[workout.level]}`}>{workout.level}</Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">
          <h3 className="font-bold text-lg line-clamp-1">{workout.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{workout.description}</p>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 py-3 border-y border-border">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-semibold text-sm">{workout.duration}w</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Per Week</p>
                <p className="font-semibold text-sm">{workout.sessionsPerWeek}x</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{workout.exercises.length} exercises</span>
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}

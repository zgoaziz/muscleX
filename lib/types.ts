export type Muscle = "chest" | "back" | "arms" | "legs" | "shoulders" | "abs" | "glutes"
export type Level = "beginner" | "intermediate" | "advanced"
export type Equipment = "barbell" | "dumbbell" | "bodyweight" | "machine" | "cable"

export interface Exercise {
  id: string
  name: string
  muscles: Muscle[]
  level: Level
  equipment: Equipment[]
  description: string
  steps: string[]
  tips: string[]
  commonMistakes: string[]
  videoUrl: string
  image: string
}

export interface Workout {
  id: string
  name: string
  duration: number
  level: Level
  sessionsPerWeek: number
  exercises: WorkoutExercise[]
  description: string
  image: string
}

export interface WorkoutExercise {
  exerciseId: string
  sets: number
  reps: number
  rest: number
}

export interface UserStats {
  completedWorkouts: number
  currentWeight: number
  weeklyGoal: number
  workoutHistory: WorkoutSession[]
}

export interface WorkoutSession {
  id: string
  date: string
  workoutId: string
  duration: number
  completed: boolean
  exercises: CompletedExercise[]
}

export interface ExerciseSet {
  setNumber: number
  completed: boolean
  repsCompleted?: number
  timestamp?: string
}

export interface CompletedExercise {
  exerciseId: string
  sets: ExerciseSet[]
  totalTime: number
}

export interface DailyStat {
  date: string
  workoutsCompleted: number
  totalDuration: number
  totalCalories: number
  exercises: string[]
}

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  role: "user" | "admin"
  age: number
  height: number
  weight: number
  goal: string
  joinDate: string
  lastWorkoutDate: string | null
  dailyStats: DailyStat[]
  workoutHistory: WorkoutSession[]
  totalWorkouts: number
  stats: {
    totalDuration: number
    totalCalories: number
    favoriteExercises: string[]
    weeklyWorkouts: number
    streak: number
  }
}

export interface AdminStats {
  totalUsers: number
  totalWorkouts: number
  activeUsers: number
  totalCalories: number
}

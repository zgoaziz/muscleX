import { create } from "zustand"
import type { UserStats, WorkoutSession } from "./types"

interface User {
  name: string
  age: number
  height: number
  weight: number
  stats: UserStats
}

interface WorkoutStore {
  user: User
  currentWorkout: WorkoutSession | null
  workoutStartTime: number | null
  currentExerciseIndex: number
  setUser: (user: User) => void
  addWorkoutSession: (session: WorkoutSession) => void
  updateWeight: (weight: number) => void
  setCurrentWorkout: (workout: WorkoutSession | null) => void
  setWorkoutStartTime: (time: number | null) => void
  setCurrentExerciseIndex: (index: number) => void
  completeExerciseSet: (exerciseIndex: number, setNumber: number, repsCompleted: number) => void
  completeWorkout: () => void
  updateExerciseCompletion: (exerciseIndex: number, setIndex: number, reps: number) => void
  markExerciseComplete: (exerciseIndex: number) => void
  getExerciseProgress: (exerciseIndex: number) => { completedSets: number; totalSets: number; percentage: number }
  resumeWorkout: (session: WorkoutSession) => void
  getWorkoutProgress: () => { percentage: number; completedExercises: number; totalExercises: number }
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  user: {
    name: "Alex",
    age: 28,
    height: 180,
    weight: 82,
    stats: {
      completedWorkouts: 24,
      currentWeight: 82,
      weeklyGoal: 4,
      workoutHistory: [],
    },
  },
  currentWorkout: null,
  workoutStartTime: null,
  currentExerciseIndex: 0,
  setUser: (user) => set({ user }),
  addWorkoutSession: (session) =>
    set((state) => ({
      user: {
        ...state.user,
        stats: {
          ...state.user.stats,
          workoutHistory: [...state.user.stats.workoutHistory, session],
          completedWorkouts: state.user.stats.completedWorkouts + (session.completed ? 1 : 0),
        },
      },
    })),
  updateWeight: (weight) =>
    set((state) => ({
      user: {
        ...state.user,
        weight,
        stats: {
          ...state.user.stats,
          currentWeight: weight,
        },
      },
    })),
  setCurrentWorkout: (workout) => set({ currentWorkout: workout }),
  setWorkoutStartTime: (time) => set({ workoutStartTime: time }),
  setCurrentExerciseIndex: (index) => set({ currentExerciseIndex: index }),
  completeExerciseSet: (exerciseIndex: number, setNumber: number, repsCompleted: number) =>
    set((state) => {
      if (!state.currentWorkout) return state
      const updatedWorkout = { ...state.currentWorkout }
      const exercise = updatedWorkout.exercises[exerciseIndex]
      if (!exercise) return state

      const setIndex = setNumber - 1
      if (!exercise.sets[setIndex]) {
        exercise.sets[setIndex] = {
          setNumber,
          completed: true,
          repsCompleted,
          timestamp: new Date().toISOString(),
        }
      } else {
        exercise.sets[setIndex].completed = true
        exercise.sets[setIndex].repsCompleted = repsCompleted
        exercise.sets[setIndex].timestamp = new Date().toISOString()
      }

      return { currentWorkout: updatedWorkout }
    }),
  completeWorkout: () =>
    set((state) => {
      if (!state.currentWorkout || !state.workoutStartTime) return state
      const completedWorkout = {
        ...state.currentWorkout,
        completed: true,
        duration: Math.floor((Date.now() - state.workoutStartTime) / 1000),
      }
      return {
        currentWorkout: null,
        workoutStartTime: null,
        currentExerciseIndex: 0,
      }
    }),
  updateExerciseCompletion: (exerciseIndex: number, setIndex: number, reps: number) =>
    set((state) => {
      if (!state.currentWorkout) return state
      const updatedWorkout = { ...state.currentWorkout }
      const exerciseData = updatedWorkout.exercises[exerciseIndex]

      if (!exerciseData) return state

      // Ensure sets array exists and has proper structure
      if (!exerciseData.sets) {
        exerciseData.sets = []
      }

      // Update or create the set
      if (!exerciseData.sets[setIndex]) {
        exerciseData.sets[setIndex] = {
          setNumber: setIndex + 1,
          completed: true,
          repsCompleted: reps,
          timestamp: new Date().toISOString(),
        }
      } else {
        exerciseData.sets[setIndex] = {
          ...exerciseData.sets[setIndex],
          completed: true,
          repsCompleted: reps,
          timestamp: new Date().toISOString(),
        }
      }

      return { currentWorkout: updatedWorkout }
    }),
  markExerciseComplete: (exerciseIndex: number) =>
    set((state) => {
      if (!state.currentWorkout) return state
      const updatedWorkout = { ...state.currentWorkout }
      updatedWorkout.exercises[exerciseIndex] = {
        ...updatedWorkout.exercises[exerciseIndex],
      }
      return { currentWorkout: updatedWorkout }
    }),
  getExerciseProgress: (exerciseIndex: number) => {
    const state = get()
    if (!state.currentWorkout || !state.currentWorkout.exercises[exerciseIndex]) {
      return { completedSets: 0, totalSets: 0, percentage: 0 }
    }
    const exercise = state.currentWorkout.exercises[exerciseIndex]
    const completedSets = exercise.sets.filter((s) => s.completed).length
    const totalSets = exercise.sets.length
    return {
      completedSets,
      totalSets,
      percentage: totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0,
    }
  },
  resumeWorkout: (session: WorkoutSession) =>
    set({
      currentWorkout: session,
      workoutStartTime: Date.now(),
      currentExerciseIndex: 0,
    }),
  getWorkoutProgress: () => {
    const state = get()
    if (!state.currentWorkout) {
      return { percentage: 0, completedExercises: 0, totalExercises: 0 }
    }
    const totalExercises = state.currentWorkout.exercises.length
    const completedExercises = state.currentWorkout.exercises.filter(
      (ex) => ex.sets.length > 0 && ex.sets.every((s) => s.completed),
    ).length
    return {
      percentage: totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0,
      completedExercises,
      totalExercises,
    }
  },
}))

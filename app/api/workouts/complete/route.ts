import { type NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { addWorkoutToUser } from "@/lib/models"

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req)
    if (!authUser) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { workoutId, workoutName, duration, exercises, calories } = await req.json()

    if (!workoutId || !duration || !exercises) {
      return NextResponse.json({ error: "Données d'entraînement manquantes" }, { status: 400 })
    }

    const workoutData = {
      workoutId,
      workoutName: workoutName || "Workout",
      duration,
      exercises,
      calories: calories || Math.floor(duration * 5), // Estimate calories
      completed: true,
      date: new Date().toISOString(),
    }

    const updatedUser = await addWorkoutToUser(authUser.userId, workoutData)

    return NextResponse.json({
      success: true,
      message: "Entraînement complété avec succès",
      user: updatedUser,
    })
  } catch (error: any) {
    console.error("Complete workout error:", error)
    return NextResponse.json({ error: "Erreur lors de la sauvegarde de l'entraînement" }, { status: 500 })
  }
}

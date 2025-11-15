import { type NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { getUserById, updateUser, getUserStats, getDailyStats } from "@/lib/models"

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req)
    if (!authUser) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const user = await getUserById(authUser.userId)
    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    const stats = await getUserStats(authUser.userId)
    const dailyStats = await getDailyStats(authUser.userId, 7)

    return NextResponse.json({
      user: {
        id: user._id?.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role || "user",
        age: user.age ?? null,
        height: user.height ?? null,
        weight: user.weight ?? null,
        goal: user.goal ?? "",
        notificationPrefs: user.notificationPrefs || { workoutReminders: true, achievements: true, weeklySummary: true },
        totalWorkouts: user.totalWorkouts || 0,
        lastWorkoutDate: user.lastWorkoutDate || null,
      },
      stats: stats || { totalDuration: 0, totalCalories: 0, favoriteExercises: [], weeklyWorkouts: 0, streak: 0 },
      dailyStats: Array.isArray(dailyStats) ? dailyStats : [],
    })
  } catch (error) {
    console.error("GET /api/profile error:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération du profil" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req)
    if (!authUser) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await req.json()
    const allowed = ["name", "age", "height", "weight", "goal", "phone", "notificationPrefs"]
    const updates: Record<string, any> = {}
    for (const key of allowed) {
      if (key in body) updates[key] = body[key]
    }

    const updated = await updateUser(authUser.userId, updates)

    return NextResponse.json({ success: true, user: updated?.value || null })
  } catch (error) {
    console.error("PUT /api/profile error:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour du profil" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { getUserStats, getDailyStats } from "@/lib/models"

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req)
    if (!authUser) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const stats = await getUserStats(authUser.userId)
    const dailyStats = await getDailyStats(authUser.userId, 7)

    return NextResponse.json({
      stats,
      dailyStats,
    })
  } catch (error: any) {
    console.error("Get stats error:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des statistiques" }, { status: 500 })
  }
}

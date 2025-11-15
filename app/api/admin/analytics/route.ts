import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { getAdminCounts } from "@/lib/models"

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req)
    if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    const counts = await getAdminCounts()
    return NextResponse.json({ counts })
  } catch (e) {
    console.error("GET /api/admin/analytics error", e)
    return NextResponse.json({ error: "Erreur lors du chargement" }, { status: 500 })
  }
}

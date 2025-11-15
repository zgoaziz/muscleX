import { type NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { createWorkoutSession, queryWorkoutSessions } from "@/lib/models"

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req)
    if (!auth) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const q = searchParams.get("q") || undefined
    const status = (searchParams.get("status") as any) || undefined
    const type = searchParams.get("type") || undefined
    const from = searchParams.get("from") || undefined
    const to = searchParams.get("to") || undefined

    const items = await queryWorkoutSessions(auth.userId, { q, status, type, from, to })
    return NextResponse.json({ items })
  } catch (e) {
    console.error("GET /api/workouts/sessions error", e)
    return NextResponse.json({ error: "Erreur lors du chargement des séances" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req)
    if (!auth) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

    const body = await req.json()
    const doc = {
      userId: auth.userId,
      title: body.title || "Séance",
      type: body.type || "custom",
      duration: Number(body.duration) || 0,
      exercises: Array.isArray(body.exercises) ? body.exercises : [],
      status: body.status || "in_progress",
      date: body.date || new Date().toISOString(),
    }
    const id = await createWorkoutSession(doc)
    return NextResponse.json({ id })
  } catch (e) {
    console.error("POST /api/workouts/sessions error", e)
    return NextResponse.json({ error: "Erreur lors de la création de la séance" }, { status: 500 })
  }
}

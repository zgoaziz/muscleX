import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { createExercise, queryExercises } from "@/lib/models"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get("q") || undefined
    const muscles = searchParams.getAll("muscles")
    const levels = searchParams.getAll("levels")
    const equipment = searchParams.getAll("equipment")
    const items = await queryExercises({ q, muscles, levels, equipment })
    return NextResponse.json({ items })
  } catch (e) {
    console.error("GET /api/exercises error", e)
    return NextResponse.json({ error: "Erreur lors du chargement des exercices" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req)
    if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    const body = await req.json()
    const id = await createExercise(body)
    return NextResponse.json({ id })
  } catch (e) {
    console.error("POST /api/exercises error", e)
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 })
  }
}

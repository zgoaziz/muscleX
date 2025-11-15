import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { createProgram, queryPrograms } from "@/lib/models"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const level = searchParams.get("level")
    const items = await queryPrograms({ level })
    return NextResponse.json({ items })
  } catch (e) {
    console.error("GET /api/programs error", e)
    return NextResponse.json({ error: "Erreur lors du chargement des programmes" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req)
    if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    const body = await req.json()
    const id = await createProgram(body)
    return NextResponse.json({ id })
  } catch (e) {
    console.error("POST /api/programs error", e)
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 })
  }
}

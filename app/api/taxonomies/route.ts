import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { getTaxonomies, updateTaxonomies } from "@/lib/models"

export async function GET() {
  try {
    const value = await getTaxonomies()
    return NextResponse.json({ value })
  } catch (e) {
    console.error("GET /api/taxonomies error", e)
    return NextResponse.json({ error: "Erreur lors du chargement" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await getAuthUser(req)
    if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    const body = await req.json()
    await updateTaxonomies(body.value)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("PUT /api/taxonomies error", e)
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
}

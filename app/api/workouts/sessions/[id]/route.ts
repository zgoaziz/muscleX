import { type NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { deleteWorkoutSession, updateWorkoutSession } from "@/lib/models"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser(req)
    if (!auth) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

    const updates = await req.json()
    const res = await updateWorkoutSession(params.id, updates)
    return NextResponse.json({ item: res?.value || null })
  } catch (e) {
    console.error("PUT /api/workouts/sessions/[id] error", e)
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser(req)
    if (!auth) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

    await deleteWorkoutSession(params.id)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("DELETE /api/workouts/sessions/[id] error", e)
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
}

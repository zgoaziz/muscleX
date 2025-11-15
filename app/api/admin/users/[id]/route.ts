import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { updateUser, deleteUser } from "@/lib/models"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser(req)
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }
    const updates = await req.json()
    const res = await updateUser(params.id, updates)
    return NextResponse.json({ item: res?.value || null })
  } catch (e) {
    console.error("PUT /api/admin/users/[id] error", e)
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser(req)
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }
    await deleteUser(params.id)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("DELETE /api/admin/users/[id] error", e)
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
}

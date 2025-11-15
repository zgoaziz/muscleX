import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { deleteMedia } from "@/lib/models"

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser(req)
    if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    await deleteMedia(params.id)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("DELETE /api/media/[id] error", e)
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
}

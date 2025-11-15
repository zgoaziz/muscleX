import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { createUser, getAllUsers } from "@/lib/models"

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req)
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }
    const users = await getAllUsers()
    return NextResponse.json({ items: users })
  } catch (e) {
    console.error("GET /api/admin/users error", e)
    return NextResponse.json({ error: "Erreur lors du chargement des utilisateurs" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req)
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }
    const body = await req.json()
    const id = await createUser({
      name: body.name,
      email: body.email,
      role: body.role || "user",
    })
    return NextResponse.json({ id })
  } catch (e) {
    console.error("POST /api/admin/users error", e)
    return NextResponse.json({ error: "Erreur lors de la création de l'utilisateur" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { createUser, getUserByEmail, createNotification } from "@/lib/models"
import { generateToken, setAuthCookie } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json()

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins 6 caractères" }, { status: 400 })
    }

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userId = await createUser({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "user",
    })

    try {
      await createNotification({
        type: "auth",
        title: "Nouvel utilisateur inscrit",
        message: `${name} (${email}) vient de s'inscrire sur la plateforme`,
        link: `/dashboard/users`,
      })
    } catch (error) {
      console.error("Error creating notification:", error)
    }

    const token = await generateToken({
      userId: userId.toString(),
      email,
      role: "user",
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
        name,
        email,
        phone,
      },
      token,
    })

    setAuthCookie(response, token)
    return response
  } catch (error: any) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 })
  }
}

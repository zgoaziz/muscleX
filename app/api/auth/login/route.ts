import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getUserByEmail } from "@/lib/models"
import { generateToken, setAuthCookie } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe sont requis" }, { status: 400 })
    }

    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    const userRole = user.role || "user"

    const token = await generateToken({
      userId: user._id?.toString() || (user._id as any)?.toString(),
      email: user.email,
      role: userRole,
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id?.toString() || (user._id as any)?.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: userRole,
      },
      token,
    })

    setAuthCookie(response, token)
    return response
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Erreur lors de la connexion" }, { status: 500 })
  }
}

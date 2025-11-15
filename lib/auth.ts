import { jwtVerify, SignJWT } from "jose"
import type { NextRequest, NextResponse } from "next/server"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-this")

export async function generateToken(payload: { userId: string; email: string; role: string }) {
  const token = await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(secret)
  return token
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload
  } catch (error) {
    return null
  }
}

export async function getAuthUser(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  if (!token) return null

  const payload = await verifyToken(token)
  return payload as any
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })
}

export function removeAuthCookie(response: NextResponse) {
  response.cookies.delete("token")
}

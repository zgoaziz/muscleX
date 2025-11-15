import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-this")

async function getRoleFromRequest(req: NextRequest): Promise<null | { userId: string; email: string; role: string }> {
  const token = req.cookies.get("token")?.value
  if (!token) return null
  try {
    const verified = await jwtVerify(token, secret)
    const payload = verified.payload as any
    return { userId: payload.userId, email: payload.email, role: payload.role }
  } catch (e) {
    return null
  }
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only protect /dashboard and its subpaths
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next()
  }

  const user = await getRoleFromRequest(req)

  // Not authenticated -> redirect to login
  if (!user) {
    const url = new URL("/auth/login", req.url)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // Root dashboard: route by role
  if (pathname === "/dashboard") {
    const target = user.role === "admin" ? "/dashboard/admin/home" : "/dashboard/user/home"
    return NextResponse.redirect(new URL(target, req.url))
  }

  // Guard admin area
  if (pathname.startsWith("/dashboard/admin") && user.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard/user/home", req.url))
  }

  // Guard user area: if admin hits user area, send to admin home
  if (pathname.startsWith("/dashboard/user") && user.role === "admin") {
    return NextResponse.redirect(new URL("/dashboard/admin/home", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}

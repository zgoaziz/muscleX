"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to user dashboard by default
    router.push("/dashboard/user/home")
  }, [router])

  return null
}

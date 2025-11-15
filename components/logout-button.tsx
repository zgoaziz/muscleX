"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useState } from "react"

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      localStorage.removeItem("user")
      router.push("/auth/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleLogout} disabled={loading} variant="ghost" size="sm" className="gap-2">
      <LogOut className="w-4 h-4" />
      Déconnexion
    </Button>
  )
}

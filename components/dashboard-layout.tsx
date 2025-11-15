import type React from "react"
import { Sidebar } from "./sidebar"
import { Breadcrumb } from "./breadcrumb"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole?: "user" | "admin"
}

export function DashboardLayout({ children, userRole = "user" }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={userRole} />
      <main className="flex-1 overflow-auto flex flex-col">
        <Breadcrumb />
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  )
}

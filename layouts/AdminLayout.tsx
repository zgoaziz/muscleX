import { ReactNode } from "react"
import { SidebarAdmin } from "@/components/sidebar-admin"
import { DashboardNavbar } from "@/components/dashboard-navbar"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <SidebarAdmin />
      <div className="flex-1">
        <DashboardNavbar title="Espace Admin" />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

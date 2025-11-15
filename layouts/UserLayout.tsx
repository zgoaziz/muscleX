import { ReactNode } from "react"
import { SidebarUser } from "@/components/sidebar-user"
import { DashboardNavbar } from "@/components/dashboard-navbar"

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <SidebarUser />
      <div className="flex-1">
        <DashboardNavbar title="Espace Utilisateur" />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

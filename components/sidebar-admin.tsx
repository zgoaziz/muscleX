import Link from "next/link"
import { LayoutDashboard, Users, Dumbbell, FileVideo, BarChart2, Settings } from "lucide-react"

export function SidebarAdmin() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-800 bg-[#1e1e1e] p-5 md:block">
      <h2 className="mb-6 text-xl font-bold text-red-500">Admin Panel</h2>
      <nav className="flex flex-col space-y-4 text-sm">
        <Link href="/dashboard/admin/home" className="flex items-center gap-2 hover:text-red-500"><LayoutDashboard size={18}/>Dashboard</Link>
        <Link href="/dashboard/admin/users" className="flex items-center gap-2 hover:text-red-500"><Users size={18}/>Utilisateurs</Link>
        <Link href="/dashboard/admin/exercises" className="flex items-center gap-2 hover:text-red-500"><Dumbbell size={18}/>Exercices</Link>
        <Link href="/dashboard/admin/media" className="flex items-center gap-2 hover:text-red-500"><FileVideo size={18}/>Médias</Link>
        <Link href="/dashboard/admin/stats" className="flex items-center gap-2 hover:text-red-500"><BarChart2 size={18}/>Statistiques</Link>
        <Link href="/dashboard/admin/settings" className="flex items-center gap-2 hover:text-red-500"><Settings size={18}/>Paramètres</Link>
      </nav>
    </aside>
  )
}

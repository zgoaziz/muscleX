import Link from "next/link"
import { Dumbbell, Home, BarChart2, User, ClipboardList, Play } from "lucide-react"

export function SidebarUser() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-800 bg-[#1e1e1e] p-5 md:block">
      <h2 className="mb-6 text-xl font-bold">MuscleX</h2>
      <nav className="flex flex-col space-y-4 text-sm">
        <Link href="/dashboard/user/home" className="flex items-center gap-2 hover:text-red-500"><Home size={18}/>Accueil</Link>
        <Link href="/dashboard/user/workouts" className="flex items-center gap-2 hover:text-red-500"><ClipboardList size={18}/>Séances</Link>
        <Link href="/dashboard/user/workouts/create" className="flex items-center gap-2 hover:text-red-500"><Dumbbell size={18}/>Créer séance</Link>
        <Link href="/dashboard/user/programs" className="flex items-center gap-2 hover:text-red-500"><Play size={18}/>Programmes</Link>
        <Link href="/dashboard/user/stats" className="flex items-center gap-2 hover:text-red-500"><BarChart2 size={18}/>Statistiques</Link>
        <Link href="/dashboard/user/profile" className="flex items-center gap-2 hover:text-red-500"><User size={18}/>Profil</Link>
      </nav>
    </aside>
  )
}

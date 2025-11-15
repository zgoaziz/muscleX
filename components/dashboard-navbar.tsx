"use client"

import { Dumbbell } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function DashboardNavbar({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between border-b border-gray-800 bg-[#1a1a1a] px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]">
          <Dumbbell className="h-4 w-4 text-white" />
        </div>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <ThemeToggle />
    </header>
  )
}

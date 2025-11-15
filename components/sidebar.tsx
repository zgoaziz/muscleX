"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  X,
  BarChart3,
  Users,
  Settings,
  Home,
  Dumbbell,
  TrendingUp,
  Activity,
  BookOpen,
  Package,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/logout-button"

interface SidebarProps {
  userRole?: "user" | "admin"
}

interface MenuItem {
  icon: React.ReactNode
  label: string
  href: string
}

export function Sidebar({ userRole = "user" }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()

  const userMenuItems: MenuItem[] = [
    { icon: <Home className="h-5 w-5" />, label: "Home", href: "/dashboard/user" },
    { icon: <Activity className="h-5 w-5" />, label: "Workouts", href: "/dashboard/user/workouts" },
    { icon: <TrendingUp className="h-5 w-5" />, label: "Progress", href: "/dashboard/user/progress" },
    { icon: <BarChart3 className="h-5 w-5" />, label: "Stats", href: "/dashboard/user/stats" },
    { icon: <BookOpen className="h-5 w-5" />, label: "Programs", href: "/dashboard/user/programs" },
    { icon: <Dumbbell className="h-5 w-5" />, label: "Training", href: "/dashboard/user/training" },
    { icon: <Users className="h-5 w-5" />, label: "Profile", href: "/dashboard/user/profile" },
    { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/dashboard/user/settings" },
  ]

  const adminMenuItems: MenuItem[] = [
    { icon: <Home className="h-5 w-5" />, label: "Home", href: "/dashboard/admin" },
    { icon: <Users className="h-5 w-5" />, label: "Users", href: "/dashboard/admin/users" },
    { icon: <Dumbbell className="h-5 w-5" />, label: "Programs", href: "/dashboard/admin/programs" },
    { icon: <Zap className="h-5 w-5" />, label: "Exercises", href: "/dashboard/admin/exercises" },
    { icon: <Package className="h-5 w-5" />, label: "Muscles", href: "/dashboard/admin/muscles" },
    { icon: <BarChart3 className="h-5 w-5" />, label: "Analytics", href: "/dashboard/admin/analytics" },
    { icon: <Activity className="h-5 w-5" />, label: "Media", href: "/dashboard/admin/media" },
    { icon: <TrendingUp className="h-5 w-5" />, label: "Stats", href: "/dashboard/admin/stats" },
    { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/dashboard/admin/settings" },
  ]

  const menuItems = userRole === "admin" ? adminMenuItems : userMenuItems

  const isActive = (href: string) => {
    if (href === "/dashboard/user" || href === "/dashboard/admin") {
      return pathname === href || pathname.startsWith(href + "/")
    }
    return pathname === href || pathname.startsWith(href)
  }

  return (
    <div
      className={`${isOpen ? "w-64" : "w-20"} bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col h-screen border-r border-sidebar-border`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {isOpen && <h1 className="text-lg font-bold text-sidebar-primary">MuscleX</h1>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              isOpen ? "" : "justify-center"
            } ${
              isActive(item.href)
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
            title={item.label}
          >
            {item.icon}
            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={`w-full ${isOpen ? "" : "flex justify-center"}`}>
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}

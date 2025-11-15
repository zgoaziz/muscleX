"use client"

import Link from "next/link"
import { Dumbbell, Home, BookOpen, Zap, User, Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { LogoutButton } from "./logout-button"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/exercises", label: "Exercises", icon: BookOpen },
    { href: "/workouts", label: "Programs", icon: Zap },
    { href: "/profile", label: "Profile", icon: User },
  ]

  const adminItems = user?.role === "admin" ? [{ href: "/dashboard", label: "Dashboard", icon: Zap }] : []

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 bg-white/10 backdrop-blur-md rounded-t-3xl rounded-b-3xl px-6 shadow-lg border border-white/20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-primary-foreground" />
            </div>
            <span>MuscleX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center text-foreground/90">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            })}
            {adminItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            })}
            {user ? (
              <LogoutButton />
            ) : (
              <Link href="/auth/login">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-semibold shadow-sm">
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-foreground/90">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 bg-white/10 backdrop-blur-md rounded-b-3xl mt-2 shadow-lg border border-white/20">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-3 hover:bg-foreground/5 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            {adminItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-3 hover:bg-foreground/5 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            {user ? (
              <div className="px-4 py-3">
                <LogoutButton />
              </div>
            ) : (
              <Link href="/auth/login" className="block px-4 py-3">
                <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-semibold shadow-sm">
                  Login
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

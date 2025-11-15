"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Flame, Dumbbell, Calendar, TrendingUp, Edit2, Save, X } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [dailyStats, setDailyStats] = useState<any[]>([])
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [needsInfoOpen, setNeedsInfoOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch("/api/profile", { cache: "no-store" })
        if (res.status === 401) {
          router.push("/auth/login")
          return
        }
        const data = await res.json()
        if (cancelled) return
        setUser(data.user)
        setStats(data.stats)
        setDailyStats(Array.isArray(data.dailyStats) ? data.dailyStats : [])
        setFormData({
          name: data.user?.name || "",
          email: data.user?.email || "",
          age: data.user?.age ?? "",
          height: data.user?.height ?? "",
          weight: data.user?.weight ?? "",
          goal: data.user?.goal || "",
        })
        const missing = !data.user?.age || !data.user?.height || !data.user?.weight
        setNeedsInfoOpen(missing)
      } catch (e) {
        
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [router])

  const weeklyData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const map: Record<string, { day: string; workouts: number; duration: number }> = {}
    for (const ds of dailyStats) {
      const d = new Date(ds.date)
      const label = days[d.getDay()]
      map[label] = map[label] || { day: label, workouts: 0, duration: 0 }
      map[label].workouts += ds.workoutsCompleted || 0
      map[label].duration += ds.totalDuration || 0
    }
    const ordered = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) =>
      map[label] || { day: label, workouts: 0, duration: 0 }
    )
    return ordered
  }, [dailyStats])

  const caloriesData = useMemo(() => {
    const total = dailyStats.reduce((sum, ds) => sum + (ds.totalCalories || 0), 0)
    return [
      { date: "Semaine", calories: total },
    ]
  }, [dailyStats])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = async () => {
    const payload: any = {
      name: formData.name,
      age: formData.age ? Number(formData.age) : null,
      height: formData.height ? Number(formData.height) : null,
      weight: formData.weight ? Number(formData.weight) : null,
      goal: formData.goal || "",
    }
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    setUser({ ...user, ...payload })
    setEditing(false)
    const missing = !payload.age || !payload.height || !payload.weight
    setNeedsInfoOpen(missing)
  }

  const handleCancel = () => {
    setFormData(user)
    setEditing(false)
  }

  if (loading || !user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement du profil...</p>
          </div>
        </div>
      </>
    )
  }

  

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">Mon Profil</h1>
                <p className="text-muted-foreground">Gérez vos informations de fitness</p>
              </div>
              {!editing ? (
                <Button onClick={() => setEditing(true)} className="gap-2 bg-primary hover:bg-primary/90">
                  <Edit2 className="w-4 h-4" />
                  Modifier
                </Button>
              ) : null}
            </div>

            {/* Profile Card */}
            <Card className="p-8 border border-border">
              {editing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom</label>
                      <Input type="text" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input type="email" name="email" value={formData.email} onChange={handleChange} disabled />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Âge</label>
                      <Input type="number" name="age" value={formData.age} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Taille (cm)</label>
                      <Input type="number" name="height" value={formData.height} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Poids (kg)</label>
                      <Input type="number" name="weight" value={formData.weight} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Objectif</label>
                      <Input type="text" name="goal" value={formData.goal} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSave} className="flex-1 gap-2 bg-primary hover:bg-primary/90">
                      <Save className="w-4 h-4" />
                      Enregistrer
                    </Button>
                    <Button onClick={handleCancel} variant="outline" className="flex-1 gap-2 bg-transparent">
                      <X className="w-4 h-4" />
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="text-lg font-semibold">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-lg font-semibold">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Âge</p>
                    <p className="text-lg font-semibold">{user.age || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Taille</p>
                    <p className="text-lg font-semibold">{user.height || "-"} cm</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Poids</p>
                    <p className="text-lg font-semibold">{user.weight || "-"} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Objectif</p>
                    <p className="text-lg font-semibold">{user.goal || "-"}</p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="p-6 border border-border">
              <h2 className="text-lg font-bold mb-6">Entraînements par semaine</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="workouts" fill="var(--color-primary)" name="Entraînements" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 border border-border">
              <h2 className="text-lg font-bold mb-6">Calories brûlées par semaine</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={caloriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="calories" stroke="var(--color-primary)" name="Calories" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Workout History */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Historique des entraînements</h2>
            <Card className="border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Programme</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Durée</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Exercices</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 text-sm">Nov 8, 2025</td>
                      <td className="px-6 py-4 text-sm font-medium">Chest Day</td>
                      <td className="px-6 py-4 text-sm">1h 15m</td>
                      <td className="px-6 py-4 text-sm">6 exercices</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-green-500/20 text-green-700 rounded-full text-xs font-semibold">
                          Complété
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-border hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 text-sm">Nov 6, 2025</td>
                      <td className="px-6 py-4 text-sm font-medium">Back Day</td>
                      <td className="px-6 py-4 text-sm">1h 20m</td>
                      <td className="px-6 py-4 text-sm">5 exercices</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-green-500/20 text-green-700 rounded-full text-xs font-semibold">
                          Complété
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Dialog open={needsInfoOpen} onOpenChange={setNeedsInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complétez votre profil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Âge</label>
              <Input type="number" name="age" value={formData?.age ?? ""} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Taille (cm)</label>
              <Input type="number" name="height" value={formData?.height ?? ""} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Poids (kg)</label>
              <Input type="number" name="weight" value={formData?.weight ?? ""} onChange={handleChange} />
            </div>
            <Button onClick={handleSave} className="w-full gap-2 bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4" />
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

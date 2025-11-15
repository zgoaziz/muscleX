"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [goal, setGoal] = useState<string>("")
  const [prefs, setPrefs] = useState<{ workoutReminders: boolean; achievements: boolean; weeklySummary: boolean }>({
    workoutReminders: true,
    achievements: true,
    weeklySummary: true,
  })

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await fetch("/api/profile", { cache: "no-store" })
        const data = await res.json()
        if (res.ok && data.user) {
          setGoal(data.user.goal || "")
          setPrefs(data.user.notificationPrefs || { workoutReminders: true, achievements: true, weeklySummary: true })
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function saveGoal() {
    try {
      setSaving(true)
      await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ goal }) })
    } finally {
      setSaving(false)
    }
  }

  async function savePrefs() {
    try {
      setSaving(true)
      await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notificationPrefs: prefs }) })
    } finally {
      setSaving(false)
    }
  }
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-balance">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
      </div>

      {/* Fitness Goal Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Fitness Goal</CardTitle>
          <CardDescription>Define your primary fitness objective</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {["Weight Loss", "Muscle Gain", "Maintenance", "Endurance"].map((g) => (
            <label key={g} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="goal" value={g} className="w-4 h-4" checked={goal === g} onChange={() => setGoal(g)} disabled={loading} />
              <span className="text-sm font-medium">{g}</span>
            </label>
          ))}
          <Button className="mt-4 bg-sidebar-primary hover:bg-sidebar-primary/90" onClick={saveGoal} disabled={saving || loading}>{saving ? "Saving..." : "Update Goal"}</Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Control how you receive updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" checked={prefs.workoutReminders} onChange={(e) => setPrefs({ ...prefs, workoutReminders: e.target.checked })} disabled={loading} />
            <span className="text-sm font-medium">Workout Reminders</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" checked={prefs.achievements} onChange={(e) => setPrefs({ ...prefs, achievements: e.target.checked })} disabled={loading} />
            <span className="text-sm font-medium">Achievement Notifications</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" checked={prefs.weeklySummary} onChange={(e) => setPrefs({ ...prefs, weeklySummary: e.target.checked })} disabled={loading} />
            <span className="text-sm font-medium">Weekly Summary</span>
          </label>
          <Button className="mt-4 bg-sidebar-primary hover:bg-sidebar-primary/90" onClick={savePrefs} disabled={saving || loading}>{saving ? "Saving..." : "Save Preferences"}</Button>
        </CardContent>
      </Card>
    </div>
  )
}

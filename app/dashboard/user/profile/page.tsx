"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "", age: "", height: "", weight: "", goal: "" })

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await fetch("/api/profile", { cache: "no-store" })
        const data = await res.json()
        if (res.ok && data.user) {
          setForm({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            age: data.user.age ? String(data.user.age) : "",
            height: data.user.height ? String(data.user.height) : "",
            weight: data.user.weight ? String(data.user.weight) : "",
            goal: data.user.goal || "",
          })
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setSaving(true)
      const payload = {
        name: form.name,
        phone: form.phone,
        age: form.age ? Number(form.age) : undefined,
        height: form.height ? Number(form.height) : undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        goal: form.goal,
      }
      await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    } finally {
      setSaving(false)
    }
  }
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-balance">My Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your personal information and preferences</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <Label htmlFor="fullname">Full Name</Label>
              <Input id="fullname" placeholder="Your name" className="mt-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={loading} />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="email" className="mt-2" value={form.email} disabled readOnly />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="mt-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} disabled={loading} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" className="mt-2" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} disabled={loading} />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" type="number" className="mt-2" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} disabled={loading} />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" type="number" className="mt-2" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} disabled={loading} />
              </div>
            </div>
            <div>
              <Label htmlFor="goal">Goal</Label>
              <Input id="goal" placeholder="e.g., fat loss, muscle gain" className="mt-2" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} disabled={loading} />
            </div>
            <Button className="bg-sidebar-primary hover:bg-sidebar-primary/90" type="submit" disabled={saving || loading}>{saving ? "Saving..." : "Save Changes"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

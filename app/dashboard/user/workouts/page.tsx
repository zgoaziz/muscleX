"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function WorkoutsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState("")
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [form, setForm] = useState({ title: "", type: "custom", duration: 0, status: "in_progress" as "completed" | "in_progress" })
  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState({ title: "", type: "custom", duration: 0, status: "in_progress" as "completed" | "in_progress" })

  const filtered = useMemo(() => {
    if (!q) return items
    const s = q.toLowerCase()
    return items.filter((it) => (it.title || "").toLowerCase().includes(s) || (it.type || "").toLowerCase().includes(s))
  }, [q, items])

  async function load() {
    try {
      setLoading(true)
      const params = q ? `?q=${encodeURIComponent(q)}` : ""
      const res = await fetch(`/api/workouts/sessions${params}`, { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur")
      setItems(data.items || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onEdit(it: any) {
    setEditing(it)
    setForm({ title: it.title || "", type: it.type || "custom", duration: it.duration || 0, status: it.status || "in_progress" })
    setOpen(true)
  }

  async function onDelete(id: string) {
    if (!confirm("Supprimer cette séance ?")) return
    const res = await fetch(`/api/workouts/sessions/${id}`, { method: "DELETE" })
    if (res.ok) load()
  }

  async function onSubmit() {
    if (!editing?._id) return
    const res = await fetch(`/api/workouts/sessions/${editing._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setOpen(false)
      load()
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold text-balance">My Workouts</h1>
          <Input placeholder="Search workouts" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} className="w-64" />
          <Button variant="outline" onClick={load}>Filter</Button>
        </div>
        <Button className="bg-sidebar-primary hover:bg-sidebar-primary/90" onClick={() => { setCreateForm({ title: "", type: "custom", duration: 0, status: "in_progress" }); setCreateOpen(true) }}>+ New Workout</Button>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4">
          {filtered.map((workout: any) => (
            <Card key={workout._id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{workout.title || workout.workoutName || "Séance"}</h3>
                    <p className="text-sm text-muted-foreground">{new Date(workout.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right mr-6">
                    <p className="font-semibold">{workout.duration || 0} mins</p>
                    <p className="text-sm text-muted-foreground capitalize">{workout.status || "in_progress"}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(workout)}><Edit2 className="h-4 w-4" /></Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(workout._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No workouts recorded yet.</p>
            <Button className="bg-sidebar-primary hover:bg-sidebar-primary/90" onClick={() => { setCreateForm({ title: "", type: "custom", duration: 0, status: "in_progress" }); setCreateOpen(true) }}>
              Log Your First Workout
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="hidden" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Workout</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="duration">Duration (min)</Label>
              <Input id="duration" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value || 0) })} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Input id="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="mt-2" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button className="bg-sidebar-primary hover:bg-sidebar-primary/90" onClick={onSubmit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogTrigger asChild>
          <button className="hidden" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Workout</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="ctitle">Title</Label>
              <Input id="ctitle" value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="cduration">Duration (min)</Label>
              <Input id="cduration" type="number" value={createForm.duration} onChange={(e) => setCreateForm({ ...createForm, duration: Number(e.target.value || 0) })} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="cstatus">Status</Label>
              <Input id="cstatus" value={createForm.status} onChange={(e) => setCreateForm({ ...createForm, status: e.target.value as any })} className="mt-2" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Annuler</Button>
            <Button className="bg-sidebar-primary hover:bg-sidebar-primary/90" onClick={async () => {
              const res = await fetch("/api/workouts/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...createForm, date: new Date().toISOString(), exercises: [] }) })
              if (res.ok) { setCreateOpen(false); load() }
            }}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function AdminProgramsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [levels, setLevels] = useState<string[]>(["beginner", "intermediate", "advanced"])
  const [q, setQ] = useState("")
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    level: "beginner",
    duration: 4,
    sessionsPerWeek: 3,
  })

  const filtered = useMemo(() => {
    if (!q) return items
    const s = q.toLowerCase()
    return items.filter((p) => (p.name || "").toLowerCase().includes(s))
  }, [q, items])

  async function load() {
    try {
      setLoading(true)
      const [taxRes, prRes] = await Promise.all([
        fetch("/api/taxonomies", { cache: "no-store" }),
        fetch("/api/programs", { cache: "no-store" }),
      ])
      const taxData = await taxRes.json()
      const prData = await prRes.json()
      if (taxRes.ok && taxData.value?.levels) setLevels(taxData.value.levels)
      if (prRes.ok) setItems(prData.items || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function onCreate() {
    setEditing(null)
    setForm({ name: "", description: "", image: "", level: levels[0] || "beginner", duration: 4, sessionsPerWeek: 3 })
    setOpen(true)
  }

  function onEdit(p: any) {
    setEditing(p)
    setForm({
      name: p.name || "",
      description: p.description || "",
      image: p.image || "",
      level: p.level || (levels[0] || "beginner"),
      duration: p.duration || 4,
      sessionsPerWeek: p.sessionsPerWeek || 3,
    })
    setOpen(true)
  }

  async function onDelete(id: string) {
    if (!confirm("Supprimer ce programme ?")) return
    const res = await fetch(`/api/programs/${id}`, { method: "DELETE" })
    if (res.ok) load()
  }

  async function onSubmit() {
    const url = editing?._id ? `/api/programs/${editing._id}` : "/api/programs"
    const method = editing?._id ? "PUT" : "POST"
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    if (res.ok) {
      setOpen(false)
      load()
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-balance">Program Management</h1>
          <p className="text-muted-foreground mt-2">Create and manage training programs</p>
        </div>
        <div className="flex items-center gap-3">
          <Input placeholder="Search programs" value={q} onChange={(e) => setQ(e.target.value)} className="w-64" />
          <Button className="bg-sidebar-primary hover:bg-sidebar-primary/90" onClick={onCreate}>Create Program</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Programs</CardTitle>
          <CardDescription>All training programs in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(loading ? [] : filtered).map((p: any) => (
              <div key={p._id} className="flex items-center justify-between border-b py-3 last:border-b-0">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.level} • {p.duration}w • {p.sessionsPerWeek}x/week</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(p)}>Edit</Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => onDelete(p._id)}>Delete</Button>
                </div>
              </div>
            ))}
            {loading && <div className="py-6 text-center text-muted-foreground">Chargement...</div>}
            {!loading && filtered.length === 0 && <div className="py-6 text-center text-muted-foreground">Aucun programme</div>}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="hidden" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Program" : "Create Program"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              <div className="mt-2 flex items-center gap-2">
                <Input id="image" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    try {
                      setUploading(true)
                      const fd = new FormData()
                      fd.append("file", file)
                      fd.append("label", form.name || "program-image")
                      const res = await fetch("/api/media", { method: "POST", body: fd })
                      const data = await res.json()
                      if (res.ok && data.url) {
                        setForm({ ...form, image: data.url })
                      }
                    } finally {
                      setUploading(false)
                      // reset input so same file can be re-selected if needed
                      ;(e.target as HTMLInputElement).value = ""
                    }
                  }}
                />
              </div>
              {uploading && <div className="text-xs text-muted-foreground mt-1">Uploading...</div>}
            </div>
            <div>
              <Label>Level</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {levels.map((lv) => (
                  <Button key={lv} variant={form.level === lv ? "default" : "outline"} onClick={() => setForm({ ...form, level: lv })}>
                    {lv}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (weeks)</Label>
                <Input id="duration" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value || 0) })} className="mt-2" />
              </div>
              <div>
                <Label htmlFor="spw">Sessions/Week</Label>
                <Input id="spw" type="number" value={form.sessionsPerWeek} onChange={(e) => setForm({ ...form, sessionsPerWeek: Number(e.target.value || 0) })} className="mt-2" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button className="bg-sidebar-primary hover:bg-sidebar-primary/90" onClick={onSubmit}>{editing ? "Enregistrer" : "Créer"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

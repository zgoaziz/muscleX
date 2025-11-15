"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function AdminExercisesPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState("")
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [tax, setTax] = useState<{ muscles: string[]; levels: string[]; equipment: string[] }>({ muscles: [], levels: [], equipment: [] })
  const [form, setForm] = useState({ name: "", description: "", muscles: [] as string[], level: "beginner", equipment: [] as string[], media: [] as string[] })
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")

  const filtered = useMemo(() => {
    if (!q) return items
    const s = q.toLowerCase()
    return items.filter((e) => (e.name || "").toLowerCase().includes(s))
  }, [q, items])

  async function load() {
    try {
      setLoading(true)
      const [taxRes, exRes] = await Promise.all([
        fetch("/api/taxonomies", { cache: "no-store" }),
        fetch("/api/exercises", { cache: "no-store" }),
      ])
      const taxData = await taxRes.json()
      const exData = await exRes.json()
      if (taxRes.ok && taxData.value) setTax(taxData.value)
      if (exRes.ok) setItems(exData.items || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function onAdd() {
    setEditing(null)
    setForm({ name: "", description: "", muscles: [], level: "beginner", equipment: [], media: [] })
    setOpen(true)
  }

  function onEdit(x: any) {
    setEditing(x)
    setForm({ name: x.name || "", description: x.description || "", muscles: x.muscles || [], level: x.level || "beginner", equipment: x.equipment || [], media: Array.isArray(x.media) ? x.media : [] })
    setOpen(true)
  }

  async function onDelete(id: string) {
    if (!confirm("Supprimer cet exercice ?")) return
    const res = await fetch(`/api/exercises/${id}`, { method: "DELETE" })
    if (res.ok) load()
  }

  async function onSubmit() {
    const payload = { ...form }
    const url = editing?._id ? `/api/exercises/${editing._id}` : "/api/exercises"
    const method = editing?._id ? "PUT" : "POST"
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    if (res.ok) {
      setOpen(false)
      load()
    }
  }

  const toggleInArray = (arr: string[], value: string) => (arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-balance">Exercise Management</h1>
          <p className="text-muted-foreground mt-2">Manage available exercises in the system</p>
        </div>
        <div className="flex items-center gap-3">
          <Input placeholder="Search exercises" value={q} onChange={(e) => setQ(e.target.value)} className="w-64" />
          <Button className="bg-sidebar-primary hover:bg-sidebar-primary/90" onClick={onAdd}>Add Exercise</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exercise Library</CardTitle>
          <CardDescription>All exercises available for programs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(loading ? [] : filtered).map((e: any) => (
              <div key={e._id} className="flex items-center justify-between border-b py-3 last:border-b-0">
                <div>
                  <div className="font-medium">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{(e.muscles || []).join(", ")} • {e.level} • {(e.equipment || []).join(", ")}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(e)}>Edit</Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => onDelete(e._id)}>Delete</Button>
                </div>
              </div>
            ))}
            {loading && <div className="py-6 text-center text-muted-foreground">Chargement...</div>}
            {!loading && filtered.length === 0 && <div className="py-6 text-center text-muted-foreground">Aucun exercice</div>}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="hidden" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Exercise" : "Add Exercise"}</DialogTitle>
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
              <Label>Level</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {tax.levels.map((lv) => (
                  <Button key={lv} variant={form.level === lv ? "default" : "outline"} onClick={() => setForm({ ...form, level: lv })}>
                    {lv}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label>Muscles</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {tax.muscles.map((m) => (
                  <Button key={m} variant={form.muscles.includes(m) ? "default" : "outline"} onClick={() => setForm({ ...form, muscles: toggleInArray(form.muscles, m) })}>
                    {m}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label>Equipment</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {tax.equipment.map((eq) => (
                  <Button key={eq} variant={form.equipment.includes(eq) ? "default" : "outline"} onClick={() => setForm({ ...form, equipment: toggleInArray(form.equipment, eq) })}>
                    {eq}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label>Media</Label>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    setUploadError("")
                    try {
                      setUploading(true)
                      const fd = new FormData()
                      fd.append("file", file)
                      fd.append("label", form.name || "exercise-media")
                      const res = await fetch("/api/media", { method: "POST", body: fd })
                      const data = await res.json()
                      if (res.ok && data.url) {
                        setForm((f) => ({ ...f, media: [...(f.media || []), data.url as string] }))
                      } else {
                        setUploadError(data?.error || "Upload failed")
                      }
                    } catch (err) {
                      setUploadError("Upload failed")
                    } finally {
                      setUploading(false)
                      ;(e.target as HTMLInputElement).value = ""
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const url = prompt("Add image URL")?.trim()
                    if (url) setForm((f) => ({ ...f, media: [...(f.media || []), url] }))
                  }}
                >
                  Add by URL
                </Button>
                {uploading && <div className="text-xs text-muted-foreground">Uploading...</div>}
                {uploadError && <div className="text-xs text-destructive">{uploadError}</div>}
              </div>
              {form.media && form.media.length > 0 && (
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {form.media.map((m, i) => (
                    <div key={m + i} className="relative group border rounded overflow-hidden">
                      <img src={m} alt="media" className="w-full h-24 object-cover" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 text-xs px-2 py-1 bg-background/80 border rounded opacity-0 group-hover:opacity-100 transition"
                        onClick={() => setForm((f) => ({ ...f, media: f.media.filter((_, idx) => idx !== i) }))}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button className="bg-sidebar-primary hover:bg-sidebar-primary/90" onClick={onSubmit}>{editing ? "Enregistrer" : "Ajouter"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

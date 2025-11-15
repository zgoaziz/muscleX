"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminMediaPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ url: "", label: "" })
  const [saving, setSaving] = useState(false)

  async function load() {
    try {
      setLoading(true)
      const res = await fetch("/api/media", { cache: "no-store" })
      const data = await res.json()
      if (res.ok) setItems(data.items || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onAdd() {
    if (!form.url.trim()) return
    try {
      setSaving(true)
      const res = await fetch("/api/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      if (res.ok) {
        setForm({ url: "", label: "" })
        load()
      }
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Supprimer ce média ?")) return
    const res = await fetch(`/api/media/${id}`, { method: "DELETE" })
    if (res.ok) load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-balance">Media Management</h1>
          <p className="text-muted-foreground mt-2">Upload and manage media files</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Media (URL)</CardTitle>
          <CardDescription>Provide a direct URL and optional label</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <Input placeholder="https://..." value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="flex-1" />
            <Input placeholder="Label (optional)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="flex-1" />
            <Button className="bg-sidebar-primary hover:bg-sidebar-primary/90" onClick={onAdd} disabled={saving}>
              {saving ? "Saving..." : "Add"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media Files</CardTitle>
          <CardDescription>All uploaded media and images</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground py-6">Chargement...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {items.map((m: any) => (
                <div key={m._id} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-muted">
                    <img src={m.url} alt={m.label || "media"} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div className="text-sm truncate mr-2">{m.label || m.url}</div>
                    <Button variant="outline" size="sm" className="text-destructive" onClick={() => onDelete(m._id)}>Delete</Button>
                  </div>
                </div>
              ))}
              {!items.length && <div className="col-span-3 text-center text-muted-foreground py-6">Aucun média</div>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

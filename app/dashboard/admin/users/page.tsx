"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState("")
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [form, setForm] = useState({ name: "", email: "", role: "user" })

  const filtered = useMemo(() => {
    if (!q) return users
    const s = q.toLowerCase()
    return users.filter((u) =>
      (u.name || "").toLowerCase().includes(s) || (u.email || "").toLowerCase().includes(s) || (u.role || "").toLowerCase().includes(s)
    )
  }, [q, users])

  async function load() {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/users", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur")
      setUsers(data.items || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function onAdd() {
    setEditing(null)
    setForm({ name: "", email: "", role: "user" })
    setOpen(true)
  }

  function onEdit(u: any) {
    setEditing(u)
    setForm({ name: u.name || "", email: u.email || "", role: u.role || "user" })
    setOpen(true)
  }

  async function onDelete(id: string) {
    if (!confirm("Supprimer cet utilisateur ?")) return
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
    if (res.ok) load()
  }

  async function onSubmit() {
    const payload = { ...form }
    if (editing?._id) {
      const res = await fetch(`/api/admin/users/${editing._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      if (res.ok) {
        setOpen(false)
        load()
      }
    } else {
      const res = await fetch(`/api/admin/users`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      if (res.ok) {
        setOpen(false)
        load()
      }
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-balance">User Management</h1>
        <div className="flex items-center gap-3">
          <Input placeholder="Rechercher nom, email, rôle" value={q} onChange={(e) => setQ(e.target.value)} className="w-64" />
          <Button className="bg-sidebar-primary hover:bg-sidebar-primary/90" onClick={onAdd}>Add User</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage platform users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Role</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {(loading ? [] : filtered).map((user: any) => (
                  <tr key={user._id} className="border-b last:border-b-0 hover:bg-muted/50">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.role || "user"}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => onEdit(user)}>Edit</Button>
                      <Button variant="outline" size="sm" onClick={() => onDelete(user._id)} className="text-destructive">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && <div className="py-6 text-center text-muted-foreground">Chargement...</div>}
            {!loading && filtered.length === 0 && (
              <div className="py-6 text-center text-muted-foreground">Aucun utilisateur</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* hidden trigger to satisfy component API */}
          <button className="hidden" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit User" : "Add User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-2" />
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

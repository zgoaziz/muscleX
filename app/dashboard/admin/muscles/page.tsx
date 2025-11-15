"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminMusclesPage() {
  const [muscles, setMuscles] = useState<string[]>([])
  const [levels, setLevels] = useState<string[]>([])
  const [equipment, setEquipment] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newVal, setNewVal] = useState<{ [k: string]: string }>({ muscles: "", levels: "", equipment: "" })

  async function load() {
    try {
      setLoading(true)
      const res = await fetch("/api/taxonomies", { cache: "no-store" })
      const data = await res.json()
      if (res.ok && data.value) {
        setMuscles(data.value.muscles || [])
        setLevels(data.value.levels || [])
        setEquipment(data.value.equipment || [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function saveAll() {
    try {
      setSaving(true)
      const res = await fetch("/api/taxonomies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: { muscles, levels, equipment } }),
      })
      if (res.ok) load()
    } finally {
      setSaving(false)
    }
  }

  function addItem(kind: "muscles" | "levels" | "equipment") {
    const v = (newVal[kind] || "").trim().toLowerCase()
    if (!v) return
    if (kind === "muscles" && !muscles.includes(v)) setMuscles([...muscles, v])
    if (kind === "levels" && !levels.includes(v)) setLevels([...levels, v])
    if (kind === "equipment" && !equipment.includes(v)) setEquipment([...equipment, v])
    setNewVal({ ...newVal, [kind]: "" })
  }

  function removeItem(kind: "muscles" | "levels" | "equipment", value: string) {
    if (kind === "muscles") setMuscles(muscles.filter((x) => x !== value))
    if (kind === "levels") setLevels(levels.filter((x) => x !== value))
    if (kind === "equipment") setEquipment(equipment.filter((x) => x !== value))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-balance">Muscle Groups</h1>
          <p className="text-muted-foreground mt-2">Manage taxonomies for exercises</p>
        </div>
        <Button className="bg-sidebar-primary hover:bg-sidebar-primary/90" onClick={saveAll} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Taxonomies</CardTitle>
          <CardDescription>Muscle groups, difficulty levels and equipment options</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground py-6">Chargement...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Muscles */}
              <div>
                <h3 className="font-semibold mb-2">Muscle Groups</h3>
                <div className="flex gap-2 mb-3">
                  <Input placeholder="add muscle..." value={newVal.muscles} onChange={(e) => setNewVal({ ...newVal, muscles: e.target.value })} />
                  <Button variant="outline" onClick={() => addItem("muscles")}>Add</Button>
                </div>
                <div className="space-y-2">
                  {muscles.map((m) => (
                    <div key={m} className="p-2 bg-muted rounded flex items-center justify-between">
                      <span className="capitalize">{m}</span>
                      <Button variant="outline" size="sm" onClick={() => removeItem("muscles", m)}>Remove</Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Levels */}
              <div>
                <h3 className="font-semibold mb-2">Difficulty</h3>
                <div className="flex gap-2 mb-3">
                  <Input placeholder="add level..." value={newVal.levels} onChange={(e) => setNewVal({ ...newVal, levels: e.target.value })} />
                  <Button variant="outline" onClick={() => addItem("levels")}>Add</Button>
                </div>
                <div className="space-y-2">
                  {levels.map((lv) => (
                    <div key={lv} className="p-2 bg-muted rounded flex items-center justify-between">
                      <span className="capitalize">{lv}</span>
                      <Button variant="outline" size="sm" onClick={() => removeItem("levels", lv)}>Remove</Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment */}
              <div>
                <h3 className="font-semibold mb-2">Equipment</h3>
                <div className="flex gap-2 mb-3">
                  <Input placeholder="add equipment..." value={newVal.equipment} onChange={(e) => setNewVal({ ...newVal, equipment: e.target.value })} />
                  <Button variant="outline" onClick={() => addItem("equipment")}>Add</Button>
                </div>
                <div className="space-y-2">
                  {equipment.map((eq) => (
                    <div key={eq} className="p-2 bg-muted rounded flex items-center justify-between">
                      <span className="capitalize">{eq}</span>
                      <Button variant="outline" size="sm" onClick={() => removeItem("equipment", eq)}>Remove</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

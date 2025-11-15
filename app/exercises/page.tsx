"use client"

import { useEffect, useMemo, useState } from "react"
import { Navbar } from "@/components/navbar"
import { ExerciseCard } from "@/components/exercise-card"
import type { Muscle, Level, Equipment } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function ExercisesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMuscles, setSelectedMuscles] = useState<Muscle[]>([])
  const [selectedLevels, setSelectedLevels] = useState<Level[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([])
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [tax, setTax] = useState<{ muscles: Muscle[]; levels: Level[]; equipment: Equipment[] }>({ muscles: [], levels: [], equipment: [] })

  useEffect(() => {
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
    load()
  }, [])

  const filteredExercises = useMemo(() => {
    return items.filter((exercise) => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesMuscle = selectedMuscles.length === 0 || (Array.isArray(exercise.muscles) && exercise.muscles.some((m: any) => selectedMuscles.includes(m)))
      const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(exercise.level as any)
      const matchesEquipment = selectedEquipment.length === 0 || (Array.isArray(exercise.equipment) && exercise.equipment.some((e: any) => selectedEquipment.includes(e)))

      return matchesSearch && matchesMuscle && matchesLevel && matchesEquipment
    })
  }, [searchTerm, selectedMuscles, selectedLevels, selectedEquipment, items])

  const toggleFilter = <T extends string>(value: T, state: T[], setState: React.Dispatch<React.SetStateAction<T[]>>) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value))
    } else {
      setState([...state, value])
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedMuscles([])
    setSelectedLevels([])
    setSelectedEquipment([])
  }

  const hasActiveFilters =
    searchTerm || selectedMuscles.length > 0 || selectedLevels.length > 0 || selectedEquipment.length > 0

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-2">Exercise Catalog</h1>
            <p className="text-lg text-muted-foreground">Discover exercises and build your perfect workout</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                {/* Muscles Filter */}
                <div className="bg-card rounded-2xl p-5 border border-border">
                  <h3 className="font-semibold mb-4">Muscle Groups</h3>
                  <div className="space-y-2">
                    {tax.muscles.map((muscle) => (
                      <label
                        key={muscle}
                        className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedMuscles.includes(muscle)}
                          onChange={() => toggleFilter(muscle, selectedMuscles, setSelectedMuscles)}
                          className="w-4 h-4 rounded border-border bg-input accent-primary"
                        />
                        <span className="text-sm capitalize">{muscle}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Level Filter */}
                <div className="bg-card rounded-2xl p-5 border border-border">
                  <h3 className="font-semibold mb-4">Difficulty</h3>
                  <div className="space-y-2">
                    {tax.levels.map((level) => (
                      <label
                        key={level}
                        className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLevels.includes(level)}
                          onChange={() => toggleFilter(level, selectedLevels, setSelectedLevels)}
                          className="w-4 h-4 rounded border-border bg-input accent-primary"
                        />
                        <span className="text-sm capitalize">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Equipment Filter */}
                <div className="bg-card rounded-2xl p-5 border border-border">
                  <h3 className="font-semibold mb-4">Equipment</h3>
                  <div className="space-y-2">
                    {tax.equipment.map((equip) => (
                      <label
                        key={equip}
                        className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedEquipment.includes(equip)}
                          onChange={() => toggleFilter(equip, selectedEquipment, setSelectedEquipment)}
                          className="w-4 h-4 rounded border-border bg-input accent-primary"
                        />
                        <span className="text-sm capitalize">{equip}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button onClick={clearFilters} variant="outline" className="w-full bg-transparent">
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            {/* Exercises Grid */}
            <div className="lg:col-span-3">
              {!loading && filteredExercises.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredExercises.map((exercise: any) => (
                    <ExerciseCard key={exercise._id || exercise.id} exercise={{ ...exercise, id: exercise._id || exercise.id } as any} />
                  ))}
                </div>
              ) : loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No exercises found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
                  <Button onClick={clearFilters} variant="outline" className="mt-6 bg-transparent">
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2, Loader2 } from "lucide-react"

interface WorkoutCompletionModalProps {
  isOpen: boolean
  workoutName: string
  duration: number
  exercises: any[]
  onClose: () => void
  onSubmit: (data: any) => void
}

export function WorkoutCompletionModal({
  isOpen,
  workoutName,
  duration,
  exercises,
  onClose,
  onSubmit,
}: WorkoutCompletionModalProps) {
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    setLoading(true)
    try {
      const completionData = {
        workoutName,
        duration,
        exercises: exercises.map((ex) => ({
          id: ex.id,
          name: ex.name,
          setsCompleted: ex.sets?.filter((s: any) => s.completed).length || 0,
        })),
        calories: Math.floor(duration * 5),
      }

      await onSubmit(completionData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Entraînement complété</DialogTitle>
          <DialogDescription>Vos statistiques ont été enregistrées</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Programme</p>
              <p className="text-lg font-semibold">{workoutName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Durée</p>
                <p className="text-lg font-semibold">
                  {Math.floor(duration / 60)}h {duration % 60}m
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Calories</p>
                <p className="text-lg font-semibold">{Math.floor(duration * 5)} kcal</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Exercices complétés</p>
              <div className="space-y-2">
                {exercises.map((ex, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{ex.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleComplete} disabled={loading} className="flex-1 gap-2 bg-primary hover:bg-primary/90">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Confirmer
                </>
              )}
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

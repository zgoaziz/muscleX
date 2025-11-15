"use client"

import { useEffect, useState } from "react"

interface WorkoutTimerProps {
  startTime: number
  isPaused?: boolean
  showMilliseconds?: boolean
}

export function WorkoutTimer({ startTime, isPaused = false, showMilliseconds = false }: WorkoutTimerProps) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(
      () => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000))
      },
      showMilliseconds ? 100 : 1000,
    )

    return () => clearInterval(interval)
  }, [startTime, isPaused, showMilliseconds])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return hours > 0
      ? `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      : `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return <span className="tabular-nums">{formatTime(elapsed)}</span>
}

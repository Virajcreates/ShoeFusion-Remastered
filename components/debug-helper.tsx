"use client"

import { useState, useEffect } from "react"

interface DebugHelperProps {
  design: any
  activePart: string
}

export function DebugHelper({ design, activePart }: DebugHelperProps) {
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    // Log design changes
    const newLog = `Design updated: ${activePart} - ${JSON.stringify(design[activePart])}`
    setLogs((prev) => [...prev, newLog].slice(-5)) // Keep only the last 5 logs

    console.log(newLog)
  }, [design, activePart])

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs">
      <h3 className="font-bold mb-1">Debug Logs:</h3>
      <ul className="space-y-1">
        {logs.map((log, i) => (
          <li key={i}>{log}</li>
        ))}
      </ul>
    </div>
  )
}

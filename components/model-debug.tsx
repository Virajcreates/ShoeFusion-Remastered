"use client"

import { useEffect, useState } from "react"
import type { ShoeDesign } from "@/lib/types"

interface ModelDebugProps {
  design: ShoeDesign
  activePart: string
  loadingProgress?: number
}

export function ModelDebug({ design, activePart, loadingProgress = 0 }: ModelDebugProps) {
  const [logs, setLogs] = useState<string[]>([])
  const [modelStatus, setModelStatus] = useState<string>("Loading...")
  const [modelType, setModelType] = useState<string>("Detecting...")

  useEffect(() => {
    // Log design changes
    const newLog = `Design updated: ${activePart} - ${design[activePart as keyof ShoeDesign].color}`
    setLogs((prev) => [newLog, ...prev.slice(0, 4)]) // Keep only the last 5 logs

    // Update model status based on loading progress
    if (loadingProgress === 100) {
      setModelStatus("Active")
      setModelType("Custom GLTF Model (shoe_2.glb)")
    } else if (loadingProgress > 0) {
      setModelStatus(`Loading: ${loadingProgress}%`)
    }
  }, [design, activePart, loadingProgress])

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs">
      <h3 className="font-bold mb-1">Model Debug:</h3>
      <div className="mb-2">
        <span className="font-semibold">Status:</span> {modelStatus}
        <span
          className={`ml-2 inline-block w-2 h-2 rounded-full ${
            modelStatus === "Active" ? "bg-green-500" : "bg-yellow-500"
          }`}
        ></span>
      </div>
      <div className="mb-2">
        <span className="font-semibold">Model Type:</span> {modelType}
      </div>
      {loadingProgress < 100 && loadingProgress > 0 && (
        <div className="mb-2">
          <span className="font-semibold">Loading:</span> {loadingProgress}%
          <div className="w-full bg-gray-700 h-1 mt-1 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${loadingProgress}%` }}></div>
          </div>
        </div>
      )}
      <ul className="space-y-1">
        {logs.map((log, i) => (
          <li key={i}>{log}</li>
        ))}
      </ul>
      <div className="mt-2 pt-2 border-t border-white/20">
        <h4 className="font-bold mb-1">Current Colors:</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: design.sole.color }}></div>
            <span>Sole: {design.sole.color}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: design.trim.color }}></div>
            <span>Trim: {design.trim.color}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: design.head.color }}></div>
            <span>Body: {design.head.color}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: design.laces.color }}></div>
            <span>Laces: {design.laces.color}</span>
          </div>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-white/20">
        <h4 className="font-bold mb-1">Active Part:</h4>
        <div className="bg-blue-900/50 p-1 rounded">{activePart.charAt(0).toUpperCase() + activePart.slice(1)}</div>
      </div>
    </div>
  )
}

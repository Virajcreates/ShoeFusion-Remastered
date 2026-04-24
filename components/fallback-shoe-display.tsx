"use client"

import { Loader2 } from "lucide-react"

interface FallbackShoeDisplayProps {
  design: {
    sole: { color: string; material: string }
    trim: { color: string; material: string }
    head: { color: string; material: string }
    laces: { color: string; material: string }
  }
  height?: string
}

export function FallbackShoeDisplay({ design, height = "300px" }: FallbackShoeDisplayProps) {
  // Safely extract colors with fallbacks in case design or its parts are null/undefined
  const getSafeColor = (part: any, defaultColor: string) => {
    if (!part) return defaultColor
    return typeof part === "string" ? part : part.color || defaultColor
  }

  const headColor = getSafeColor(design?.head, "#333333")
  const soleColor = getSafeColor(design?.sole, "#000000")
  const trimColor = getSafeColor(design?.trim, "#ccff00")

  return (
    <div
      className="w-full flex flex-col items-center justify-center bg-transparent relative overflow-hidden"
      style={{ height }}
    >
      <div className="flex flex-col items-center justify-center space-y-6 z-10 p-8">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-80" />
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-black tracking-[0.3em] uppercase text-foreground/70">Waking Engine</span>
          <div className="w-32 h-[2px] bg-foreground/10 overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-primary animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
      </div>
      
      {/* Ghost layout representing the shoe colors dynamically */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center blur-3xl">
        <div className="w-32 h-32 rounded-full" style={{ backgroundColor: headColor }}></div>
        <div className="w-32 h-32 rounded-full absolute mix-blend-screen" style={{ backgroundColor: soleColor, transform: 'translate(40px, 40px)' }}></div>
        <div className="w-32 h-32 rounded-full absolute mix-blend-screen" style={{ backgroundColor: trimColor, transform: 'translate(-40px, 20px)' }}></div>
      </div>
    </div>
  )
}

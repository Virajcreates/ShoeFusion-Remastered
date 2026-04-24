"use client"

import { Suspense, useState, useEffect } from "react"
import { GLTFShoeModel } from "./gltf-shoe-model"
import { EnhancedShoeModel } from "./enhanced-shoe-model"
import { Loader2 } from "lucide-react"
import type { ShoeDesign } from "@/lib/types"

interface ShoeModelProps {
  design: ShoeDesign
  highlight?: string
  fallbackToEnhanced?: boolean
}

export function ShoeModel({ design, highlight, fallbackToEnhanced = true }: ShoeModelProps) {
  const [modelError, setModelError] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Use useEffect to detect client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // If we're on the server or there's an error, use the enhanced model
  if (!isClient || modelError || !fallbackToEnhanced) {
    return <EnhancedShoeModel design={design} highlight={highlight} />
  }

  return <GLTFShoeModel design={design} highlight={highlight} onError={() => setModelError(true)} />
}

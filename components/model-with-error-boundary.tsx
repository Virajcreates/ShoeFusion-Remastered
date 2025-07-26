"use client"

import { ErrorBoundary } from "./error-boundary"
import { ShoeModel } from "./shoe-model"
import { EnhancedShoeModel } from "./enhanced-shoe-model"
import type { ShoeDesign } from "@/lib/types"

interface ModelWithErrorBoundaryProps {
  design: ShoeDesign
  activePart?: string
}

export function ModelWithErrorBoundary({ design, activePart }: ModelWithErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={<EnhancedShoeModel design={design} highlight={activePart} />}
      onError={(error) => console.error("Error in 3D model:", error)}
    >
      <ShoeModel design={design} highlight={activePart} />
    </ErrorBoundary>
  )
}

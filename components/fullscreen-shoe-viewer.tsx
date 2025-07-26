"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, PresentationControls } from "@react-three/drei"
import { ShoeModel } from "@/components/shoe-model"
import { Button } from "@/components/ui/button"
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import type { ShoeDesign } from "@/lib/types"
import { useEventListener } from "@/hooks/use-event-listener"

interface FullscreenShoeViewerProps {
  design: ShoeDesign
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function FullscreenShoeViewer({
  design,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: FullscreenShoeViewerProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [zoom, setZoom] = useState(1.5)

  const isControlled = controlledOpen !== undefined && onOpenChange !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? onOpenChange : setInternalOpen

  // Use our custom hook for the keydown event
  useEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false)
      }
    },
    null,
    { passive: true },
  )

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 4))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 0.5))
  }

  const handleReset = () => {
    setZoom(1.5)
  }

  // Only render on client side
  if (typeof window === "undefined") return null

  return (
    <>
      {trigger && !isControlled && <div onClick={() => setOpen(true)}>{trigger}</div>}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh] p-0">
          <div className="relative w-full h-full">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm"
              aria-label="Close fullscreen view"
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomOut}
                className="bg-background/80 backdrop-blur-sm"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleReset}
                className="bg-background/80 backdrop-blur-sm"
                aria-label="Reset view"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomIn}
                className="bg-background/80 backdrop-blur-sm"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="w-full h-full" shadows>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
              <PresentationControls
                global
                zoom={zoom}
                rotation={[0, 0, 0]}
                polar={[-Math.PI / 4, Math.PI / 4]}
                azimuth={[-Math.PI / 4, Math.PI / 4]}
              >
                <ShoeModel design={design} />
              </PresentationControls>
              <OrbitControls enableZoom={false} />
              <Environment preset="city" />
            </Canvas>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

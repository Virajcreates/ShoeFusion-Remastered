"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
  Bounds,
  Center,
  Html,
  useProgress,
  Stage,
} from "@react-three/drei"
import { ShoeModel } from "@/components/shoe-model"
import { ErrorBoundary } from "./error-boundary"
import { EnhancedShoeModel } from "./enhanced-shoe-model"
import ColorPicker from "@/components/color-picker"
import MaterialSelector from "@/components/material-selector"
import { Button } from "@/components/ui/button"
import { Maximize2, AlertTriangle } from "lucide-react"
import type { ShoeDesign } from "@/lib/types"
import dynamic from "next/dynamic"
import { isWebGLAvailable, getWebGLErrorMessage } from "@/lib/webgl-detection"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FallbackShoeDisplay } from "./fallback-shoe-display"

// Default fallback design to avoid undefined errors
const defaultDesign: ShoeDesign = {
  name: "Custom Design",
  sole: { color: "#ffffff", material: "rubber" },
  head: { color: "#ffffff", material: "leather" },
  trim: { color: "#ffffff", material: "suede" },
  laces: { color: "#ffffff", material: "cotton" },
  size: "8",
}

// Dynamically import the FullscreenShoeViewer with no SSR
const DynamicFullscreenShoeViewer = dynamic(
  () => import("@/components/fullscreen-shoe-viewer").then((mod) => ({ default: mod.FullscreenShoeViewer })),
  { ssr: false },
)

// Loading component
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white text-sm font-medium">Loading 3D Model... {progress.toFixed(0)}%</p>
      </div>
    </Html>
  )
}

// Error fallback component
function ErrorFallback({ design, highlight }: { design: ShoeDesign; highlight?: string }) {
  return <EnhancedShoeModel design={design} highlight={highlight} />
}

interface ShoeCustomizerProps {
  design?: ShoeDesign
  highlight?: string
  onChange?: (design: ShoeDesign) => void
}

export function ShoeCustomizer({ design, highlight, onChange }: ShoeCustomizerProps) {
  // Ensure we have a complete design object with all required properties
  const finalDesign: ShoeDesign = {
    ...defaultDesign,
    ...design,
    sole: {
      color: design?.sole?.color || defaultDesign.sole.color,
      material: design?.sole?.material || defaultDesign.sole.material,
    },
    head: {
      color: design?.head?.color || defaultDesign.head.color,
      material: design?.head?.material || defaultDesign.head.material,
    },
    trim: {
      color: design?.trim?.color || defaultDesign.trim.color,
      material: design?.trim?.material || defaultDesign.trim.material,
    },
    laces: {
      color: design?.laces?.color || defaultDesign.laces.color,
      material: design?.laces?.material || defaultDesign.laces.material,
    },
  }

  const [activePart, setActivePart] = useState<keyof ShoeDesign>("sole")
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [webGLSupported, setWebGLSupported] = useState(true)
  const [canvasError, setCanvasError] = useState<string | null>(null)

  // Check WebGL support on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWebGLSupported(isWebGLAvailable())
    }
  }, [])

  const activeDesignPart = finalDesign[activePart]

  const handleColorChange = (color: string) => {
    if (!onChange) return

    const newDesign: ShoeDesign = {
      ...finalDesign,
      [activePart]: {
        ...activeDesignPart,
        color,
      },
    }

    onChange(newDesign)
  }

  const handleMaterialChange = (material: string) => {
    if (!onChange) return

    const newDesign: ShoeDesign = {
      ...finalDesign,
      [activePart]: {
        ...activeDesignPart,
        material,
      },
    }

    onChange(newDesign)
  }

  const handleCanvasError = (error: Error) => {
    console.error("Canvas error:", error)
    setCanvasError(error.message || "Error rendering 3D model")
    setWebGLSupported(false)
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="relative h-[400px] rounded-lg overflow-hidden bg-gray-900">
        {webGLSupported && !canvasError ? (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFullscreen(true)}
              className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm"
              aria-label="View in fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>

            <ErrorBoundary
              fallback={<FallbackShoeDisplay design={finalDesign} />}
              onError={(error) => handleCanvasError(error)}
            >
              <Canvas
                shadows
                dpr={[1, 2]}
                onCreated={({ gl }) => {
                  // Set pixel ratio to lower value for better performance
                  gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
                  // Enable logarithmic depth buffer for better z-fighting handling
                  gl.logarithmicDepthBuffer = true
                }}
                onError={handleCanvasError}
              >
                <color attach="background" args={["#1a1a1a"]} />

                <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={45} />

                <ErrorBoundary fallback={<ErrorFallback design={finalDesign} highlight={highlight} />}>
                  <Stage environment="city" intensity={0.6} contactShadow shadows>
                    <Bounds fit clip observe margin={1.2}>
                      <Center>
                        <ShoeModel design={finalDesign} highlight={highlight || activePart} />
                      </Center>
                    </Bounds>
                  </Stage>
                </ErrorBoundary>

                <ContactShadows
                  rotation={[Math.PI / 2, 0, 0]}
                  position={[0, -1.5, 0]}
                  opacity={0.6}
                  width={10}
                  height={10}
                  blur={1.5}
                  far={2}
                />

                <Environment preset="city" />

                <OrbitControls
                  enablePan={false}
                  minPolarAngle={Math.PI / 6}
                  maxPolarAngle={Math.PI / 2}
                  minDistance={2}
                  maxDistance={8}
                  enableDamping
                  dampingFactor={0.05}
                />
              </Canvas>

              {/* Use the dynamically imported component with no SSR */}
              {typeof window !== "undefined" && (
                <DynamicFullscreenShoeViewer
                  design={finalDesign}
                  open={showFullscreen}
                  onOpenChange={setShowFullscreen}
                />
              )}
            </ErrorBoundary>
          </>
        ) : (
          <FallbackShoeDisplay design={finalDesign} />
        )}
      </div>

      {!webGLSupported && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>WebGL Not Supported</AlertTitle>
          <AlertDescription>{getWebGLErrorMessage()}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {["sole", "trim", "head", "laces"].map((part) => (
            <button
              key={part}
              onClick={() => setActivePart(part as keyof ShoeDesign)}
              className={`px-4 py-2 rounded-md ${
                activePart === part
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {part.charAt(0).toUpperCase() + part.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Color</h3>
            <ColorPicker color={activeDesignPart?.color || "#FFFFFF"} onChange={handleColorChange} />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Material</h3>
            <MaterialSelector
              activePart={activePart}
              selectedMaterial={activeDesignPart?.material || "rubber"}
              onChange={handleMaterialChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

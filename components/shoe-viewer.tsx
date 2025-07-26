"use client"

import { Suspense, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei"
import { ShoeModel } from "./shoe-model"
import { ErrorBoundary } from "./error-boundary"
import { FallbackShoeDisplay } from "./fallback-shoe-display"
import { isWebGLAvailable } from "@/lib/webgl-detection"

interface ShoeViewerProps {
  design: {
    sole: { color: string; material: string }
    trim: { color: string; material: string }
    head: { color: string; material: string }
    laces: { color: string; material: string }
  }
  height?: string
  interactive?: boolean
  showControls?: boolean
  onLoaded?: () => void
  onError?: () => void
}

export function ShoeViewer({
  design,
  height = "300px",
  interactive = true,
  showControls = false,
  onLoaded,
  onError,
}: ShoeViewerProps) {
  const [webGLAvailable, setWebGLAvailable] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Check if WebGL is available on client side
  useEffect(() => {
    setIsClient(true)
    const webGLCheck = isWebGLAvailable()
    setWebGLAvailable(webGLCheck)

    if (!webGLCheck && onError) {
      onError()
    }
  }, [onError])

  // Call onLoaded when component mounts successfully
  useEffect(() => {
    if (isClient && webGLAvailable && !hasError && onLoaded) {
      // Small delay to ensure the model has time to load
      const timer = setTimeout(() => {
        onLoaded()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isClient, webGLAvailable, hasError, onLoaded])

  // Handle errors
  const handleError = () => {
    setHasError(true)
    if (onError) onError()
  }

  // If WebGL is not available or we're on server side, show fallback
  if (!isClient || !webGLAvailable || hasError) {
    return <FallbackShoeDisplay design={design} height={height} />
  }

  return (
    <ErrorBoundary fallback={<FallbackShoeDisplay design={design} height={height} />} onError={handleError}>
      <Canvas style={{ height, width: "100%" }}>
        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[0, 0, 0]} />
              <meshBasicMaterial color="transparent" />
            </mesh>
          }
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={0.5} />
          <ShoeModel design={design} />
          <Environment preset="studio" />
          {interactive && <OrbitControls enableZoom={showControls} enablePan={false} />}
          <PerspectiveCamera makeDefault position={[0, 0, 4]} />
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  )
}

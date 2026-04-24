"use client"

import { Suspense, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, Html } from "@react-three/drei"
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
      <Canvas style={{ height, width: "100%" }} dpr={[1, 2]}>
        <Suspense
          fallback={
            <Html center>
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium text-foreground whitespace-nowrap bg-background/80 px-3 py-1 rounded-full backdrop-blur-sm">Loading 3D Model...</span>
              </div>
            </Html>
          }
        >
          {/* Dramatic Brutalist Lighting Setup */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 10, 5]} intensity={4.5} color="#ffffff" />
          
          {/* Aggressive Red Rim Light for high contrast */}
          <spotLight position={[-8, 4, -8]} angle={0.8} penumbra={0.5} intensity={500} color="#ff3b30" distance={50} />
          <pointLight position={[-3, 2, -3]} intensity={50} color="#ff3b30" distance={20} />
          
          {/* Cold Blue/White fill from the bottom to define geometric shadows */}
          <pointLight position={[0, -5, 5]} intensity={20} color="#e2e8f0" distance={20} />
          
          <ShoeModel design={design} />
          <Environment preset="city" />
          {interactive && <OrbitControls enableZoom={showControls} enablePan={false} />}
          <PerspectiveCamera makeDefault position={[0, 0, 4]} />
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  )
}

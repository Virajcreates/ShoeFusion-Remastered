"use client"

import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import {
  OrbitControls,
  PerspectiveCamera,
  ContactShadows,
  Environment,
  Bounds,
  Center,
  Html,
  Float,
  SpotLight,
} from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ZoomOut, Camera, Pause, Play, RotateCcw, Share } from "lucide-react"
import type { ShoeDesign } from "@/lib/types"
import { ShoeModel } from "./shoe-model"

// Custom loader component
function Loader({ progress = 0 }: { progress?: number }) {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white text-sm font-medium">Loading 3D Model... {progress.toFixed(0)}%</p>
      </div>
    </Html>
  )
}

// Camera controls with animations
function AnimatedCamera({ zoom, setZoom }: { zoom: number; setZoom: (zoom: number) => void }) {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.z = 5 - zoom * 2
  }, [camera, zoom])

  return null
}

// Environment switcher
function EnvironmentSwitcher({
  environment,
  setEnvironment,
}: {
  environment: string
  setEnvironment: (env: string) => void
}) {
  const environments = [
    "sunset",
    "dawn",
    "night",
    "warehouse",
    "forest",
    "apartment",
    "studio",
    "city",
    "park",
    "lobby",
  ]

  return (
    <Html position={[0, 0, 0]}>
      <div className="absolute bottom-4 left-4 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-lg p-2 shadow-md">
        <select
          value={environment}
          onChange={(e) => setEnvironment(e.target.value)}
          className="text-sm bg-transparent border-none focus:ring-0 focus:outline-none"
        >
          {environments.map((env) => (
            <option key={env} value={env}>
              {env.charAt(0).toUpperCase() + env.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </Html>
  )
}

// Screenshot functionality
function ScreenshotButton() {
  const { gl, scene, camera } = useThree()

  const takeScreenshot = () => {
    gl.render(scene, camera)
    const screenshot = gl.domElement.toDataURL("image/png")

    // Create download link
    const link = document.createElement("a")
    link.href = screenshot
    link.download = "shoefusion-design.png"
    link.click()
  }

  return (
    <Html position={[0, 0, 0]}>
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="icon"
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full shadow-md hover:scale-110 transition-transform"
          onClick={takeScreenshot}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>
    </Html>
  )
}

interface AdvancedShoeViewerProps {
  design: ShoeDesign
  activePart: string
}

// Main component
export function AdvancedShoeViewer({ design, activePart }: AdvancedShoeViewerProps) {
  const [zoom, setZoom] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [environment, setEnvironment] = useState("city")
  const [fullscreen, setFullscreen] = useState(false)
  const [debugMode, setDebugMode] = useState(false) // Enable debug mode by default for troubleshooting
  const [loadingProgress, setLoadingProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  // Share functionality
  const shareDesign = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Custom Shoe Design",
          text: "Check out my custom shoe design from ShoeFusion!",
          // Ideally this would be a deep link to this exact design
          url: window.location.href,
        })
      } else {
        // Fallback - copy to clipboard
        const url = window.location.href
        navigator.clipboard
          .writeText(url)
          .then(() => alert("Link copied to clipboard!"))
          .catch((err) => console.error("Could not copy text: ", err))
      }
    } catch (error) {
      console.error("Error sharing: ", error)
    }
  }

  // Update loading progress (this would be connected to the actual model loading)
  useEffect(() => {
    // This is a placeholder. In a real implementation, this would be updated by the GLTFLoader
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return Math.min(prev + 5, 100)
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative ${fullscreen ? "fixed inset-0 z-50" : "h-[70vh] rounded-2xl overflow-hidden"}`}
    >
      <Canvas shadows dpr={[1, 2]} className="bg-gradient-to-b from-gray-900 via-gray-800 to-black">
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        <AnimatedCamera zoom={zoom} setZoom={setZoom} />

        {/* Use Environment instead of Stage */}
        <Environment preset={environment} />

        <Suspense fallback={<Loader progress={loadingProgress} />}>
          <Bounds fit clip observe margin={1.2}>
            <Center>
              <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5} enabled={autoRotate}>
                <ShoeModel design={design} highlight={activePart} />
              </Float>
            </Center>
          </Bounds>
        </Suspense>

        {/* Custom lighting to enhance the visual appeal */}
        <SpotLight position={[10, 10, 10]} angle={0.3} penumbra={1} castShadow intensity={0.8} color="#ffffff" />
        <SpotLight position={[-10, 5, -10]} angle={0.3} penumbra={1} castShadow intensity={0.4} color="#add8e6" />

        <ContactShadows
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, -1.5, 0]}
          opacity={0.6}
          width={10}
          height={10}
          blur={1.5}
          far={2}
        />

        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          minDistance={2}
          maxDistance={8}
          enableDamping
          dampingFactor={0.05}
          autoRotate={autoRotate}
          autoRotateSpeed={1}
        />

        <EnvironmentSwitcher environment={environment} setEnvironment={setEnvironment} />
        <ScreenshotButton />
      </Canvas>

      {/* Controls overlay */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-3 items-end">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl p-3 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500 mr-1">Zoom</span>
            <ZoomOut className="h-3 w-3 text-gray-500" />
            <Slider
              value={[zoom]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={(value) => setZoom(value[0])}
              className="w-32"
            />
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full mr-2"
              onClick={() => setAutoRotate(!autoRotate)}
            >
              {autoRotate ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
              {autoRotate ? "Pause" : "Rotate"}
            </Button>

            <Button variant="outline" size="sm" className="rounded-full" onClick={toggleFullscreen}>
              {fullscreen ? "Exit" : "Expand"}
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full shadow-md hover:scale-110 transition-transform"
            onClick={() => {
              // Reset camera position
              setZoom(0)
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full shadow-md hover:scale-110 transition-transform"
            onClick={shareDesign}
          >
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

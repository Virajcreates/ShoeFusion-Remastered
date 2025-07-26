"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn } from "lucide-react"
import { ShoeViewer } from "./shoe-viewer"
import { FallbackShoeDisplay } from "./fallback-shoe-display"

interface ShoeDisplayProps {
  design: {
    sole: { color: string; material: string }
    trim: { color: string; material: string }
    head: { color: string; material: string }
    laces: { color: string; material: string }
  }
  height?: string
  interactive?: boolean
  showControls?: boolean
}

export function ShoeDisplay({ design, height = "300px", interactive = true, showControls = false }: ShoeDisplayProps) {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [timeoutOccurred, setTimeoutOccurred] = useState(false)

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setTimeoutOccurred(true)
        setError(true)
      }
    }, 5000) // 5 seconds timeout

    return () => clearTimeout(timer)
  }, [loading])

  // Handle successful loading
  const handleLoaded = () => {
    setLoading(false)
  }

  // Handle loading error
  const handleError = () => {
    setLoading(false)
    setError(true)
  }

  return (
    <div className="relative">
      <div
        className={`w-full rounded-md overflow-hidden transition-all duration-300 ${
          expanded ? "fixed inset-0 z-50 bg-black/90" : ""
        }`}
        style={{ height: expanded ? "100vh" : height }}
      >
        {error || timeoutOccurred ? (
          <FallbackShoeDisplay design={design} height={expanded ? "100vh" : height} />
        ) : (
          <>
            {loading && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm"
                style={{ height }}
              >
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <ShoeViewer
              design={design}
              height={expanded ? "100vh" : height}
              interactive={interactive}
              showControls={showControls}
              onLoaded={handleLoaded}
              onError={handleError}
            />
          </>
        )}
      </div>

      {showControls && (
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm"
          onClick={() => setExpanded(!expanded)}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      )}

      {expanded && (
        <Button variant="outline" size="sm" className="fixed top-4 right-4 z-50" onClick={() => setExpanded(false)}>
          Close
        </Button>
      )}
    </div>
  )
}

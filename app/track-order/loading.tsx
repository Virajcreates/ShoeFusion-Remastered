import { Loader2 } from "lucide-react"

export default function TrackOrderLoading() {
  return (
    <div className="container py-12 flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading order tracking...</p>
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="container py-8 flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading your saved designs...</p>
      </div>
    </div>
  )
}
